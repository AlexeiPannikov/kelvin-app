import {app, BrowserWindow, shell} from "electron";
import {join} from "path";
import {ROOT_PATH} from "./index";
import {BrowserWindowConstructorOptions} from "electron"

const preload = join(__dirname, '../preload/index.js')

const defaultSettings: BrowserWindowConstructorOptions = {
    width: 1200,
    height: 800,
    webPreferences: {
        preload,
        // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
        // Consider using contextBridge.exposeInMainWorld
        // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
        nodeIntegration: true,
        contextIsolation: false,
    },
}

export class Window extends BrowserWindow {

    constructor(file: string, url: string, windowSettings?: BrowserWindowConstructorOptions) {
        super({...defaultSettings, ...windowSettings});
        this.init(file, url)
    }

    async init(file: string, url: string) {
        if (app.isPackaged) {
            await this.loadFile(file)
        } else {
            await this.loadURL(url)
            this.webContents.openDevTools()
        }

        this.webContents.on('did-finish-load', () => {
            this?.webContents.send('main-process-message', new Date().toLocaleString())
        })

        this.webContents.setWindowOpenHandler(({url}) => {
            if (url.startsWith('https:')) shell.openExternal(url)
            return {action: 'deny'}
        })
    }
}