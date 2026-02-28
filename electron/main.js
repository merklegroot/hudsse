const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let nextProcess;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const port = process.env.PORT || 3002;
const nextUrl = `http://localhost:${port}`;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) {
    mainWindow.loadURL(nextUrl);
    mainWindow.webContents.openDevTools();
  } else {
    startNextServer();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startNextServer() {
  const appPath = app.isPackaged 
    ? path.dirname(process.execPath)
    : app.getAppPath();
  
  const nextPath = path.join(appPath, '.next', 'standalone');
  const serverPath = path.join(nextPath, 'server.js');
  
  nextProcess = spawn('node', [serverPath], {
    env: {
      ...process.env,
      PORT: port,
      NODE_ENV: 'production'
    },
    cwd: nextPath
  });

  nextProcess.stdout.on('data', (data) => {
    console.log(`Next.js: ${data}`);
  });

  nextProcess.stderr.on('data', (data) => {
    console.error(`Next.js: ${data}`);
  });

  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
  });

  setTimeout(() => {
    if (mainWindow) {
      mainWindow.loadURL(nextUrl);
    }
  }, 3000);
}

app.whenReady().then(() => {
  if (isDev) {
    createWindow();
  } else {
    createWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (nextProcess) {
    nextProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (nextProcess) {
    nextProcess.kill();
  }
});
