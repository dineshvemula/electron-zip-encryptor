const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { encryptZipFiles } = require('./encryption');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Correctly load preload.js
            contextIsolation: true,
            sandbox: false,
            nodeIntegration: false,
        },
    });

    //win.webContents.openDevTools();
    win.loadFile('index.html');
    console.log('Main process: Window created.');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
    console.log('Main process: All windows closed.');
});

// Handle file selection
ipcMain.handle('select-file', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'ZIP Files', extensions: ['zip'] }],
    });
    if (result.canceled || result.filePaths.length === 0) {
        throw new Error('No file selected.');
    }
    console.log('Main process: Selected file path:', result.filePaths[0]);
    return result.filePaths[0]; // Return the file path
});

// Handle encryption
ipcMain.handle('encrypt-zip', async (event, { zipPath, key }) => {
    try {
        console.log('Main process: Encrypting ZIP file:', zipPath);

        // Ask user for the download location
        const saveDialogResult = await dialog.showSaveDialog({
            title: 'Save Encrypted ZIP',
            defaultPath: 'encrypted.zip',
            filters: [{ name: 'ZIP Files', extensions: ['zip'] }],
        });

        if (saveDialogResult.canceled || !saveDialogResult.filePath) {
            throw new Error('No download location selected.');
        }

        const outputZipPath = saveDialogResult.filePath;
        await encryptZipFiles(zipPath, outputZipPath, Buffer.from(key, 'hex'));

        // Resolve the output path to an absolute path
        const resolvedOutputPath = path.resolve(outputZipPath);
        console.log('Main process: Encrypted ZIP created at:', resolvedOutputPath);

        return { success: true, message: `Encrypted ZIP created at: ${resolvedOutputPath}` };
    } catch (error) {
        console.error('Main process: Encryption failed:', error);
        return { success: false, message: error.message };
    }
});