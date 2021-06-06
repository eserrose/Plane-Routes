const {app, BrowserWindow, Menu} = require('electron')
const serve = require('electron-serve');

serve({directory: __dirname + '/static'});

function createWindow () {

  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      //below are set to false and true (respectively) by default as of electron 12 so we must change them to use require inside the renderer
      enableRemoteModule: true,
      contextIsolation: false 
    }
  })

  mainWindow.loadURL('file://' + __dirname + '/index.html');
  Menu.setApplicationMenu(null);
}

app.whenReady().then(createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
