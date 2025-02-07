import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust the URL if your server is running on a different address

let audioContext = new AudioContext();
let audioBuffer = null;
let sourceNode;

let track = '';
let beatTimestamps = [];
let beatTimeouts = [];

document.getElementById('processButton').addEventListener('click', () => {
    const trackSelect = document.getElementById('trackSelect');
    const trackName = trackSelect.value;
    track = trackName;
    socket.emit('process_track', trackName);
});

socket.on('processed_message', (processedMessage) => {
    console.log('Track times returned from server',);
    beatTimestamps = processedMessage;
    console.log('Beat Times: ', beatTimestamps);
    document.getElementById('playButton').disabled = false; // Enable the play button
});

document.getElementById('playButton').addEventListener('click', () => {
    if (beatTimestamps.length > 0) {
        document.getElementById('stopButton').disabled = false;
        playAudio();
    } else {
        console.log('No beat timestamps available');
    }
});

document.getElementById('stopButton').addEventListener('click', () => {
    stopAudio();
});

document.getElementById('trackSelect').addEventListener('change', () => {
    stopAudio();
    beatTimestamps = [];
    document.getElementById('playButton').disabled = true;
    document.getElementById('stopButton').disabled = true;
});

async function loadAudio(filePath) {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

async function playAudio() {
    await loadAudio(`tracks/${track}`);

    if (!audioBuffer) {
        console.error("No audio loaded");
        return;
    }

    if (sourceNode) {
        sourceNode.stop();
        sourceNode.disconnect();
    }

    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(audioContext.destination);
    sourceNode.start(0);

    // Visualize beats
    VisualizeBeats();
}

function stopAudio() {
    console.log('Stopping audio');
    if (sourceNode) {
        sourceNode.stop();
        sourceNode.disconnect();
        sourceNode = null; // Reset the reference
    }

    // Clear all beat visualization timeouts
    beatTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    beatTimeouts = []; // Reset the array
}

function VisualizeBeats() {
    console.log('Beat visualization beginning');
    const beater = document.getElementById('beater');
    const originalRadius = beater.getAttribute('r');
    const maxRadius = 60; // Maximum size for the beater

    const startTime = audioContext.currentTime;

    beatTimestamps.forEach((timestamp) => {
        const timeoutId = setTimeout(() => {
            // Increase the size of the beater
            beater.setAttribute('r', maxRadius);
            // Shrink back to the original size after a short delay
            setTimeout(() => {
                beater.setAttribute('r', originalRadius);
            }, 100); // Adjust the duration as needed
        }, (timestamp - startTime) * 1000);

        // Store the timeout ID
        beatTimeouts.push(timeoutId);
    });
}

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
