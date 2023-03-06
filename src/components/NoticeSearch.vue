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

    <v-row v-else>
      <!-- search -->
      <v-col cols="12">
        <v-card class="rounded-pill border-card"
          ><v-row class="pt-6" justify="center" align="center">
            <!-- select notice type -->
            <v-col>
              <v-select
                v-model="selectedNoticeType"
                :items="noticeTypes"
                density="compact"
                variant="solo"
                label="ประเภทประกาศ"
              ></v-select>
            </v-col>
            <!-- select item type -->
            <v-col>
              <v-autocomplete
                v-model="selectedItemType"
                :items="itemTypes"
                density="compact"
                variant="solo"
                label="ประเภทสิ่งของ"
              ></v-autocomplete>
            </v-col>
            <!-- search button -->
            <v-col>
              <v-btn class="bg-blueGreen mb-5 h5-th">ค้นหา</v-btn>
            </v-col></v-row
          ></v-card
        >
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
import { getNoticesFirebase } from "../services/firebases/notices";
import { getNameByIdFirebase } from "../services/firebases/users";
export default {
  name: "NoticeSearch",
  components: {
    NoticeCard,
  },
  data() {
    return {
      selectedNoticeType: null,
      selectedItemType: null,
      noticeTypes: ["ประกาศตามหาของหาย", "ประกาศพบเจอของหาย"],
      itemTypes: ["", ""],
      notices: [],
      isLoading: false,
    };
  },
  methods: {
    async getNotices() {
      const noticesList = [];
      this.isLoading = true;
      const notices = await getNoticesFirebase();
      for (let index in notices) {
        const name = await getNameByIdFirebase(notices[index].userId);
        noticesList.push({ ...notices[index], name: name });
      }
      this.isLoading = false;
      this.notices = noticesList;
    },
  },
  created() {
    this.getNotices();
  },
};
</script>

<style scopde>
.border-card {
  border: 2px solid #358787;
  box-shadow: 0px 8px 16px 8px rgba(0, 0, 0, 0.25);
}
.v-input__details {
  border-radius: 40px;
}
</style>
