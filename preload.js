const { contextBridge, ipcRenderer } = require('electron');
const crypto = require('crypto');

console.log('Preload script: Loaded.');

contextBridge.exposeInMainWorld('electronAPI', {
    // Generate encryption key
    generateEncryptionKey: () => {
        const key = crypto.randomBytes(32).toString('hex'); // Generate a 256-bit key
        console.log('Preload script: Generated encryption key:', key);
        return key;
    },

    // Select a file
    selectFile: () => ipcRenderer.invoke('select-file'),

    // Encrypt ZIP
    encryptZip: (zipPath, outputZipPath, key) =>
        ipcRenderer.invoke('encrypt-zip', { zipPath, outputZipPath, key }),
});