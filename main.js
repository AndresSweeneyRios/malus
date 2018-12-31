const {app, BrowserWindow} = require('electron')
let mainWindow

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true

const createWindow = () => {
  mainWindow = new BrowserWindow({width: 1200, height: 800, frame: false})
  mainWindow.loadFile('./app/index.html')
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow)
app.on('window-all-closed', () => process.platform !== 'darwin' ? app.quit() : '')
app.on('activate', () => mainWindow === null ? createWindow() : '')