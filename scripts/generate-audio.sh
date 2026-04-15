#!/bin/bash
# Compass Institute — ElevenLabs Audio Generator
#
# Generates narrated audio for weekly overviews and per-slide narration.
# Requires: ElevenLabs API key and Voice ID
#
# Usage:
#   export ELEVENLABS_API_KEY="sk_..."
#   export ELEVENLABS_VOICE_ID="..."
#   bash scripts/generate-audio.sh
#
# Configuration:
#   ELEVENLABS_MODEL  - default: eleven_multilingual_v2
#   STABILITY         - default: 0.4 (lower = more expressive)
#   SIMILARITY        - default: 0.85
#   STYLE             - default: 0.6
#   SPEAKER_BOOST     - default: true

set -e

# Defaults
MODEL="${ELEVENLABS_MODEL:-eleven_multilingual_v2}"
STABILITY="${STABILITY:-0.5}"
SIMILARITY="${SIMILARITY:-0.4}"
STYLE="${STYLE:-0.5}"
BOOST="${SPEAKER_BOOST:-true}"

# Validate
if [ -z "$ELEVENLABS_API_KEY" ]; then
  echo "Error: ELEVENLABS_API_KEY not set"
  echo "  export ELEVENLABS_API_KEY='sk_...'"
  exit 1
fi
if [ -z "$ELEVENLABS_VOICE_ID" ]; then
  echo "Error: ELEVENLABS_VOICE_ID not set"
  echo "  export ELEVENLABS_VOICE_ID='...'"
  exit 1
fi

API="https://api.elevenlabs.io/v1/text-to-speech/$ELEVENLABS_VOICE_ID"
SETTINGS="\"voice_settings\":{\"stability\":$STABILITY,\"similarity_boost\":$SIMILARITY,\"style\":$STYLE,\"use_speaker_boost\":$BOOST}"

generate() {
  local outfile=$1
  local text=$2

  if [ -f "$outfile" ]; then
    echo "  exists: $(basename $outfile)"
    return
  fi

  local json_text=$(python3 -c "import json,sys; print(json.dumps(sys.argv[1]))" "$text")

  curl -s -o "$outfile" "$API" \
    -H "xi-api-key: $ELEVENLABS_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"text\":$json_text,\"model_id\":\"$MODEL\",$SETTINGS}"

  local size=$(wc -c < "$outfile" | tr -d ' ')
  if [ "$size" -lt 1000 ]; then
    echo "  WARNING: $(basename $outfile) is only ${size} bytes — may be an error"
    cat "$outfile"
    echo ""
  else
    echo "  generated: $(basename $outfile) (${size} bytes)"
  fi
}

echo "============================================"
echo " Compass Institute Audio Generator"
echo " Voice: $ELEVENLABS_VOICE_ID"
echo " Model: $MODEL"
echo "============================================"
echo ""

# Create output directories
mkdir -p audio pptx/slide-audio

# --- Weekly Overview Audio ---
echo "=== Weekly Overview Audio ==="
echo "Place your narration scripts in a text file or pass them to this script."
echo "Example: generate audio/week1-overview.mp3 'Welcome to Week 1...'"
echo ""

# --- Per-Slide Audio ---
echo "=== Per-Slide Narration ==="
echo "To generate per-slide audio, prepare narration scripts and call:"
echo ""
echo "  generate pptx/slide-audio/w1-slide2.mp3 'Your narration text here'"
echo ""
echo "See COURSE-TEMPLATE.md for the full workflow."
echo ""

# If a scripts file is provided as argument, process it
if [ -f "$1" ]; then
  echo "Processing scripts from: $1"
  # Expected format: one line per audio file
  # FILENAME|NARRATION TEXT
  while IFS='|' read -r filename text; do
    if [ -n "$filename" ] && [ -n "$text" ]; then
      generate "$filename" "$text"
    fi
  done < "$1"
  echo ""
  echo "Done!"
else
  echo "To batch generate, create a pipe-delimited file:"
  echo "  audio/week1-overview.mp3|Welcome to Week 1..."
  echo "  pptx/slide-audio/w1-slide2.mp3|This slide covers..."
  echo ""
  echo "Then run: bash scripts/generate-audio.sh scripts.txt"
fi
