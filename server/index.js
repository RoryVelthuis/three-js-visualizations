// filepath: /C:/Web/Projects/web-socket-test/server/index.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');


const app = express();
const server = http.createServer(app);

// Apply CORS middleware
app.use(cors({
    origin: 'http://localhost:5173',  // Allow only this specific frontend origin
    methods: ['GET', 'POST'],
}));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',  // Same origin for Socket.io
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('process_track', (trackName) => {
        console.log(`Track to process: [ ${trackName} ]`);

        // Path to the Python interpreter in the virtual environment
        const pythonPath = path.join(__dirname, 'venv', 'Scripts', 'python.exe');

         // Spawn a Python process to handle the data
         const pythonProcess = spawn('python', ['python_scripts/process_data.py']);
         pythonProcess.stdin.write(JSON.stringify({ track_name: trackName }));
         pythonProcess.stdin.end();
 
         pythonProcess.stdout.on('data', (data) => {
            console.log(`Python stdout: ${data.toString()}`);  // Debugging line
             const result = JSON.parse(data.toString());
             console.log(`Processed result: ${result.result}`);
             // Send the processed result back to the client
             socket.emit('processed_message', result.result);
         });
 
         pythonProcess.stderr.on('data', (data) => {
             console.error(`Python error: ${data.toString()}`);
         });

         pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});