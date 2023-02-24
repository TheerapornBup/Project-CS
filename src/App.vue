<template>
  <v-app>
    <AppBar />
    <v-main class="bg-cream">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from "./components/AppBar.vue";
export default {
  name: "App",
  components: {
    AppBar,
  },
};
</script>

<style>
.h1-en {
  font-family: "Playfair Display";
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 53px;
}
.h2-en {
  font-family: "Playfair Display";
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 43px;
}
.h3-en {
  font-family: "Playfair Display";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 27px;
}
.h4-th {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
}
.h5-th {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 19px;
}
.pointer {
  cursor: pointer;
}
</style>
