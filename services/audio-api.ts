import { ENDPOINTS } from '@/constants/api';
import * as FileSystem from 'expo-file-system/legacy';
import apiClient from './api-client';

// Types for API responses
export interface DenoiseResponse {
  id: string;
  original_audio: string;
  processed_audio: string;
  noisy_audio: string;
  noisy_spectrogram: string;
  enhanced_spectrogram: string;
  noise_type: string;
  snr: number;
  processing_type: 'noise_reduction';
  created_at: string;
}

export interface BoostResponse {
  id: string;
  original_audio: string;
  processed_audio: string;
  noisy_spectrogram: string;
  enhanced_spectrogram: string;
  processing_type: 'volume_boost';
  created_at: string;
}

export type NoiseType = 'None' | 'Kitchen' | 'Living Room' | 'River' | 'Cafe';
export type SNR = '-5' | '0' | '10' | '20';
export type BoostMode = '0' | '1' | '2'; // 0 = mild, 1 = moderate, 2 = aggressive

/**
 * Upload audio file for noise reduction
 * @param audioUri - Local file URI of the audio file
 * @param noiseType - Optional noise type (None, Kitchen, Living Room, River, Cafe)
 * @param snr - Optional signal-to-noise ratio (-5, 0, 10, 20)
 * @returns Promise with the denoise response
 */
export async function denoiseAudio(
  audioUri: string,
  noiseType?: NoiseType,
  snr?: SNR
): Promise<DenoiseResponse> {
  try {
    // Create FormData
    const formData = new FormData();

    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    if (!fileInfo.exists) {
      throw new Error('Audio file not found');
    }

    // Extract filename from URI
    const filename = audioUri.split('/').pop() || 'audio.m4a';
    
    // Add file to FormData
    formData.append('audio_file', {
      uri: audioUri,
      type: 'audio/m4a', // or detect from file extension
      name: filename,
    } as any);

    // Add optional parameters
    if (noiseType) {
      formData.append('noise_type', noiseType);
    }
    if (snr) {
      formData.append('snr', snr);
    }

    console.log('[Denoise API] Uploading audio file:', filename);

    // Make API request
    const response = await apiClient.post<DenoiseResponse>(ENDPOINTS.DENOISE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('[Denoise API] Processing complete:', response.data.id);
    return response.data;
  } catch (error: any) {
    console.error('[Denoise API] Error:', error);
    throw new Error(error.customMessage || 'Failed to denoise audio');
  }
}

/**
 * Upload audio file for volume boost
 * @param audioUri - Local file URI of the audio file
 * @param mode - Optional boost mode (0 = mild, 1 = moderate, 2 = aggressive)
 * @returns Promise with the boost response
 */
export async function boostAudio(
  audioUri: string,
  mode?: BoostMode
): Promise<BoostResponse> {
  try {
    // Create FormData
    const formData = new FormData();

    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    if (!fileInfo.exists) {
      throw new Error('Audio file not found');
    }

    // Extract filename from URI
    const filename = audioUri.split('/').pop() || 'audio.m4a';
    
    // Add file to FormData
    formData.append('audio_file', {
      uri: audioUri,
      type: 'audio/m4a', // or detect from file extension
      name: filename,
    } as any);

    // Add optional mode parameter
    if (mode !== undefined) {
      formData.append('mode', mode);
    }

    console.log('[Boost API] Uploading audio file:', filename);

    // Make API request
    const response = await apiClient.post<BoostResponse>(ENDPOINTS.BOOST, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('[Boost API] Processing complete:', response.data.id);
    return response.data;
  } catch (error: any) {
    console.error('[Boost API] Error:', error);
    throw new Error(error.customMessage || 'Failed to boost audio');
  }
}

/**
 * Download a processed audio file from the server and save it locally
 * @param serverPath - The server path of the file (e.g., /media/audio/processed/enhanced_UUID.wav)
 * @param localDirectory - Local directory to save the file
 * @param filename - Optional custom filename
 * @returns Promise with the local file URI
 */
export async function downloadProcessedAudio(
  serverPath: string,
  localDirectory: string,
  filename?: string
): Promise<string> {
  try {
    // Construct full URL
    const fileUrl = serverPath.startsWith('http') 
      ? serverPath 
      : `${apiClient.defaults.baseURL}${serverPath}`;

    // Generate filename if not provided
    const localFilename = filename || serverPath.split('/').pop() || `processed_${Date.now()}.wav`;
    const localUri = `${localDirectory}${localFilename}`;

    console.log('[Download] Downloading from:', fileUrl);
    console.log('[Download] Saving to:', localUri);

    // Ensure directory exists
    const dirInfo = await FileSystem.getInfoAsync(localDirectory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(localDirectory, { intermediates: true });
    }

    // Download file
    const downloadResult = await FileSystem.downloadAsync(fileUrl, localUri);

    if (downloadResult.status === 200) {
      console.log('[Download] File saved successfully:', localUri);
      return localUri;
    } else {
      throw new Error(`Download failed with status: ${downloadResult.status}`);
    }
  } catch (error: any) {
    console.error('[Download] Error:', error);
    throw new Error(`Failed to download file: ${error.message}`);
  }
}
