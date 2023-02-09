<template>
  <v-container
    ><v-card class="bg-blueGreen card">
      <v-row class="card-row">
        <v-col cols="6" class="card-col">
          <slot name="content-left"></slot>
        </v-col>
        <v-col cols="6" class="card-col bg-whiteCream">
          <slot name="content-right"></slot>
        </v-col>
      </v-row> </v-card
  ></v-container>
</template>

<script>
export default {
  name: "CardContent",
};
</script>

<style scopes>
.card {
  width: 75%;
  height: 640px;
  margin: auto;
  box-shadow: 0px 8px 16px 8px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
}

.card-row {
  height: 100%;
  margin: 0;
}

.card-col {
  display: flex;
  flex-direction: column;

  height: 100%;
  padding: 0;
}
</style>
