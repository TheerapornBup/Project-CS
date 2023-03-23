<template>
  <div
    class="d-flex flex-column justify-center align-center my-4 mx-auto h4-th"
  >
    <v-icon size="x-large" color="mattBlue" class="mb-5">
      {{ icon }}
    </v-icon>
    <v-label> {{ text }} </v-label>
  </div>
</template>

<script>
export default {
  name: "ShowNoData",
  props: {
    icon: {
      type: String,
      require,
    },
    text: {
      type: String,
      require,
    },
  },
};
</script>

<style></style>
