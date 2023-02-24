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
                <v-col cols="12">
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
                  <v-img :src="notice.pic" height="170" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <!-- edit notice button -->
          <v-col cols="12" v-if="notice.userId === getUserId">
            <v-btn
              prepend-icon="mdi-file-edit-outline"
              variant="text"
              class="h4-th"
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
                class="h4-th"
                width="auto"
              >
                <v-card
                  ><v-card-title> ลบใบประกาศ </v-card-title>
                  <v-card-text>คุณต้องการลบใบประกาศนี้หรือไม่</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="bg-mattBlue" @click="confirmDeleteNotice()">
                      ใช่
                    </v-btn>
                    <v-btn variant="outlined" @click="deleteDialog = false">
                      ไม่
                    </v-btn>
                  </v-card-actions></v-card
                ></v-dialog
              >
            </v-btn>
          </v-col>
        </v-card></v-container
      >
      <!-- notice chat dialog -->
      <NoticeChat v-else :notice="notice" />
    </v-dialog>
  </v-card>
</template>

<script>
import {
  convertTimestampToTime,
  convertTimestampToDate,
} from "../services/DateTime";
import NoticeChat from "./NoticeChat.vue";
import NoticeDetails from "./NoticeDetails.vue";
import { deleteNoticeFirebase } from "../services/firebases/notices";
import {
  getChatByNoticeIdFirebase,
  deleteChatByNoticeIdFirebase,
} from "@/services/firebases/chats";
import { deleteMessageByChatIdFirebase } from "../services/firebases/messages";
export default {
  name: "NoticeCard",
  data() {
    return {
      noticeDialog: false,
      deleteDialog: false,
      chatDialog: false,
    };
  },
  components: {
    NoticeChat,
    NoticeDetails,
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
    async confirmDeleteNotice() {
      let chatsList = await getChatByNoticeIdFirebase(this.notice.noticeId);
      for (let index in chatsList) {
        await deleteMessageByChatIdFirebase(chatsList[index].chatId);
      }
      await deleteChatByNoticeIdFirebase(this.notice.noticeId);
      await deleteNoticeFirebase(this.notice.noticeId);
      this.$emit("updateNotice");
      alert("ลบใบประกาศสำเร็จ");
      this.deleteDialog = false;
      this.noticeDialog = false;
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
