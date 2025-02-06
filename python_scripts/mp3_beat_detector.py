import librosa
import websocket
import json
import time
import threading
from pydub import AudioSegment
from pydub.playback import play

def detect_beats(filename):
    print("Loading MP3 file for beat detection...")  # Debug log
    y, sr = librosa.load(filename)
    print(f"Loaded {filename} with sample rate {sr}")  # Debug log
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    beat_times = librosa.frames_to_time(beat_frames, sr=sr)
    print("Beats detected at times:", beat_times)  # Debug log
    return beat_times

def send_beats(ws, beat_times, start_time):
    for beat_time in beat_times:
        while time.time() - start_time < beat_time:
            time.sleep(0.01)
        print(f"Sending beat message at time {time.time() - start_time:.2f} s")  # Debug log
        message = json.dumps({"Beat": True})
        print(f"Sending message: {message}")  # Debug log
        ws.send(message)

def on_message(ws, message):
    print(f"Received: {message}")

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print(f"### closed ###, code: {close_status_code}, reason: {close_msg}")

def on_open(ws):
    def run(*args):
        filename = 'flex-fulcrum-demo.mp3'
        print("Starting beat detection...")  # Debug log
        beat_times = detect_beats(filename)
        if beat_times.size == 0:
            print("No beats detected. Exiting.")
            return
        try:
            audio = AudioSegment.from_mp3(filename)
            print("Playing audio...")  # Debug log
            start_time = time.time()

            # Start a thread to play the audio
            audio_thread = threading.Thread(target=play, args=(audio,))
            audio_thread.start()

            # Send beat information in real-time
            send_beats(ws, beat_times, start_time)

            # Wait for the audio thread to finish
            audio_thread.join()

            print("Finished processing beats.")  # Debug log
        except Exception as e:
            print(f"Error in run: {e}")

    threading.Thread(target=run).start()

if __name__ == "__main__":
    print("Starting WebSocket client...")  # Debug log
    websocket.enableTrace(True)
    try:
        ws = websocket.WebSocketApp("ws://localhost:5174/",
                                    on_message=on_message,
                                    on_error=on_error,
                                    on_close=on_close)
        ws.on_open = on_open
        ws.run_forever()
    except Exception as e:
        print(f"Error in main: {e}")
