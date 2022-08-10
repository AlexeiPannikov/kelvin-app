import {shell} from "electron"

export const openInBrowser = (url: string) => shell.openExternal(url)