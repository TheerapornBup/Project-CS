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
.h3-th {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 38px;
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

.add-notice-box {
  background: #eae7e6;
  border-radius: 100px;
  width: 850px;
  height: 400px;
}

.add-notice-card {
  width: 912px;
  height: auto;
  background: #358787;
  margin: auto;
  box-shadow: 0px 8px 16px 8px rgba(0, 0, 0, 0.25);
}

.topic {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  color: #000000;
}

.save-btn {
  width: 210px;
  height: 40px;
  background: #a6d2cd;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 40px;
}

.discard-btn {
  width: 210px;
  height: 40px;
  box-sizing: border-box;
  border: 2px solid #292929;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 40px;
  background-color: #358787;
}

.dp__input {
  border-radius: 40px !important;
  height: 45px !important;
  font-family: "Noto Serif Thai" !important;
}

.dp__input_icon {
  left: 180px;
  top: 52%;
}

.dp__clear_icon {
  top: 52%;
  right: 60px;
}

.mx-icon-calendar,
.mx-icon-clear {
  font-size: 20px;
  margin: 1px -51px;
}

.mx-input {
  border-radius: 40px;
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
  height: 55px;
  width: 270px;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 40px;
  padding-bottom: 16px;
}

.mx-datepicker-popup {
  position: absolute;
  left: 850.263px;
  top: 300px;
}

.card-map {
  margin-top: 40px !important;
  height: 220px;
  width: 25% !important;
}

input[type="file"] {
  width: 30%;
  color: #444;
  background: #f1f1f1;
  border-radius: 8px;
}
input[type="file"]::file-selector-button {
  margin-right: 20px;
  border: none;
  background: #a6d2cd;
  padding: 5px 10px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  color: black;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

input[type="file"]::file-selector-button:hover {
  background: #95c3bd;
}
</style>
