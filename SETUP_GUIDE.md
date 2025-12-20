# API Setup and Installation Guide

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Setup**
   
   The `.env` file is already configured with the API base URL:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://69.62.85.221:8000
   ```

3. **Run the App**
```bash
npm start
```

## New Features Added

### 1. File Selection
- Users can now browse and select audio files from their device
- Supports all audio formats
- Visual confirmation when a file is selected

### 2. API Integration
- **Denoise Audio**: Removes background noise from audio files
- **Voice Boost**: Amplifies voice levels in audio files

### 3. Progress Tracking
- Real-time progress updates during:
  - File upload (0-30%)
  - Processing (30-70%)  
  - Download (70-100%)

### 4. Automatic File Saving
- Processed files are automatically saved to: `VoiceBooster/` folder
- Files are named with timestamps to avoid conflicts:
  - Denoised files: `denoised_YYYY-MM-DDTHH-MM-SS-mmmZ.wav`
  - Boosted files: `boosted_YYYY-MM-DDTHH-MM-SS-mmmZ.wav`

## API Endpoints

### Denoise API
- **URL**: `http://69.62.85.221:8000/api/audio/denoise/`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Parameters**:
  - `audio_file` (required): Audio file to process
  - `noise_type` (optional): `None`, `Kitchen`, `Living Room`, `River`, `Cafe` (default: `None`)
  - `snr` (optional): `-5`, `0`, `10`, `20` (default: `10`)

### Boost API
- **URL**: `http://69.62.85.221:8000/api/audio/boost/`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Parameters**:
  - `audio_file` (required): Audio file to process
  - `mode` (optional): `0` (mild), `1` (moderate), `2` (aggressive) (default: `1`)

## File Structure

```
VoiceBooster/
├── .env                           # Environment variables
├── .env.example                   # Example environment file
│
├── constants/
│   └── api.ts                     # API configuration
│
├── services/
│   ├── api-client.ts              # Axios instance & interceptors
│   └── audio-api.ts               # Audio processing functions
│
├── app/
│   ├── noise-reducer.tsx          # Denoise screen with API integration
│   └── voice-booster.tsx          # Voice boost screen with API integration
│
└── docs/
    └── API_INTEGRATION.md         # Detailed API documentation
```

## How to Use

### Denoise Audio

1. Open the app and navigate to "Noise Reducer"
2. Tap "Browse Files" to select an audio file
3. Once selected, tap "Denoise Audio"
4. Wait for processing (do not close or switch apps)
5. File will be automatically saved to your recordings folder
6. Success message will appear when complete

### Boost Audio

1. Open the app and navigate to "Voice Booster"
2. Tap "Browse Files" to select an audio file
3. Once selected, tap "Boost Voice"
4. Wait for processing (do not close or switch apps)
5. File will be automatically saved to your recordings folder
6. Success message will appear when complete

## Troubleshooting

### Network Errors
- Check your internet connection
- Verify the API server is running at `http://69.62.85.221:8000`

### Timeout Errors
- Large files may take longer to process
- Default timeout is 5 minutes
- Try with smaller audio files first

### File Not Found Errors
- Ensure you've granted storage permissions
- Try selecting the file again

## Technical Details

### Dependencies Added
- **axios** (^1.7.2): HTTP client for API requests
- **expo-document-picker** (~12.0.2): File picker for audio selection

### Error Handling
- Network errors with user-friendly messages
- Timeout handling (5-minute timeout)
- HTTP status code handling (400, 401, 403, 404, 500, 503)
- Automatic retry suggestions

### Progress Tracking
- Upload progress: 0-30%
- API processing: 30-70%
- File download: 70-100%
- Visual progress circle with percentage

### File Management
- Recordings directory: `{FileSystem.documentDirectory}VoiceBooster/`
- Automatic directory creation
- Timestamp-based file naming
- File info validation before upload

## Environment Variables

For Expo apps, environment variables must be prefixed with `EXPO_PUBLIC_`:

```
# ✅ Correct
EXPO_PUBLIC_API_BASE_URL=http://69.62.85.221:8000

# ❌ Incorrect (won't work in Expo)
API_BASE_URL=http://69.62.85.221:8000
```

## Next Steps

To customize the API parameters:

1. **Noise Type**: Edit the `denoiseAudio` call in [noise-reducer.tsx](d:\Akash\startup\VoiceBooster\app\noise-reducer.tsx#L76-L79)
2. **SNR**: Edit the `denoiseAudio` call in [noise-reducer.tsx](d:\Akash\startup\VoiceBooster\app\noise-reducer.tsx#L76-L79)
3. **Boost Mode**: Edit the `boostAudio` call in [voice-booster.tsx](d:\Akash\startup\VoiceBooster\app\voice-booster.tsx#L76-L78)

You can add UI controls (dropdowns, sliders) to let users select these parameters.
