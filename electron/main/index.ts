import {app, BrowserWindow, shell, ipcMain, session, dialog, safeStorage, contextBridge, ipcRenderer} from 'electron'
import {release} from 'os'
import {join} from 'path'
import {Window} from "./Window";
import {UserSettingsStore} from "./store/UserSettings"
import {PrimarySettings} from "../../src/view/pages/auth/models/PrimarySettings";
import {useCurrentUserStore} from "../../src/store/CurrentUserStore";

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
    // /dist
    dist: join(__dirname, '../..'),
    // /dist or /public
    public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
const indexHtml = join(ROOT_PATH.dist, 'index.html')

async function createMainWindow() {
    const mainWin = new Window(indexHtml, url)
}

app.whenReady().then(createMainWindow)

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', async () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        await createMainWindow()
    }
})

ipcMain.handle("open-set-directory-dialog", async (event) => {
    return await dialog.showOpenDialog({properties: ['openDirectory', "createDirectory"]})
})

ipcMain.on("set-user-settings", (event, userId: string | number, data: PrimarySettings) => {
    const userSettingsStore = new UserSettingsStore(userId)
    userSettingsStore.saveSettings(data)
})

ipcMain.handle("get-user-settings", async (event, userId: string | number) => {
    const userSettingsStore = new UserSettingsStore(userId)
    return userSettingsStore.getAllSettings().data
})