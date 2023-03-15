<template>
  <v-card
    rounded="lg"
    class="bg-grey"
    id="map"
    :style="heightMap > 120 ? 'height: 170px' : 'height: 120px'"
  >
    <GMapMap
      :center="{ lat: this.locationLat, lng: this.locationLong }"
      :zoom="15"
      style="width: 100%"
      :style="heightMap > 120 ? 'height: 170px' : 'height: 120px'"
    >
      <GMapMarker
        :position="{ lat: this.locationLat, lng: this.locationLong }"
      />
    </GMapMap>
  </v-card>
</template>

<script>
export default {
  name: "ShowLocation",
  props: {
    locationLat: {
      type: Number,
      default: 13.05045,
    },
    locationLong: {
      type: Number,
      default: 100.56546,
    },
    heightMap: {
      type: Number,
      default: 120,
    },
  },
};
</script>

<style></style>
