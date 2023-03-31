<template>
  <v-container fluid class="d-flex h-100">
    <!-- loading -->
    <v-progress-circular
      v-if="isLoading"
      class="ma-auto"
      size="50"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <!-- show no notices -->
    <ShowNoData
      v-else-if="notices.length === 0"
      icon="mdi-file-search-outline"
      text="ไม่มีใบประกาศ"
    />

    <!-- show notices -->
    <v-row v-else>
      <!-- search -->
      <v-col cols="12" class="overlap">
        <v-card
          class="rounded-pill border-card bg-mattBlue px-5"
          style="overflow: visible"
          ><v-row class="pt-6" justify="center" align="center">
            <!-- select notice type -->
            <v-col cols="1"></v-col>
            <v-col cols="2">
              <v-select
                v-model="selectedNoticeType"
                :items="noticeTypes"
                density="compact"
                variant="solo"
                label="ประเภทประกาศ"
              ></v-select>
            </v-col>
            <!-- select item type -->
            <v-col cols="2">
              <v-select
                v-model="selectedItemType"
                :items="itemTypes"
                density="compact"
                variant="solo"
                label="ประเภทสิ่งของ"
              ></v-select>
            </v-col>
            <!-- select location -->
            <v-col cols="3">
              <v-text-field
                placeholder="ระบุสถานที่ใกล้เคียง"
                density="compact"
                append-inner-icon="mdi-map-marker-radius"
                @click:append-inner="locationHandle()"
                variant="solo"
                v-model="selectedLocation"
              ></v-text-field>

              <v-card
                v-show="mapCard"
                rounded="lg"
                class="bg-grey card-map"
                style="
                  position: absolute;
                  z-index: 2;
                  width: 25%;
                  height: 220px;
                "
              >
                <!-- google map -->
                <GMapMap
                  :center="{
                    lat: locationLat,
                    lng: locationLong,
                  }"
                  :zoom="15"
                  style="width: 100%; height: 220px"
                  @click="changeLocation($event)"
                >
                  <GMapMarker
                    :position="{
                      lat: locationLat,
                      lng: locationLong,
                    }"
                  />
                </GMapMap>
              </v-card>
            </v-col>

            <!-- select date time -->
            <v-col cols="2" class="py-0 date-input">
              <VueDatePicker
              placeholder="ระบุวันเวลาที่ใกล้เคียง"
                v-model="selectedDateTime"
                :max-date="new Date()"
                :clearable="false"
              ></VueDatePicker>
            </v-col>
            <!-- search button -->
            <v-col cols="2">
              <v-btn class="bg-blueGreen mb-5 h5-th" @click="search()"
                >ค้นหา</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- notice card -->

      <v-col
        v-for="(notice, index) in notices"
        :key="index"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <NoticeCard
          :key="index"
          :notice="notice"
          :showStatus="false"
          @updateNotice="getNotices"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NoticeCard from "./NoticeCard.vue";
import ShowNoData from "./ShowNoData.vue";
import { getNoticesFirebase } from "../services/firebases/notices";
import { getNameByIdFirebase } from "../services/firebases/users";
import { diffDate, diffMilliseconds } from "@/services/DateTime";
import {
  createNotificationFirebase,
  isExistNotificationFirebase,
} from "@/services/firebases/notifications";

import axios from "axios";
import { deleteNoticeById } from "@/services/deleteItem";
export default {
  name: "NoticeSearch",
  components: {
    NoticeCard,
    ShowNoData,
  },
  data() {
    return {
      selectedNoticeType: null,
      selectedItemType: null,
      selectedLocation: null,
      selectedDateTime: null,
      locationLat: 0,
      locationLong: 0,
      mapCard: false,
      noticeTypes: ["ประกาศตามหาของหาย", "ประกาศพบเจอของหาย"],
      itemTypes: [
        "บัตรสำคัญประจำตัว",
        "เงิน",
        "กระเป๋า",
        "อุปกรณ์อิเล็กทรอนิกส์",
        "เครื่องประดับ",
        "เครื่องสำอาง",
        "เอกสาร",
        "เสื้อผ้า",
        "แว่นตา",
        "กุญแจ",
        "อุปกรณ์กีฬา",
        "อุปกรณ์ถ่ายภาพ",
        "เครื่องเขียน",
        "หนังสือ",
        "อุปกรณ์ทางการแพทย์",
        "รองเท้า",
      ],
      notices: [],
      isLoading: false,
    };
  },
  methods: {
    async getNotices() {
      let noticesList = [];
      this.isLoading = true;
      const notices = await getNoticesFirebase();

      for (let index in notices) {
        const name = await getNameByIdFirebase(notices[index].userId);
        noticesList.push({ ...notices[index], name: name });
      }

      this.checkNoticeExpire(noticesList);

      //show notice that status = false
      noticesList = noticesList.filter((notice) => !notice.status);

      this.isLoading = false;
      this.notices = noticesList;
    },
    async checkNoticeExpire(noticesList) {
      noticesList.forEach(async (notice) => {
        const days = diffDate(notice.createDateTime.seconds);
        const remainingDays = 90 - days;

        if (remainingDays <= 0) {
          // expire notice -> delete notice chat message
          await deleteNoticeById(this.notice.noticeId);
        } else if (remainingDays <= 10) {
          // closed expire notice -> send notification
          const isSend = await isExistNotificationFirebase(
            "expire soon",
            notice.noticeId
          );
          if (!isSend) {
            const notification = {
              sender: notice.userId,
              receiver: notice.userId,
              itemId: notice.noticeId,
              type: "expire soon",
              text: "ใบประกาศใกล้หมดอายุ",
              dateTime: new Date(),
            };
            await createNotificationFirebase(notification);
          }
        }
      });
    },
    compareByNoticeType(a, b) {
      const typeA = this.selectedNoticeType === a.type;
      const typeB = this.selectedNoticeType === b.type;
      return typeB - typeA;
    },
    compareByItemType(a, b) {
      const typeA = this.selectedItemType === a.itemType;
      const typeB = this.selectedItemType === b.itemType;
      return typeB - typeA;
    },
    compareByLocation(a, b) {
      const distanceA = this.getDistanceBetweenPoints(
        this.locationLat,
        this.locationLong,
        a.lat,
        a.long
      );
      const distanceB = this.getDistanceBetweenPoints(
        this.locationLat,
        this.locationLong,
        b.lat,
        b.long
      );
      return distanceA - distanceB;
    },
    compareByDateTime(a, b) {
      const durationA = diffMilliseconds(
        this.selectedDateTime,
        a.dateTime.seconds
      );
      const durationB = diffMilliseconds(
        this.selectedDateTime,
        b.dateTime.seconds
      );

      return durationA - durationB;
    },
    getDistanceBetweenPoints(latitude1, longitude1, latitude2, longitude2) {
      let theta = longitude1 - longitude2;
      let distance =
        60 *
        1.1515 *
        (180 / Math.PI) *
        Math.acos(
          Math.sin(latitude1 * (Math.PI / 180)) *
            Math.sin(latitude2 * (Math.PI / 180)) +
            Math.cos(latitude1 * (Math.PI / 180)) *
              Math.cos(latitude2 * (Math.PI / 180)) *
              Math.cos(theta * (Math.PI / 180))
        );

      return Math.round(distance * 1.609344, 2);
    },
    search() {
      let noticesList = this.notices;
      if (this.selectedDateTime !== null) {
        noticesList.sort(this.compareByDateTime);
      }
      if (this.selectedLocation !== null) {
        noticesList.sort(this.compareByLocation);
      }
      if (this.selectedNoticeType !== null) {
        noticesList.sort(this.compareByNoticeType);
      }
      if (this.selectedItemType !== null) {
        noticesList.sort(this.compareByItemType);
      }

      this.notices = noticesList;
    },
    locationHandle() {
      this.mapCard = !this.mapCard;
      if (this.mapCard && this.selectedLocation === null) {
        this.getCurrentLocation();
      }
    },
    setLocationPosition(lat, lng) {
      (this.locationLat = lat), (this.locationLong = lng);
    },
    setLocationAddress(address) {
      this.selectedLocation = address;
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
          },
          (error) => {
            console.log(error.message);
          }
        );
      } else {
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
            console.log(response.data.error_message);
          } else {
            this.setLocationAddress(response.data.results[0].formatted_address);
            console.log(response.data.results[0].formatted_address);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    },

    //click map to change location
    changeLocation(e) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      this.setLocationPosition(lat, lng);
      this.getAddressFrom(lat, lng);
    },
  },
  created() {
    this.getNotices();
  },
};
</script>

<style>
.border-card {
  border: 2px solid #358787;
  box-shadow: 0px 8px 16px 8px rgba(0, 0, 0, 0.25);
}
.v-input__details {
  border-radius: 40px;
}
.overlap {
  z-index: 100;
  position: relative;
}
.date-input {
  position: relative;
  top: -10px;
  border-radius: 40px;
}

.dp__input_icon_pad {
  padding-left: 16px;
}
/*.dp__input_icon {
  left: 172px;
}
.dp__clear_icon {
  right: 25px;
}
.dp__input_icon_pad {
  padding-left: 17px;
}*/
</style>
