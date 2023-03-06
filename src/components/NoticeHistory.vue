<template>
  <TabBar :tabs="tabs" :selected="selectedType" @onChangeTab="filterNoticeType">
    <template v-slot:content-tab>
      <v-container fluid class="d-flex">
        <!-- loading -->
        <v-progress-circular
          v-if="isLoading"
          class="ma-auto"
          size="50"
          indeterminate
          color="primary"
        ></v-progress-circular>

        <v-row v-else>
          <!-- select status -->
          <v-col cols="12">
            <v-select
              class="d-inline-flex float-end"
              v-model="selectedStatus"
              :items="['ทั้งหมด', 'ยังไม่ดำเนินการ', 'เสร็จสิ้นแล้ว']"
              variant="solo"
              density="compact"
            ></v-select>
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
            <NoticeCard :notice="notice" />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </TabBar>
</template>

<script>
import NoticeCard from "./NoticeCard.vue";
import TabBar from "./TabBar.vue";
import { getNoticesByUserIdFirebase } from "../services/firebases/notices";
import { getNameByIdFirebase } from "../services/firebases/users";
export default {
  name: "NoticeHistory",
  components: {
    NoticeCard,
    TabBar,
  },
  data() {
    return {
      tabs: ["ทั้งหมด", "ตามหาของหาย", "พบเจอของหาย"],
      selectedStatus: "ทั้งหมด",
      selectedType: "ทั้งหมด",
      notices: [],
      allNotices: [],
      isLoading: false,
    };
  },
  methods: {
    filterNoticeType(tab) {
      this.selectedType = tab;
      this.filterNoticeTypeAndStatus();
    },
    filterNoticeTypeAndStatus() {
      if (
        this.selectedType === "ทั้งหมด" &&
        this.selectedStatus === "ทั้งหมด"
      ) {
        this.notices = this.allNotices;
      } else {
        const status = this.selectedStatus === "เสร็จสิ้นแล้ว";

        const notices = this.allNotices.filter((notice) => {
          if (this.selectedType === "ทั้งหมด") {
            return notice.status === status;
          } else if (this.selectedStatus === "ทั้งหมด") {
            return notice.type === `ประกาศ${this.selectedType}`;
          } else {
            return (
              notice.status === status &&
              notice.type === `ประกาศ${this.selectedType}`
            );
          }
        });

        this.notices = notices;
      }
    },

    async getNotices() {
      this.isLoading = true;
      let noticesList = [];
      const notices = await getNoticesByUserIdFirebase(this.getUserId);
      for (let index in notices) {
        const name = await getNameByIdFirebase(notices[index].userId);
        noticesList.push({ ...notices[index], name: name });
      }
      this.allNotices = noticesList;
      this.notices = this.allNotices;
      this.isLoading = false;
    },
  },
  computed: {
    getUserId() {
      return this.$store.getters["userId/getUserId"];
    },
  },
  watch: {
    selectedStatus() {
      this.filterNoticeTypeAndStatus();
    },
  },
  created() {
    this.getNotices();
  },
};
</script>

<style></style>
