import {computed} from "vue";

export const useFirstNameLetters = (name: string) => {
    return computed(() => {
        return name
            .split(" ")
            .map((item) => item[0])
            .join("");
    });
}