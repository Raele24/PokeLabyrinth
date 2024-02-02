const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const url = require('url')
try { require('electron-reloader')(module);} catch {};
const DiscordRPC = require('discord-rpc');

const log = require('electron-log/main');

const { autoUpdater } = require('electron-updater');

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow = null;

let rpc;

async function setActivity() {
    if (!rpc || !mainWindow) {
        return;
    }

    const activity = { 
        instance: false, 
        startTimestamp, 
        details: "TEST APPLICATION",
        state: "editeting...",
        largeImageKey: "img1",
        largeImageText: "Logo",
        smallImageKey: "img2",
        smallImageText: "Context",
    }; 

    rpc.setActivity(activity);
}

function discordRPC(clientId) {
    if (rpc) {
        rpc.clearActivity();
        rpc.destroy();
        rpc = undefined;
    }
    rpc = new DiscordRPC.Client({ transport: 'ipc' });
    rpc.on('ready', () => {
        setActivity();

        setInterval(() => {
            setActivity();
        }, 15e3);
    });

    startTimestamp = new Date();
    rpc.login({ clientId });
}


const createWindow = () => {
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 1200,
        height: 800,
        icon: __dirname + '/assets/favicon/favicon-96x96.png',
        webPreferences: {
            webSecurity: false, 
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'src/preload.js'),
        },
        frame: false,
        titleBarStyle: 'hidden',
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'src/index.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    mainWindow.on("ready-to-show", () => {
        mainWindow.webContents.openDevTools();  // Open DevTools
    });

}

app.whenReady().then(async ()=>{

    discordRPC("DISCORD_CLIENT_ID");

    ipcMain.on('close', () => {
        BrowserWindow.getFocusedWindow().close();
    });

    ipcMain.on('minimize', () => {
        BrowserWindow.getFocusedWindow().minimize();
    });

    ipcMain.on('maximize', () => {
        if (BrowserWindow.getFocusedWindow().isMaximized()) {
            BrowserWindow.getFocusedWindow().unmaximize();
        } else {
            BrowserWindow.getFocusedWindow().maximize();
        }
    });

    
    if (mainWindow === null){
        createWindow();
        mainWindow.webContents.send('version', app.getVersion());

        log.debug("-----------------------\n\nWindow created\n\n-----------------------");

        autoUpdater.checkForUpdates();

        log.debug("-----------------------\n\nUpdate check\n\n-----------------------");

    }
});

autoUpdater.on('checking-for-update', () => {
    log.debug("Checking for update...");
});

autoUpdater.on('update-not-available', () => {
    log.debug("Update not available");
});

autoUpdater.on('download-progress', (p) => {
    log.debug("Download progress\n" + p.percent + "%");
});
  
autoUpdater.on('update-available', () => {
    log.debug("Update available");
});

autoUpdater.on('update-downloaded', () => {
    log.debug("Update downloaded");
    const options = {
        type: "info",
        buttons: ["Ok"],
        title: "Update Avaible!",
        message: "A new update has been found and downloaded and will be installed when you close the application."
    }
    dialog.showMessageBox(mainWindow, options);
});
