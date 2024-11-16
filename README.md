To implement the same encryption functionality in an **Electron desktop application**, we can use Node.js modules along with the `electron` framework. Here’s how to encrypt all files in a ZIP folder, encrypt them, and create a new encrypted ZIP file using Electron:

---

### **Steps to Build the Electron App**

#### **1. Install Required Libraries**
Install the necessary packages:

```bash
npm install electron cryptography-js adm-zip
```

---

#### **2. Electron Main Process**

Create the `main.js` file to manage the Electron lifecycle and enable communication between the renderer and the main process.

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Create the main application window
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.loadFile('index.html');
}

// Handle app lifecycle
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC listener for encryption request
ipcMain.handle('encrypt-zip', async (event, { zipPath, outputZipPath, key }) => {
    const { encryptZipFiles } = require('./encryption'); // Import encryption logic
    try {
        await encryptZipFiles(zipPath, outputZipPath, key);
        return { success: true, message: 'Encryption completed successfully.' };
    } catch (error) {
        return { success: false, message: error.message };
    }
});
```

---

#### **3. Preload Script**

Create a `preload.js` file to expose the necessary functionality to the renderer process securely.

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    encryptZip: (zipPath, outputZipPath, key) =>
        ipcRenderer.invoke('encrypt-zip', { zipPath, outputZipPath, key }),
});
```

---

#### **4. Encryption Logic**

Create an `encryption.js` file to handle the encryption process.

```javascript
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const AdmZip = require('adm-zip');

// Encrypt a file
function encryptFile(filePath, key) {
    const data = fs.readFileSync(filePath);
    const cipher = crypto.createCipher('aes-256-cbc', key);
    const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

    fs.writeFileSync(filePath, encryptedData);
}

// Decrypt a file (if needed)
function decryptFile(filePath, key) {
    const encryptedData = fs.readFileSync(filePath);
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    fs.writeFileSync(filePath, decryptedData);
}

// Encrypt all files in a ZIP folder
async function encryptZipFiles(zipPath, outputZipPath, key) {
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    // Extract ZIP contents
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(tempDir, true);

    // Encrypt each file
    const files = fs.readdirSync(tempDir);
    files.forEach((file) => {
        const filePath = path.join(tempDir, file);
        encryptFile(filePath, key);
    });

    // Recompress the encrypted files
    const encryptedZip = new AdmZip();
    files.forEach((file) => {
        const filePath = path.join(tempDir, file);
        encryptedZip.addLocalFile(filePath);
    });
    encryptedZip.writeZip(outputZipPath);

    // Cleanup
    files.forEach((file) => fs.unlinkSync(path.join(tempDir, file)));
    fs.rmdirSync(tempDir);
}

module.exports = { encryptZipFiles, decryptFile };
```

---

#### **5. Renderer Process**

Create the frontend interface for the Electron app in `index.html` and `renderer.js`.

**`index.html`**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ZIP Encryption App</title>
</head>
<body>
    <h1>ZIP File Encryption</h1>
    <label for="zipFile">Select ZIP File:</label>
    <input type="file" id="zipFile" accept=".zip" />
    <br />
    <label for="outputFile">Encrypted ZIP Name:</label>
    <input type="text" id="outputFile" placeholder="Encrypted.zip" />
    <br />
    <label for="key">Encryption Key:</label>
    <input type="password" id="key" />
    <br />
    <button id="encryptButton">Encrypt ZIP</button>
    <p id="status"></p>
    <script src="./renderer.js"></script>
</body>
</html>
```

**`renderer.js`**
```javascript
document.getElementById('encryptButton').addEventListener('click', async () => {
    const zipFile = document.getElementById('zipFile').files[0];
    const outputFile = document.getElementById('outputFile').value;
    const key = document.getElementById('key').value;

    if (!zipFile || !outputFile || !key) {
        document.getElementById('status').textContent = 'Please fill in all fields.';
        return;
    }

    const zipPath = zipFile.path;
    const outputZipPath = zipFile.path.replace(zipFile.name, outputFile);

    const response = await window.electronAPI.encryptZip(zipPath, outputZipPath, key);
    document.getElementById('status').textContent = response.message;
});
```

---

### **6. Run the App**

1. Initialize the Electron app:

   ```bash
   npm init -y
   ```

2. Add the start script in `package.json`:

   ```json
   "scripts": {
       "start": "electron ."
   }
   ```

3. Run the app:

   ```bash
   npm start
   ```

---

### **Key Features**
- **Encrypt ZIP Files**: The app extracts the files from a ZIP archive, encrypts them, and compresses them back into an encrypted ZIP.
- **Secure Encryption**: Uses `AES-256-CBC` for encryption.
- **GUI**: A user-friendly interface built with HTML and JavaScript.

---

### **Security Considerations**
1. **Key Storage**:
   - The key should not be hardcoded. Allow users to input the key for each operation.

2. **Cleanup**:
   - Ensure temporary files and directories are removed after processing.

3. **Encryption Algorithm**:
   - `AES-256-CBC` is a secure and widely used encryption standard.

This implementation allows you to encrypt and secure ZIP files directly from an Electron app with a smooth GUI experience.
