const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const AdmZip = require('adm-zip');

// Encrypt a single file
function encryptFile(filePath, key) {
    console.log('Encrypting file:', filePath);

    const data = fs.readFileSync(filePath);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, key.slice(0, 16)); // First 16 bytes as IV
    const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

    fs.writeFileSync(filePath, encryptedData);
    console.log('File encrypted successfully:', filePath);
}

// Recursive function to traverse directories and encrypt files
function traverseAndEncrypt(dirPath, key, encryptedZip, baseDir) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const filePath = path.join(dirPath, file);

        if (fs.lstatSync(filePath).isDirectory()) {
            console.log('Processing directory:', filePath);
            traverseAndEncrypt(filePath, key, encryptedZip, baseDir); // Recurse into subdirectory
        } else {
            console.log('Processing file:', filePath);

            // Encrypt the file
            encryptFile(filePath, key);

            // Add the encrypted file to the ZIP, maintaining directory structure
            const relativePath = path.relative(baseDir, filePath);
            console.log('Adding file to encrypted ZIP:', relativePath);
            encryptedZip.addLocalFile(filePath, path.dirname(relativePath));
        }
    });
}

// Recursive function to delete a directory and its contents
function deleteDirectoryRecursive(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const currentPath = path.join(dirPath, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                deleteDirectoryRecursive(currentPath); // Recursively delete subdirectories
            } else {
                fs.unlinkSync(currentPath); // Delete file
                console.log('Deleted file:', currentPath);
            }
        });
        fs.rmdirSync(dirPath);
        console.log('Deleted directory:', dirPath);
    }
}

// Encrypt all files in a ZIP and save as a new ZIP
async function encryptZipFiles(zipPath, outputZipPath, key) {
    console.log('Encrypting ZIP file:', zipPath);

    const os = require('os');
const { app } = require('electron');
const tempDir = path.join(app.getPath('temp'), 'zip-encryptor-temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    // Extract ZIP contents
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(tempDir, true);
    console.log('ZIP file extracted to:', tempDir);

    // Create a new encrypted ZIP
    const encryptedZip = new AdmZip();

    // Traverse and encrypt files, and add them to the ZIP
    traverseAndEncrypt(tempDir, key, encryptedZip, tempDir);

    // Write the encrypted ZIP file
    encryptedZip.writeZip(outputZipPath);
    console.log('Encrypted ZIP file created at:', outputZipPath);

    // Cleanup
    deleteDirectoryRecursive(tempDir);
    console.log('Temporary files cleaned up.');
}

module.exports = { encryptZipFiles };