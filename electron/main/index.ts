import {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    FileFilter,
    shell,
    Menu,
    MenuItem,
    MenuItemConstructorOptions,
} from 'electron';
import {release} from 'os';
import {join} from 'path';
import {Window} from "./Window";
import {UserSettingsStore} from "./store/UserSettings";
import {PrimarySettings} from "../../src/store/models/PrimarySettings";
import {Transfer} from "../../src/store/models/Transfer";
import {TransferHistory} from "./store/TransferHistory";
import {execFile} from "child_process";
import {SavedProducts} from "./store/SavedProducts";
import {ISavedProduct} from "../../src/store/ScanProductStore";

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

function createMainWindow() {
    win = new Window(indexHtml, url, {
        icon: join(ROOT_PATH.public, "icon.png"),
        title: "Kelvin" + " v" + app.getVersion()
    })
}

app.whenReady().then(() => {
    createMainWindow()
    const template: MenuItem[] = [
        new MenuItem({
            label: "File", submenu: [
                {
                    label: "Settings",
                    click: () => win.webContents.send("open-settings")
                },
                {
                    label: "Exit",
                    click: () =>
                        app.exit()
                },
            ] as MenuItemConstructorOptions[]
        }),
        new MenuItem({
            label: "Help", submenu: [
                {
                    label: "About Kelvin",
                    click: () => win.webContents.send("open-about-app")
                }
            ] as MenuItemConstructorOptions[]
        })
    ]
    const menu = Menu.buildFromTemplate(template)
    // Menu.setApplicationMenu(menu)
})

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
    win.webContents.send("activate", `windowsNumber: ${allWindows}`)
    if (allWindows.length === 0) {
        await createMainWindow()
    } else {
        allWindows[0].focus()
    }
})

ipcMain.handle("open-set-directory-dialog", async (event) => {
    return await dialog.showOpenDialog({properties: ['openDirectory', "createDirectory"]})
})

ipcMain.handle("open-set-filter-dialog", async (event, filters: FileFilter[]) => {
    return await dialog.showOpenDialog({properties: ['openFile'], filters})
})

ipcMain.handle("get-user-settings", async (event, userId: string | number) => {
    const userSettingsStore = new UserSettingsStore(userId)
    return userSettingsStore.getAllSettings().data
})

ipcMain.on("set-user-settings", (event, userId: string | number, data: PrimarySettings) => {
    const userSettingsStore = new UserSettingsStore(userId)
    userSettingsStore.saveSettings(data)
})

ipcMain.handle("get-products", async (event, userId: string | number) => {
    const userSettingsStore = new SavedProducts(userId)
    return userSettingsStore.getProducts().data
})

ipcMain.on("save-products", (event, userId: string | number, data: ISavedProduct[]) => {
    const userSettingsStore = new SavedProducts(userId)
    userSettingsStore.saveProduct(data)
})

ipcMain.once("restart-app", async () => {
    app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
    app.exit(0)
})

ipcMain.handle("save-transfers", async (event, userId: string | number, data: Transfer[]) => {
    const transfersStore = new TransferHistory(userId)
    return await transfersStore.save(data.map(item => new Transfer(item)))
})

ipcMain.handle("get-transfers", async (event, userId: string | number) => {
    const transfersStore = new TransferHistory(userId)
    return await transfersStore.getAllTransfers()
})

ipcMain.handle("delete-transfers", async (event, userId: string | number, uuid: string) => {
    const transfersStore = new TransferHistory(userId)
    return await transfersStore.delete(uuid)
})

ipcMain.on("show-in-explorer", (event, path) => {
    shell.showItemInFolder(path)
})

ipcMain.on("run-child-app", (event, path: string, args?: string[]) => {
    execFile(path, args)
})