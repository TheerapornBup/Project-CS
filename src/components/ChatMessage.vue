<template>
  <!-- show messages list-->
  <div
    class="scroll bg-blueGreen pa-2 h4-th"
    :class="isLoading === true ? 'd-flex' : ''"
  >
    <!-- loading -->
    <v-progress-circular
      v-if="isLoading"
      class="ma-auto"
      size="50"
      indeterminate
      color="whieCream"
    ></v-progress-circular>
    <div v-else>
      <div
        class="ma-0 w-100 d-flex flex-column"
        v-for="(message, index) in messages"
        :key="index"
      >
        <!-- show message date -->
        <div
          class="text-center mb-2 mt-1"
          v-if="
            index === 0 ||
            getDate(message.dateTime.seconds) !==
              getDate(messages[index - 1].dateTime.seconds)
          "
        >
          <v-card class="d-inline pa-1 rounded-pill">{{
            getDateCard(message.dateTime.seconds)
          }}</v-card>
        </div>

        <div
          class="d-flex mb-2"
          :class="
            message.sender === !(getUserId === notice.userId)
              ? 'flex-row-reverse'
              : 'flex-row'
          "
        >
          <!-- show avatar  -->
          <v-avatar
            v-if="message.sender === (getUserId === notice.userId)"
            class="bg-whiteCream mr-1 h5-th"
            size="30"
            >{{ name.charAt(0).toUpperCase() }}</v-avatar
          >
          <!-- show message text -->
          <v-card
            class="pa-2 mt-1 rounded-xl"
            :class="
              message.sender === !(getUserId === notice.userId)
                ? 'rounded-te-0 bg-lightGreen'
                : 'rounded-ts-0 bg-whiteCream'
            "
            max-width="50%"
            >{{ message.text }}
          </v-card>
          <!-- show message time -->
          <p class="align-self-end mx-1 h5-th">
            {{ getTime(message.dateTime) }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- input message -->
  <v-sheet class="h-20 d-flex bg-lightBrown align-center">
    <!-- text field message -->
    <v-text-field
      class="flex-grow-1 px-2 h4-th"
      variant="plain"
      v-model.trim="text"
    ></v-text-field>
    <!-- send button -->
    <v-btn
      class="bg-mattBlue mr-2"
      icon="mdi-send"
      @click.prevent="sendMessage()"
    ></v-btn>
  </v-sheet>

  <!-- <v-btn
    v-if="getUserId === notice.userId && !notice.status && !isSendNotifyNotice"
    block
    rounded="0"
    class="bg-mattBlue text-center h4-th"
  > -->
  <v-btn
    v-if="
      (!isSendNotifyNotice &&
        notice.type === 'ประกาศพบเจอของหาย' &&
        getUserId === notice.userId) ||
      (!isSendNotifyNotice &&
        notice.type !== 'ประกาศพบเจอของหาย' &&
        getUserId !== notice.userId)
    "
    block
    rounded="0"
    class="bg-mattBlue text-center h4-th"
  >
    ส่งการยืนยันการคืนของ
    <v-dialog
      v-model="confirmDialog"
      persistent
      activator="parent"
      class="h4-th"
      width="auto"
    >
      <v-card class="h4-th pa-5">
        <v-row no-gutters="true">
          <v-col cols="12">
            <v-btn
              icon="mdi-close"
              class="float-end d-inline"
              flat
              @click="confirmDialog = false"
            ></v-btn>
          </v-col>
        </v-row>
        <v-card-title class="text-center"> ยืนยันการส่งคืนของ </v-card-title>
        <v-card-text>คุณต้องการยืนยันการส่งคืนของหรือไม่</v-card-text>

        <v-card-actions class="mt-5">
          <v-row>
            <v-col>
              <v-btn
                class="bg-mattBlue"
                rounded="pill"
                block
                @click="confirmSendItem()"
              >
                ยืนยัน
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                variant="outlined"
                rounded="pill"
                block
                @click="confirmDialog = false"
              >
                ยกเลิก
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
  <v-btn
    v-if="isReceiveNotifyNotice && !notice.status"
    block
    rounded="0"
    class="bg-mattBlue text-center h4-th"
  >
    ส่งการยืนยันรับของ
    <v-dialog
      v-model="confirmDialog"
      persistent
      activator="parent"
      class="h4-th"
      width="auto"
    >
      <v-card class="h4-th pa-5">
        <v-row no-gutters="true">
          <v-col cols="12">
            <v-btn
              icon="mdi-close"
              class="float-end d-inline"
              flat
              @click="confirmDialog = false"
            ></v-btn>
          </v-col>
        </v-row>
        <v-card-title class="text-center"> ยืนยันการรับของ </v-card-title>
        <v-card-text>คุณต้องการยืนยันการรับของหรือไม่</v-card-text>

        <v-card-actions class="mt-5">
          <v-row>
            <v-col>
              <v-btn
                class="bg-mattBlue"
                rounded="pill"
                block
                @click="confirmReceiveItem()"
              >
                ยืนยัน
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                variant="outlined"
                rounded="pill"
                block
                @click="confirmDialog = false"
              >
                ยกเลิก
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>

  <CustomDialog
    :value="dialog.value"
    :type="dialog.type"
    :content="dialog.content"
    @onChangeDialog="setShowDialog"
  />
</template>

<script>
import CustomDialog from "./CustomDialog.vue";
import { updateNoticeFirebase } from "@/services/firebases/notices";
import {
  convertTimestampToTime,
  convertTimestampToDate,
  isToday,
  isYesterday,
} from "../services/DateTime";

import {
  getMessageByChatIdFirebase,
  createMessageFirebase,
} from "../services/firebases/messages";

import {
  createNotificationFirebase,
  isExistNotificationFirebase,
  isMatchNotificationFirebase,
  updateNotificationFirebase,
} from "../services/firebases/notifications";

export default {
  name: "ChatMessage",
  components: {
    CustomDialog,
  },
  props: {
    chatId: {
      type: String,
      require,
    },
    visitorId: {
      type: String,
      require,
    },
    notice: {
      type: Object,
      require,
    },
    name: {
      type: String,
      require,
    },
  },
  data() {
    return {
      messages: [],
      confirmDialog: false,
      isSendNotifyNotice: false,
      isReceiveNotifyNotice: false,
      isLoading: false,
      text: "",
      dialog: {
        value: false,
        type: "success",
        content: "",
      },
    };
  },
  methods: {
    async sendMessage() {
      if (this.text !== "") {
        const message = {
          chatId: this.chatId,
          text: this.text,
          dateTime: new Date(),
          sender: this.notice.userId !== this.getUserId,
        };
        //create message
        await createMessageFirebase(message);

        //create or update message notification
        await this.sendNotificationMessage(
          "ข้อความ",
          this.chatId,
          this.notice.userId === this.getUserId
            ? this.visitorId
            : this.notice.userId
        );

        //get all message by chat id
        await this.getMessages();

        this.text = "";
      }
    },
    getDate(timestamp) {
      const date = convertTimestampToDate(timestamp);
      return date;
    },
    getTime(timestamp) {
      const time = convertTimestampToTime(timestamp);
      return time;
    },
    scrollToEnd() {
      var container = document.querySelector(".scroll");
      container.scrollTop = container.scrollHeight;
    },

    async getMessages() {
      const messages = await getMessageByChatIdFirebase(this.chatId);
      this.messages = messages;
      this.$emit("updateMessage", messages);
    },

    getDateCard(timestamp) {
      const date = new Date(timestamp * 1000);
      if (isToday(date)) {
        return "วันนี้";
      } else if (isYesterday(date)) {
        return "เมื่อวาน";
      } else {
        return this.getDate(timestamp);
      }
    },
    async confirmSendItem() {
      await this.sendNotification(
        "รอการยืนยันการรับส่งของ",
        this.chatId,
        this.notice.userId === this.getUserId
          ? this.visitorId
          : this.notice.userId
      );
      this.confirmDialog = false;
      this.dialog = {
        value: true,
        type: "success",
        content: "ยืนยันการคืนของสำเร็จ",
      };
      // alert("ยืนยันการคืนของสำเร็จ");
      // this.isSendNotifyNotice = true;
    },
    async confirmReceiveItem() {
      await this.sendNotification(
        "ยืนยันการรับส่งของสำเร็จ",
        this.chatId,
        this.notice.userId === this.getUserId
          ? this.visitorId
          : this.notice.userId
      );

      await updateNoticeFirebase(this.notice.noticeId, { status: true });

      this.confirmDialog = false;
      this.dialog = {
        value: true,
        type: "success",
        content: "ยืนยันการรับของสำเร็จ",
      };
      // alert("ยืนยันการรับของสำเร็จ");
      // this.$emit("updateStatus", true);
    },

    async sendNotificationMessage(type, itemId, userId) {
      // check is exist notification type message
      const notificationId = await isMatchNotificationFirebase(
        type,
        itemId,
        userId
      );

      if (notificationId !== null) {
        // yes , update time notification
        const notification = {
          dateTime: new Date(),
        };
        await updateNotificationFirebase(notificationId, notification);
      } else {
        //no , create notification
        await this.sendNotification(type, itemId, userId);
      }
    },

    async sendNotification(type, itemId, userId) {
      //ยืนยันการรับส่งของ ข้อความ ใบประกาศหมดอายุ
      const notification = {
        userId: userId,
        itemId: itemId,
        type: type,
        dateTime: new Date(),
      };
      await createNotificationFirebase(notification);
    },

    async getIsSendNotifyNotice() {
      this.isLoading = true;
      const isSend = await isExistNotificationFirebase(
        "รอการยืนยันการรับส่งของ",
        this.chatId
      );
      this.isSendNotifyNotice = isSend;
      this.isLoading = false;
    },
    async getIsReceiveNotifyNotice() {
      this.isLoading = true;
      const isReceive = await isMatchNotificationFirebase(
        "รอการยืนยันการรับส่งของ",
        this.chatId,
        this.getUserId
      );

      this.isReceiveNotifyNotice = isReceive !== null;
      this.isLoading = false;
    },
    setShowDialog(isShow) {
      this.dialog.value = isShow;
      if (!isShow) {
        if (this.dialog.content === "ยืนยันการคืนของสำเร็จ") {
          this.isSendNotifyNotice = true;
        } else if (this.dialog.content === "ยืนยันการรับของสำเร็จ") {
          this.$emit("updateStatus", true);
        }
      }
    },
  },
  computed: {
    getUserId() {
      return this.$store.getters["userId/getUserId"];
    },
  },

  mounted() {
    this.scrollToEnd();
  },

  watch: {
    messages: {
      handler() {
        const container = document.querySelector(".scroll");
        this.$nextTick(() => {
          container.scrollTop = container.scrollHeight;
        });
      },
      deep: true,
    },
    chatId: function () {
      this.getMessages();
      this.getIsSendNotifyNotice();
      this.getIsReceiveNotifyNotice();
    },
  },

  created() {
    this.isLoading = true;
    this.getMessages();
    this.isLoading = false;
    this.getIsSendNotifyNotice();
    this.getIsReceiveNotifyNotice();
  },
};
</script>

<style scoped>
.scroll {
  height: 90%;
  margin: 0;
  overflow-y: auto;
}
</style>
