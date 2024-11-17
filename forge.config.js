const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: {
      unpack: '**/temp/**', // Exclude the temp directory from being packed into the asar
    },
    icon: './assets/icon', // Base path for the app icon (no file extension required)
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'zip-encryptor', // Matches the name in package.json
        authors: 'Dinesh Vemula',
        description: 'A tool for encrypting ZIP files.',
        setupIcon: './assets/icon.ico', // Path to the icon for the installer
        createDesktopShortcut: true, // Creates a shortcut on the desktop
        createStartMenuShortcut: true, // Creates a shortcut in the Start Menu
        shortcutName: 'Zip Encryptor', // Friendly name for shortcuts
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'win32', 'linux'], // Platforms for ZIP packaging
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'], // Linux DEB packaging
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'], // Linux RPM packaging
    },
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'], // macOS DMG packaging
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};