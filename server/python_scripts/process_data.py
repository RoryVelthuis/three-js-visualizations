# filepath: /C:/Web/Projects/web-socket-test/server/process_data.py

import sys
import json
import logging
import librosa

def process_data(file_path):
    # Load the audio file
    y, sr = librosa.load(file_path)
    # Detect the beats
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    # Convert the beats to timestamps
    beat_times = librosa.frames_to_time(beats, sr=sr)
    return beat_times.tolist()


if __name__ == "__main__":
    # Configure logging to log to a file
    logging.basicConfig(
        filename='app.log',  # Log file name
        filemode='a',        # Append mode
        level=logging.INFO,  # Log level
        format='%(asctime)s - %(levelname)s - %(message)s'  # Log format
    )
    logging.info("Starting data processing")
    
    try:
        input_data = json.loads(sys.stdin.read())
        logging.info(f"Input data: {input_data}")  # Log the input data (track name)
        track_name = input_data['track_name']
        file_path = f'tracks/{track_name}'  # Assuming tracks are stored in the 'tracks' directory
        output_data = process_data(file_path)
        logging.info(f"Processed result: {output_data}")  # Log the processed result
        print(json.dumps({"result": output_data}))
    except Exception as e:
        logging.error(f"Error processing data: {e}")