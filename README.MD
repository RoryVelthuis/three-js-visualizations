# Three.js Visualizations

## Project Setup

This project uses [Three.js](https://threejs.org/) and [Vite](https://vitejs.dev/). Follow the steps below to set up the project.
The project also utilizes FFmpeg. This can be downloaded and installed from here [FFmpeg](https://www.ffmpeg.org/) 

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/RoryVelthuis/three-js-visualizations.git
    ```

2. Navigate to the project directory:
    ```sh
    cd three-js-visualizations
    ```

3. Install the Node.js dependencies:
    ```sh
    npm install
    ```

4. Create a virtual environment for Python dependencies:
    ```sh
    python -m venv venv
    ```

5. Activate the virtual environment:
    - **Windows**:
      ```sh
      .\venv\Scripts\activate
      ```
    - **macOS/Linux**:
      ```sh
      source venv/bin/activate
      ```

6. Install the Python dependencies:
    ```sh
    pip install -r requirements.txt
    ```


### Running the project

1. Open three terminals.

2. In the first terminal, start the development server:
    ```sh
    cd three-js-visualizations
    npm run dev

    navigate to http://localhost:5173/ to view visualizations
    ```

3. In the second terminal, start the WebSocket server:
    ```sh
    cd three-js-visualizations
    npm install ws
    node ws-server.js
    ```

4. In the third terminal, activate the virtual environment and run the Python script:
    ```sh
    cd three-js-visualizations
    .\venv\Scripts\activate (Windows) or source venv/bin/activate (macOS/Linux)
    cd python_scripts
    python beat_detector.py
    ```

### Notes

- Ensure that you have the necessary permissions to create and activate virtual environments on your system.
- If you encounter any issues with the dependencies, make sure that your versions of Node.js and Python are compatible with the packages listed in [package.json](http://_vscodecontentref_/4) and [requirements.txt](http://_vscodecontentref_/5).

### Installing FFmpeg

Detailed instructions for [Installing FFmpeg can be found here](https://www.geeksforgeeks.org/how-to-install-ffmpeg-on-windows/)

==============
