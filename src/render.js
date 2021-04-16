const { ipcRenderer } = require('electron');
const fs = require('fs');
const process = require('child_process');
const { stdout, stderr } = require('process');
const ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
console.log(command);

const format = 'm3u8'
let outputDirectory = '';

const selFolder = document.querySelector('#selectFolder');
selFolder.addEventListener('click', () => {
    ipcRenderer.send('open-dialog-box-folder');
})

const button = document.querySelector('#selectFile');
button.addEventListener('click', () => {
    ipcRenderer.send('open-dialog-box');
})

ipcRenderer.on('selected-folder', (e, path) => {
    console.log(path);
    if(fs.readdirSync(path).length !== 0){ alert('Choose another directory') }
    else{
        outputDirectory = path.split('\\').join('/');
        alert('Select a .mp4 file to convert');
    }
})

let i = 0;
ipcRenderer.on('selected-file', (e, path) => {

    //conversion using ffmpeg
    process.exec(`ffmpeg -i ${path} ${outputDirectory}/output${i++}.${format}`, (err, stdout, stderr) => {
        try {
            if(err) throw err;
            Notification.requestPermission().then(() => {
                new Notification("Conversion completed", {
                    body : 'Your file was converted successfully'
                })
            });
        } catch (error) {
            console.log(error);
        }
    })
})
