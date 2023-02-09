<template>
  <v-app-bar density="compact" class="bg-mattBlue text-whiteCream">
    <v-app-bar-title color="whiteCream" class="app-bar-title"
      >Physical Center-less Lost and Found System</v-app-bar-title
    >
    <v-btn class="log-in-button" variant="text" color="whiteCream" to="/"
      >เข้าสู่ระบบ</v-btn
    >
    <!-- <v-btn
      class="log-in-button"
      variant="text"
      color="whiteCream"
      to="/edit-account/alsidfjw"
      >แก้ไขบัญชี</v-btn
    > -->
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",
};
</script>

<style scoped>
.app-bar-title {
  font-family: "Playfair Display";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 27px;
}
.log-in-button {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
}
</style>
