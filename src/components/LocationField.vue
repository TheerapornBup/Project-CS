<template>
  <div class="w-50 h-50 ma-auto pt-10">
    <v-text-field
      append-inner-icon="mdi-calendar-month"
      @click:append-inner="mapCard = !mapCard"
      variant="solo"
      v-model="locationAddress"
    ></v-text-field>
    <div v-show="mapCard">
      <v-text-field
        class="ma-5"
        style="position: relative; z-index: 1"
        placeholder="ค้นหา"
        variant="solo"
        id="autocomplete"
      ></v-text-field>
      <v-card
        rounded="x-large"
        class="bg-grey w-50 h-50 mt-0"
        id="map"
        style="position: absolute"
      ></v-card>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import axios from "axios";
export default {
  name: "LocationField",
  data() {
    return {
      mapCard: false,
      locationLat: 0,
      locationLong: 0,
      locationAddress: "",
      error: "",
    };
  },
  created() {
    this.getCurrentLocation();
  },
  mounted() {
    let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete")
    );
    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      console.log(place);
      this.setLocationPosition(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
      this.setLocationAddress(place.formatted_address);
      this.showUserLocationOnTheMap(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    });
  },
  methods: {
    setLocationPosition(lat, lng) {
      (this.locationLat = lat), (this.locationLong = lng);
    },
    setLocationAddress(address) {
      this.locationAddress = address;
    },
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.getAddressFrom(
              position.coords.latitude,
              position.coords.longitude
            );
            this.setLocationPosition(
              position.coords.latitude,
              position.coords.longitude
            );

            this.showUserLocationOnTheMap(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          (error) => {
            this.error = error.message;

            //console.log(error.message);
          }
        );
      } else {
        this.error = "your browser does not support geolocation API";
        console.log("your browser does not support geolocation API");
      }
    },
    getAddressFrom(lat, long) {
      axios
        .get(
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
            lat +
            ", " +
            long +
            "&key=AIzaSyDEJiW679Uw3p7X5xgQEamRU3agd2zWUAM"
        )
        .then((response) => {
          if (response.data.error_message) {
            this.error = response.data.error_message;
            //console.log(response.data.error_message);
          } else {
            this.address = response.data.results[0].formatted_address;
            this.setLocationAddress(response.data.results[0].formatted_address);
            console.log(response.data.results[0].formatted_address);
          }
        })
        .catch((error) => {
          this.error = error.message;
          console.log(error.message);
        });
    },
    showUserLocationOnTheMap(latitude, longitude) {
      //create a map object
      let map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });

      //add Marker
      new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map,
      });

      //click to change location
      map.addListener("click", ({ latLng: { lat, lng } }) => {
        this.setLocationPosition(lat(), lng());
        this.getAddressFrom(lat(), lng());
        this.showUserLocationOnTheMap(lat(), lng());
      });
    },
  },
};
</script>

<style></style>
