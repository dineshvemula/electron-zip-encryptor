document.addEventListener('DOMContentLoaded', () => {
    console.log('Renderer process: DOM loaded.');

    const zipFileButton = document.getElementById('zipFile');
    const zipFileNameSpan = document.getElementById('zipFileName');
    const outputFileInput = document.getElementById('outputFile');
    const keyField = document.getElementById('key');
    const encryptButton = document.getElementById('encryptButton');
    const loader = document.getElementById('loader');
    const statusText = document.getElementById('status');

    // Generate encryption key
    const generatedKey = window.electronAPI.generateEncryptionKey();
    keyField.value = generatedKey;

    // Handle file selection
    zipFileButton.addEventListener('click', async () => {
        try {
            const filePath = await window.electronAPI.selectFile();
            zipFileNameSpan.textContent = filePath;
            zipFileButton.dataset.filePath = filePath;
            console.log('Renderer process: Selected file path:', filePath);
        } catch (error) {
            console.error('Renderer process: File selection error:', error);
            statusText.textContent = error.message;
        }
    });

    // Function to download the encryption key
    function downloadEncryptionKey(key) {
        const blob = new Blob([`Encryption Key:\n\n${key}`], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'encryption-key.txt';
        link.click();
        URL.revokeObjectURL(link.href);
        console.log('Renderer process: Encryption key downloaded.');
    }

    // Handle encryption
    encryptButton.addEventListener('click', async () => {
        const zipPath = zipFileButton.dataset.filePath;
        const outputFile = outputFileInput.value;
        const key = keyField.value;

        if (!zipPath || !outputFile || !key) {
            statusText.textContent = 'Please fill in all fields.';
            return;
        }

        const outputZipPath = zipPath.replace(/[^/]+$/, outputFile);

        try {
            // Show loader and disable buttons
            loader.style.display = 'block';
            zipFileButton.disabled = true;
            encryptButton.disabled = true;
            statusText.textContent = 'Processing...';

            const response = await window.electronAPI.encryptZip(zipPath, outputZipPath, key);
            console.log('Renderer process: Encryption response:', response);

            if (response.success) {
                statusText.textContent = response.message;

                // Download the encryption key
                downloadEncryptionKey(key);

                // Clear the form
                zipFileNameSpan.textContent = '';
                zipFileButton.dataset.filePath = '';
                outputFileInput.value = '';
                keyField.value = window.electronAPI.generateEncryptionKey(); // Generate a new key
            } else {
                statusText.textContent = response.message;
            }
        } catch (error) {
            console.error('Renderer process: Encryption error:', error);
            statusText.textContent = error.message;
        } finally {
            // Hide loader and enable buttons
            loader.style.display = 'none';
            zipFileButton.disabled = false;
            encryptButton.disabled = false;
        }
    });
});