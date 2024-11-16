Here’s a detailed `README.md` for your ZIP Encryption Electron app:

---

# **ZIP Encryption App**

A user-friendly Electron application for securely encrypting ZIP files. This app features a modern UI, automatic encryption key generation and download, and secure handling of nested directories in ZIP files.

---

## **Features**

### **Core Functionalities**
- Encrypts ZIP files with **AES-256-CBC encryption**.
- Handles nested directories and files in the ZIP while retaining the directory structure.
- Automatically downloads the encryption key as a `.txt` file after successful encryption.

### **User Experience**
- **Modern UI**:
  - Responsive and clean design for better usability.
  - Clear feedback for success and errors.
- **Loader Animation**:
  - Indicates progress during the encryption process.
  - Prevents duplicate actions by disabling inputs during processing.
- **Automatic Form Reset**:
  - Clears all fields and generates a new encryption key after successful encryption.

### **Security Enhancements**
- Implements a **Content Security Policy (CSP)** to comply with Electron security best practices.
- Addresses warnings related to insecure CSP and ensures safe content handling.

---

## **Setup and Installation**

### **Prerequisites**
- **Node.js** (version 14 or higher)
- **npm**

### **Steps to Run**

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm start
   ```

4. **Package the Application (Optional)**:
   To create an executable:
   ```bash
   npm run build
   ```

---

## **How to Use**

1. **Launch the App**:
   - Start the app using the `npm start` command.

2. **Select a ZIP File**:
   - Click **"Choose ZIP File"** and select the ZIP you want to encrypt.

3. **Provide an Output File Name**:
   - Enter the desired name for the encrypted ZIP (e.g., `encrypted.zip`).

4. **Encryption Key**:
   - The app generates an encryption key automatically and displays it.
   - This key is required to decrypt the files later.

5. **Start Encryption**:
   - Click **"Encrypt ZIP"** to begin the process.
   - The app will show a loader while processing and notify you when complete.

6. **Key Download**:
   - After successful encryption, the app automatically downloads the encryption key as a `.txt` file.

7. **Form Reset**:
   - The form resets after success, and a new encryption key is generated for the next operation.

---

## **Folder Structure**

```
project/
├── main.js             # Main Electron process
├── preload.js          # Preload script for secure API exposure
├── renderer.js         # Renderer process (frontend logic)
├── encryption.js       # Encryption logic
├── index.html          # Main UI file
├── package.json        # Project metadata and dependencies
├── temp/               # Temporary directory for extracted files
└── README.md           # Project documentation
```

---

## **Technologies Used**

- **Electron**: For building cross-platform desktop apps.
- **Node.js**: Backend processing for encryption.
- **AdmZip**: For handling ZIP files (extraction and creation).
- **AES-256-CBC**: Secure encryption algorithm.

---

## **Security Best Practices**

- **Content Security Policy (CSP)**:
  - Protects against code injection attacks.
  - Configured to allow only trusted resources.

- **Temporary File Cleanup**:
  - Automatically deletes extracted files and directories after encryption to ensure no sensitive data remains.

---

## **Known Issues and Limitations**

- **Decryption**:
  - Currently, the app supports encryption only. Decryption functionality can be added in future versions.
- **Large Files**:
  - Encryption of very large ZIP files may take longer, depending on system resources.

---

## **Future Enhancements**

- Add decryption functionality to complement encryption.
- Support drag-and-drop for file selection.
- Improve performance for large ZIP files.
- Add localization support for multi-language usage.

---

## **Contributing**

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

---

## **License**

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## **Acknowledgments**

- **Electron Documentation**: For guidance on Electron development.
- **AdmZip Library**: For ZIP file manipulation.
- **Node.js Crypto**: For implementing AES encryption.