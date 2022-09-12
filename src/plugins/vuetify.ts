// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import * as components from "vuetify";
import * as directives from "vuetify";

// Vuetify
import {createVuetify, ThemeDefinition} from "vuetify";

const myCustomDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        primary: "#499FFF",
        "main-navigation-back": "#2B2B2B",
        "main-content-back": "#343434",
    },
    variables: {
        "border-color": "#000000",
        "border-opacity": "0.2"
    }
};

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: "myCustomDarkTheme",
        themes: {
            myCustomDarkTheme
        },
    },
});
