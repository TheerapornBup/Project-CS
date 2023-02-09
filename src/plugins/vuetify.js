// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

const myCustomTheme = {
  dark: false,
  colors: {
    background: "#A6D2CD",
    primary: "#4B7085",
    secondary: "#358787",
    anchor: "#358787",
    error: "#da0000",
    info: "#A6D2CD",
    success: "#14A44D",
    warning: "#EAE7E6",
    mattBlue: "#4B7085",
    blueGreen: "#358787",
    lightGreen: "#A6D2CD",
    lightBrown: "#D8AC84",
    whiteCream: "#EAE7E6",
    cream: "#FEF8EB",
    darkGrey: "#292929",
    lightWhite: "#F1F1F1",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "myCustomTheme",
    themes: {
      myCustomTheme,
    },
  },
});
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
