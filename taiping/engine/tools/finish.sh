#!/bin/bash
# concat segments -> two-pass loudnorm master -> mux -> 720p review copy
set -e
cd /home/claude/project/out
printf "file 'seg/seg_a.mp4'\nfile 'seg/seg_b.mp4'\nfile 'seg/seg_c.mp4'\n" > concat.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i concat.txt -c copy video_noaudio.mp4
J=$(ffmpeg -hide_banner -i ../audio/mix_premaster.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -y -loglevel error -i ../audio/mix_premaster.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true:print_format=summary,aresample=48000" -ar 48000 audio_master.wav
ffmpeg -y -loglevel error -i video_noaudio.mp4 -i audio_master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 -shortest -movflags +faststart Taiping_Rebellion_1080p_master.mp4
ffmpeg -y -loglevel error -i Taiping_Rebellion_1080p_master.mp4 -vf scale=1280:720:flags=lanczos -c:v libx264 -preset medium -crf 24 -c:a aac -b:a 160k -movflags +faststart Taiping_Rebellion_720p_review.mp4
ls -la Taiping_Rebellion_*.mp4
