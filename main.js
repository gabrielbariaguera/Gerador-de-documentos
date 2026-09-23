const { app, BrowserWindow } = require('electron');
const { iniciarServidor, PORT } = require('./server.js');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadURL(`http://localhost:${PORT}`);
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
}

app.whenReady().then(async () => {
    await iniciarServidor();
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});
