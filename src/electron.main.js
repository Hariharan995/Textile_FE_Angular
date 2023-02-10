const { app, BrowserWindow } = require('electron')
const path = require('path');
const url = require('url');

let win;

const createWindow = () => {
    // Create the browser window.
    win = new BrowserWindow({
        width: Infinity,
        height: Infinity,
        icon: './src/assets/test.jpg'
    });

    // and load the app.
    win.loadURL(url.format({
        pathname: 'localhost:4200',
        protocol: 'http:',
        slashes: true
    }));

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    // Set full-screen mode
    // win.setFullScreen(true)

    // Maximize the window
    win.maximize()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});