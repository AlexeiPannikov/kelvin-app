import {defineStore} from "pinia";

interface IState {
    size: number
}

export const useFilesViewStore = defineStore("files-view", {
    state: () => {
        return <IState>{
            size: Number(window.localStorage.getItem("image_size")) || 200
        };
    },

    actions: {
        saveInLocalStorage() {
            window.localStorage.setItem("image_size", this.size.toString())
        },
    },
})
