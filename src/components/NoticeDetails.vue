<template>
  <v-row class="pa-3 overflow-y-auto" dense>
    <!-- notice type card-->
    <v-col cols="6" offset="3"
      ><v-card
        class="text-center rounded-pill py-1 h4-th"
        :class="
          notice.type === 'ประกาศตามหาของหาย' ? 'bg-mattBlue' : 'bg-lightGreen'
        "
        >{{
          notice.type === "ประกาศตามหาของหาย" ? "ตามหาของหาย" : "พบเจอของหาย"
        }}
      </v-card></v-col
    >
    <!-- notice name -->
    <v-col cols="12">
      <p>ชื่อผู้ประกาศ : {{ notice.name }}</p>
    </v-col>
    <!-- notice picture -->
    <v-col cols="12">
      <v-img :src="notice.pic" height="150" />
    </v-col>
    <!-- notice item type -->
    <v-col cols="12">
      <p>ประเภทของหาย : {{ notice.itemType }}</p>
    </v-col>
    <!-- notice detail -->
    <v-col v-if="showDetail && notice.detail !== ''" cols="12">
      <p>
        {{
          notice.type === "ประกาศตามหาของหาย"
            ? "รายละเอียดของหายที่ตามหา"
            : "รายละเอียดของหายที่พบ"
        }}
        :
      </p>
      <p>{{ notice.detail }}</p>
    </v-col>
    <!-- notice date -->
    <v-col cols="12">
      <p>
        {{
          notice.type === "ประกาศตามหาของหาย"
            ? "วันที่ของหาย"
            : "วันที่พบของหาย"
        }}
        : {{ getDate(notice.dateTime.seconds) }}
      </p>
    </v-col>
    <!-- notice time -->
    <v-col cols="12">
      <p>
        {{
          notice.type === "ประกาศตามหาของหาย"
            ? "เวลาที่คาดว่าของหาย"
            : "เวลาที่พบของหาย"
        }}
        : {{ getTime(notice.dateTime.seconds) }} น.
      </p>
    </v-col>
    <!-- notice location -->
    <v-col cols="12">
      <p>
        {{
          notice.type === "ประกาศตามหาของหาย"
            ? "สถานที่ทำของหาย"
            : "สถานที่ที่พบของหาย"
        }}
        :
      </p>
    </v-col>
    <v-col cols="12">
      <ShowLocation :locationLat="notice.lat" :locationLong="notice.long" />
    </v-col>
    <!-- reward notice -->
    <v-col cols="12">
      <div class="h5-th">
        {{ notice.reward ? "" : "ไม่" }}ต้องการ{{
          notice.type === "ประกาศตามหาของหาย" ? "ให้" : "รับ"
        }}ค่าตอบแทน
      </div>
    </v-col>

    <v-col v-if="showStatus" cols="12" class="d-flex align-center">
      <!-- remaining day notice -->
      <div class="h5-th flex-grow-1">
        อายุของใบประกาศ : {{ getRemainingDays() }} วัน
      </div>
      <!-- notice status -->
      <v-card
        class="text-center rounded-pill pa-1 float-end d-inline h5-th"
        :class="notice.status ? 'bg-success' : 'bg-warning'"
        >{{ notice.status ? "ปิดเคสแล้ว" : "ยังไม่ปิดเคส" }}
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ShowLocation from "./ShowLocation.vue";
import {
  convertTimestampToTime,
  convertTimestampToDate,
  diffDate,
} from "../services/DateTime";
export default {
  name: "NoticeDetails",
  components: {
    ShowLocation,
  },
  props: {
    notice: {
      type: Object,
      require,
    },
    showStatus: {
      type: Boolean,
      default: true,
    },
    showDetail: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    getDate(timestamp) {
      const date = convertTimestampToDate(timestamp);
      return date;
    },
    getTime(timestamp) {
      const time = convertTimestampToTime(timestamp);
      return time;
    },
    getRemainingDays() {
      const days = diffDate(this.notice.createDateTime.seconds);
      const remainingDays = 90 - days;
      return remainingDays;
    },
  },
};
</script>

<style scoped>
p {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
}
</style>
