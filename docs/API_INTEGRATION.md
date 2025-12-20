# API Integration Setup

This document describes the API integration for audio processing (denoise and voice boost).

## Environment Configuration

The API base URL is configured in the `.env` file:

```
EXPO_PUBLIC_API_BASE_URL=http://69.62.85.221:8000
```

**Note:** In Expo, environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app.

## Installation

Install the required dependencies:

```bash
npm install
```

New dependencies added:
- `axios` - HTTP client for API requests
- `expo-document-picker` - File picker for selecting audio files

## API Endpoints

### 1. Noise Reduction
- **Endpoint:** `POST /api/audio/denoise/`
- **Parameters:**
  - `audio_file` (File, required): Input audio file
  - `noise_type` (Text, optional): One of `None`, `Kitchen`, `Living Room`, `River`, `Cafe`
  - `snr` (Text, optional): One of `-5`, `0`, `10`, `20`

### 2. Volume Boost
- **Endpoint:** `POST /api/audio/boost/`
- **Parameters:**
  - `audio_file` (File, required): Input audio file
  - `mode` (Text, optional): `0` (mild), `1` (moderate), `2` (aggressive)

## File Structure

```
constants/
  api.ts                 # API configuration and endpoints

services/
  api-client.ts          # Axios instance with interceptors
  audio-api.ts           # Audio processing API functions

app/
  noise-reducer.tsx      # Denoise screen with API integration
  voice-booster.tsx      # Voice boost screen with API integration
```

## How It Works

1. **File Selection:** User selects an audio file using the document picker
2. **Upload & Process:** File is uploaded to the API using multipart/form-data
3. **Progress Tracking:** Real-time progress updates during upload and processing
4. **Download Results:** Processed audio is downloaded from the server
5. **Save Locally:** Files are saved to `{FileSystem.documentDirectory}VoiceBooster/`

## Usage Example

### Denoise Audio

```typescript
import { denoiseAudio, downloadProcessedAudio } from '@/services/audio-api';

// Upload and process
const response = await denoiseAudio(audioUri, 'None', '10');

// Download processed file
const localUri = await downloadProcessedAudio(
  response.processed_audio,
  recordingsDir,
  'denoised_audio.wav'
);
```

### Boost Audio

```typescript
import { boostAudio, downloadProcessedAudio } from '@/services/audio-api';

// Upload and process
const response = await boostAudio(audioUri, '1'); // moderate boost

// Download processed file
const localUri = await downloadProcessedAudio(
  response.processed_audio,
  recordingsDir,
  'boosted_audio.wav'
);
```

## Error Handling

The API client includes automatic error handling with user-friendly messages:
- Network errors
- Timeout errors (5-minute timeout for audio processing)
- HTTP status errors (400, 401, 403, 404, 500, 503)

## API Client Features

- **Base URL Configuration:** Centralized API endpoint management
- **Request Interceptors:** Automatic logging of all API requests
- **Response Interceptors:** Automatic error handling and logging
- **Timeout Handling:** 5-minute timeout for long audio processing operations
- **Multipart Form Data:** Proper file upload support

## Notes

- All processed files are saved to the same folder as recordings: `VoiceBooster/`
- Files are named with timestamps to avoid conflicts
- Progress tracking provides visual feedback during processing
- Processing can be cancelled by the user
