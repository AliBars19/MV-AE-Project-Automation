# MV-AE-Project-Automation

A fully automated pipeline for creating professional 3D music video visuals ready for social media distribution. This project orchestrates audio extraction, image processing, lyrics transcription, and Adobe After Effects rendering into a seamless batch workflow.

##  Overview

MV-AE-Project-Automation is a two-phase system:

1. **Python Backend** (`main.py`) – Processes audio, images, and metadata
2. **After Effects Automation** (`automateMV_batch.jsx`) – Renders final videos

Simply provide a song URL, cover image URL, timestamps, and song title, and the system handles the rest automatically.

##  Features

- **Audio Processing**
  - Downloads audio from YouTube/streaming links using `yt-dlp`
  - Trims audio to specified timestamps
  - Exports as WAV format for After Effects compatibility

- **Image Processing**
  - Downloads cover images from URLs
  - Extracts 4 dominant colors using ColorThief
  - Outputs colors in hex format for AE color grading

- **Lyrics Transcription**
  - Automatic speech-to-text using OpenAI Whisper
  - Word-level timing synchronization
  - Smart line wrapping (25-character limit per line)
  - Outputs JSON with precise lyric timing data

- **After Effects Integration**
  - Batch imports processed assets into AE project
  - Auto-wires compositions with audio, cover art, and lyrics
  - Applies extracted colors to gradient effects
  - Automatically generates render queue
  - Exports to H.264 MP4 format

- **Job Progress Tracking**
  - Resumes interrupted jobs seamlessly
  - Caches intermediate results (audio, lyrics, images, colors)
  - JSON-based job metadata for transparency

##  Quick Start

### Prerequisites

- Python 3.8+
- Adobe After Effects (with JSX scripting support)
- ffmpeg (for audio processing)

### Installation

1. Clone or download the project
2. Install Python dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

### Usage

#### Step 1: Run Python Backend

```powershell
python main.py
```

The script will prompt you for each job (1-12 by default):

```
--- Checking Job 001 ---
[Job 1] Enter AUDIO URL: https://www.youtube.com/watch?v=...
[Job 1] Enter start time (MM:SS): 00:15
[Job 1] Enter end time (MM:SS): 01:45
[Job 1] Enter IMAGE URL: https://example.com/cover.jpg
[Job 1] Enter SONG TITLE (Artist - Song): The Weeknd - Blinding Lights
```

This generates a `jobs/job_001/` folder with:
- `audio_source.mp3` – Original audio
- `audio_trimmed.wav` – Trimmed audio clip
- `cover.png` – Downloaded cover image
- `lyrics.txt` – Transcribed lyrics with timings
- `job_data.json` – Complete metadata

#### Step 2: Prepare After Effects Project

Your AE project should have:
- **Folders:** `Foreground`, `Background`, `OUTPUT1`–`OUTPUT12`
- **Compositions:** 
  - `MAIN` (template composition)
  - `OUTPUT 1`–`OUTPUT 12` (one per job)
  - `LYRIC FONT 1`–`LYRIC FONT 12` (lyrics display)
  - `Assets 1`–`Assets 12` (album art and metadata)
  - `BACKGROUND 1`–`BACKGROUND 12` (gradient backgrounds)
- **Layers & Effects:**
  - Each `OUTPUT` comp should reference `LYRIC FONT` and audio layers
  - Each `BACKGROUND` comp needs a layer named `BG GRADIENT` with a 4-Color Gradient effect
  - Text layers named `LYRIC CURRENT`, `LYRIC PREVIOUS`, `LYRIC NEXT 1`, `LYRIC NEXT 2`

#### Step 3: Run AE Script

1. Open your After Effects project (with above structure)
2. `File` → `Scripts` → `Run Script File...`
3. Select `scripts/automateMV_batch.jsx`
4. Choose the `jobs` folder when prompted
5. Script will:
   - Import all job assets
   - Link audio and images to compositions
   - Set color gradients from extracted palette
   - Populate lyrics with exact timings
   - Queue all jobs for rendering
6. Review the Render Queue and click **Render**

##  Project Structure

```
MV-AE-Project-Automation/
├── main.py                          # Main Python automation script
├── requirements.txt                 # Python dependencies
├── README.md                        # Project documentation
├── scripts/
│   └── automateMV_batch.jsx         # After Effects batch automation
├── template/
│   └── 3D Apple Music.aep           # AE project template
├── jobs/
│   ├── job_001/
│   │   ├── job_data.json            # Metadata (auto-generated)
│   │   ├── audio_source.mp3         # Original audio
│   │   ├── audio_trimmed.wav        # Trimmed audio
│   │   ├── cover.png                # Album art
│   │   └── lyrics.txt               # Transcribed lyrics
│   └── ... (job_002 through job_012)
└── renders/
    ├── job_001.mp4                  # Final rendered video
    └── ... (job_002 through job_012)
```

##  Dependencies

| Package | Purpose |
|---------|---------|
| `yt-dlp` | YouTube audio extraction |
| `ffmpeg` | Audio format conversion |
| `pydub` | Audio trimming and processing |
| `requests` | Download images from URLs |
| `pillow` (PIL) | Image handling |
| `colorthief` | Extract dominant colors |
| `openai-whisper` | Speech-to-text transcription |
| `matplotlib` | Color visualization (optional) |

Install all with:
```powershell
pip install -r requirements.txt
```

##  Color Extraction

The system automatically extracts 4 dominant colors from each cover image:

```python
colors = image_extraction(job_folder)
# Returns: ["#FF5733", "#33FF57", "#3357FF", "#F0FF33"]
```

These colors are applied to After Effects gradient effects for dynamic, music-aware visual styling.

##  Lyrics Format

Generated `lyrics.txt` contains JSON array with timing and text:

```json
[
  {
    "t": 0.5,
    "lyric_prev": "",
    "lyric_current": "When I was young",
    "lyric_next1": "I fell in love",
    "lyric_next2": "With the bright lights"
  },
  ...
]
```

**Key fields:**
- `t` – Start time in seconds
- `lyric_current` – Text to display now
- `lyric_prev`, `lyric_next1`, `lyric_next2` – Context for carousel effects

##  Configuration

The number of jobs can be adjusted in `main.py`:

```python
def batch_generate_jobs():
    base_jobs = 12  # Change this number
```

##  Troubleshooting

### Audio not downloading
- Verify URL is a valid YouTube link or streaming service
- Check internet connection
- Ensure `ffmpeg` is installed: `ffmpeg -version`

### Lyrics not displaying in AE
- Verify text layers exist: `LYRIC CURRENT`, `LYRIC PREVIOUS`, `LYRIC NEXT 1`, `LYRIC NEXT 2`
- Check that `LYRIC FONT N` compositions exist for each job
- Ensure `AUDIO` layer exists in the composition

### Colors not applying to gradients
- Verify `BG GRADIENT` layer exists in `BACKGROUND N` compositions
- Check that layer has a 4-Color Gradient effect applied
- Inspect AE console for color application errors (debug via JSX)

### Render queue empty
- Ensure `OUTPUT N` compositions exist (one per job)
- Verify job_data.json files were created successfully
- Check that audio and image files are accessible

##  Batch Processing

Process up to 12 jobs sequentially:
- **Job resumption:** If interrupted, restart to skip completed steps
- **Memory efficient:** Each job is independent and cached
- **Real-time feedback:** Console output shows progress at each stage

##  Output

Final rendered videos are saved to:
```
renders/job_001.mp4
renders/job_002.mp4
... (up to job_012.mp4)
```

Each video includes:
- Synced lyrics with precise timing
- Color-graded visuals based on album art
- Professional H.264 encoding for social media

##  License

This project is for personal use. Modify and distribute as needed.

##  Support

For issues or improvements, refer to the JSX script's debug output (run with AE Debugger open) or check Python error messages in the terminal.

---

**Last Updated:** November 2025