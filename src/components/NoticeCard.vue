<template>
  <v-card
    class="rounded-xl pointer"
    :class="
      notice.type === 'ประกาศตามหาของหาย' ? 'bg-lightBrown' : 'bg-blueGreen'
    "
  >
    <!-- notice card -->
    <NoticeDetails
      :notice="notice"
      :showStatus="showStatus"
      :showDetail="false"
    />
    <!-- notice card dialog -->
    <v-dialog v-model="noticeDialog" activator="parent">
      <v-container v-if="!chatDialog"
        ><v-card
          class="rounded-xl card overflow-hidden"
          :class="
            notice.type === 'ประกาศตามหาของหาย'
              ? 'bg-lightBrown'
              : 'bg-blueGreen'
          "
        >
          <v-row class="py-3 justify-center" dense>
            <!-- notice type card-->
            <v-col cols="3" offset="4"
              ><v-card
                class="text-center rounded-pill py-1 h4-th"
                :class="
                  notice.type === 'ประกาศตามหาของหาย'
                    ? 'bg-mattBlue'
                    : 'bg-lightGreen'
                "
                >{{
                  notice.type === "ประกาศตามหาของหาย"
                    ? "ตามหาของหาย"
                    : "พบเจอของหาย"
                }}
              </v-card></v-col
            >
            <!-- close dialog button -->
            <v-col cols="1" offset="3">
              <v-btn
                icon="mdi-close"
                variant="text"
                class="d-flex float-end"
                @click="noticeDialog = false"
              ></v-btn>
            </v-col>
            <!-- notice name -->
            <v-col cols="12" class="px-15">
              <p>ชื่อผู้ประกาศ : {{ notice.name }}</p>
            </v-col>

            <v-col cols="6" class="pl-15">
              <v-row>
                <!-- notice picture -->
                <v-col cols="12">
                  <v-img :src="notice.pic" maxHeight="250" />
                </v-col>
                <!-- chat button -->
                <v-col v-if="notice.userId !== getUserId" cols="12">
                  <v-btn
                    rounded="pill"
                    block
                    class="bg-whiteCream text-black h4-th"
                    @click="chatDialog = true"
                    append-icon="mdi-forum-outline"
                  >
                    แชทสอบถาม
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6" class="pr-15">
              <v-row>
                <!-- notice item type -->
                <v-col cols="12">
                  <p>ประเภทของหาย : {{ notice.itemType }}</p> </v-col
                ><!-- notice detail -->
                <v-col cols="12" v-if="notice.detail !== ''">
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
                  <ShowLocation
                    :locationLat="notice.lat"
                    :locationLong="notice.long"
                    :heightMap="170"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <!-- reward notice -->
          <v-col cols="12" offset="6">
            <div class="h5-th">
              {{ notice.reward ? "" : "ไม่" }}ต้องการ{{
                notice.type === "ประกาศตามหาของหาย" ? "ให้" : "รับ"
              }}ค่าตอบแทน
            </div>
          </v-col>
          <!-- edit notice button -->
          <v-col cols=" 12">
            <v-row>
              <v-col
                cols="6"
                style="padding: 3px"
                v-if="notice.userId === getUserId"
              >
                <v-btn
                  prepend-icon="mdi-file-edit-outline "
                  variant="text"
                  class="h4-th"
                  @click="$router.push(`/edit-notice/${notice.noticeId}`)"
                  >แก้ไข</v-btn
                >
                <!-- Delete notice button -->
                <v-btn
                  prepend-icon="mdi-file-remove-outline"
                  class="h4-th"
                  color="error"
                  >ลบ
                  <!-- confirm delete notice dialog -->
                  <v-dialog
                    v-model="deleteDialog"
                    persistent
                    activator="parent"
                    width="auto"
                  >
                    <v-card class="h3-th pa-5">
                      <v-row no-gutters="true">
                        <v-col cols="12">
                          <v-btn
                            icon="mdi-close"
                            class="float-end d-inline"
                            flat
                            @click="deleteDialog = false"
                          ></v-btn>
                        </v-col>
                      </v-row>
                      <v-card-text
                        >คุณแน่ใจหรือไม่ว่าต้องการลบ “ใบประกาศ”
                        นี้?</v-card-text
                      >

                      <v-card-actions class="mt-5">
                        <v-row>
                          <v-col>
                            <v-btn
                              class="bg-error"
                              rounded="pill"
                              block
                              @click="confirmDeleteNotice()"
                            >
                              ลบ
                            </v-btn>
                          </v-col>
                          <v-col>
                            <v-btn
                              variant="outlined"
                              rounded="pill"
                              block
                              @click="deleteDialog = false"
                            >
                              ยกเลิก
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card-actions></v-card
                    ></v-dialog
                  >
                </v-btn></v-col
              >
              <v-col cols="6" v-if="showStatus" class="d-flex align-center">
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
          </v-col>
        </v-card></v-container
      >
      <!-- notice chat dialog -->
      <NoticeChat v-else :notice="notice" />
    </v-dialog>
  </v-card>
  <CustomDialog
    :value="dialog.value"
    :type="dialog.type"
    :content="dialog.content"
    @onChangeDialog="setShowDialog"
  />
</template>

<script>
import ShowLocation from "./ShowLocation.vue";
import {
  convertTimestampToTime,
  convertTimestampToDate,
  diffDate,
} from "../services/DateTime";
import NoticeChat from "./NoticeChat.vue";
import NoticeDetails from "./NoticeDetails.vue";
import CustomDialog from "./CustomDialog.vue";
import { deleteNoticeById } from "@/services/deleteItem";
export default {
  name: "NoticeCard",
  data() {
    return {
      noticeDialog: false,
      deleteDialog: false,
      chatDialog: false,
      dialog: {
        value: false,
        type: "warning",
        content: "",
      },
    };
  },
  components: {
    NoticeChat,
    NoticeDetails,
    CustomDialog,
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
    async confirmDeleteNotice() {
      await deleteNoticeById(this.notice.noticeId);
      this.deleteDialog = false;
      this.dialog = {
        value: true,
        type: "success",
        content: "ลบใบประกาศสำเร็จ",
      };
    },
    setShowDialog(isShow) {
      this.dialog.value = isShow;
      if (!isShow) {
        if (this.dialog.content === "ลบใบประกาศสำเร็จ") {
          this.noticeDialog = false;
          this.$emit("updateNotice");
        }
      }
    },
  },
  computed: {
    getUserId() {
      return this.$store.getters["userId/getUserId"];
    },
  },
  watch: {
    noticeDialog() {
      if (this.noticeDialog === false) {
        setTimeout(() => {
          this.chatDialog = false;
        }, 1000);
      }
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
