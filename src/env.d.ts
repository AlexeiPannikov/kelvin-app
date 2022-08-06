/// <reference types="vite/client" />

declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module 'webfontloader';
declare module '*.png';

declare global {
    interface Window {
        electron: {
            getAppPath: () => Promise<string>
        }
    }
}