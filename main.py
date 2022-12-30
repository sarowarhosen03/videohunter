import sys
import os
from moviepy.editor import VideoFileClip, AudioFileClip
# print(os.listdir("temp"))
video = VideoFileClip(sys.argv[1])
audio = AudioFileClip(sys.argv[2])
video_with_audio = video.set_audio(audio)
try:
    print("file compresed start")
    video_with_audio.write_videofile("./temp/output.mp4")
    print("file compresed done")
except:
  print("An exception occurred") 







