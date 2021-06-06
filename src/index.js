const {app, BrowserWindow} = require('electron')

function createWindow () {

  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false //this is set to true by default as of electron 12 so we must set this to use require inside the renderer
    }
  })

  mainWindow.loadURL('file://' + __dirname + '/index.html');
}

app.whenReady().then(createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
