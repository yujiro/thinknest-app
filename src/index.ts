import { app, BrowserWindow, ipcMain, shell } from 'electron'
import config from './config'
import path from 'path'
import { Deeplink } from 'electron-deeplink'
import electronIsDev from 'electron-is-dev'

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
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

  // new Deeplink({ app, mainWindow, protocol: config().scheme, isDev: electronIsDev });

  // if (process.defaultApp) {
  //   if (process.argv.length >= 2) {
  //     app.setAsDefaultProtocolClient(config().scheme, process.execPath, [
  //       path.resolve(process.argv[1]),
  //     ])
  //   }
  // } else {
  //   app.setAsDefaultProtocolClient(config().scheme)
  // }
  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle('openLogin', (event, arg) => {
  shell.openExternal(`${config().appUrl}/appLogin`)
})

