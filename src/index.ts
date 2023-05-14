import { app, BrowserWindow, ipcMain, shell } from 'electron'
import config from './config'

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    titleBarStyle: 'hidden',
  })

  mainWindow.loadURL(`${config().appUrl}/notes`)

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools()
  }

  app.on('open-url', (event, url) => {
    const idToken = url.match(/access_token=(.*)/)?.[1]

    if (idToken) {
      mainWindow.webContents.loadURL(
        `${config().appUrl}/appLogin/loading?id_token=${idToken}`,
      )
    }
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle('openLogin', (event, arg) => {
  shell.openExternal(`${config().appUrl}/appLogin`)
})

