# Three.js Visualizations

## Project Setup

This project uses [Three.js](https://threejs.org/) and [Vite](https://vitejs.dev/). Follow the steps below to set up the project.
The project also utilizes FFmpeg. This can be downloaded and installed from here [FFmpeg](https://www.ffmpeg.org/) 

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation and Setup Guide

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

4. Start the server
```sh
npm run dev
```


### Server (Beat Detection)

1. Navigate to the server directory:
```sh
cd server
```

2. Create a virtual environment:
```sh
python -m venv venv
```

3. Activate the virtual environment:
On Windows
```sh
venv\Scripts\activate
```

On macOS and Linux:
```sh
source venv/bin/activate
```

4. Install the required Node.js packages:
```sh
npm install
```

5. Install the required Python packages:
```sh
pip install -r requirements.txt
```

6. Start the server
```sh
npm run dev
```

### Notes

- Ensure that you have the necessary permissions to create and activate virtual environments on your system.
- If you encounter any issues with the dependencies, make sure that your versions of Node.js and Python are compatible with the packages listed in [package.json](http://_vscodecontentref_/4) and [requirements.txt](http://_vscodecontentref_/5).

### Installing FFmpeg

Detailed instructions for [Installing FFmpeg can be found here](https://www.geeksforgeeks.org/how-to-install-ffmpeg-on-windows/)

==============
