<template>
  <!-- app bar -->
  <v-sheet class="h-15 d-flex bg-cream align-center px-2">
    <!-- confirm send item button -->
    <v-btn
      v-if="
        (!isSendNotifyNotice &&
          notice.type === 'ประกาศพบเจอของหาย' &&
          getUserId === notice.userId) ||
        (!isSendNotifyNotice &&
          notice.type !== 'ประกาศพบเจอของหาย' &&
          getUserId !== notice.userId)
      "
      class="bg-mattBlue text-center h4-th"
      rounded="md"
      :disabled="isReport"
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
          <v-card-text
            ><p>คุณต้องการยืนยันการส่งคืนของหรือไม่</p>
            <v-checkbox
              class="mt-3"
              v-model="isReward"
              density="compact"
              color="mattBlue"
            >
              <template v-slot:label>
                <div>
                  ต้องการรับรางวัล ตาม
                  <router-link to="/reward-law" target="_blank">
                    กฎหมายการรับสินน้ำใจ
                  </router-link>
                </div>
              </template>
            </v-checkbox></v-card-text
          >

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

    <!-- confirm receive item button -->
    <v-btn
      v-if="receiveNotifyNotice !== null && !notice.status"
      rounded="md"
      class="bg-mattBlue text-center h4-th"
      :disabled="isReport"
    >
      ส่งการยืนยันรับของ{{
        receiveNotifyNotice.text === "รอการยืนยันการรับส่งของและให้ค่าตอบแทน"
          ? "และให้ค่าตอบแทน"
          : ""
      }}
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
          <v-card-title class="text-center">
            ยืนยันการรับของ{{
              receiveNotifyNotice.text ===
              "รอการยืนยันการรับส่งของและให้ค่าตอบแทน"
                ? "และให้ค่าตอบแทน"
                : ""
            }}
          </v-card-title>
          <v-card-text
            >คุณต้องการยืนยันการรับของ{{
              receiveNotifyNotice.text ===
              "รอการยืนยันการรับส่งของและให้ค่าตอบแทน"
                ? "และให้ค่าตอบแทน"
                : ""
            }}หรือไม่</v-card-text
          >

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

    <v-spacer></v-spacer>

    <!-- more button -->
    <v-menu
      v-model="moreMenu"
      :close-on-content-click="false"
      location="bottom right"
      :disabled="isReport"
    >
      <template v-slot:activator="{ props }">
        <v-btn variant="plain" icon="mdi-dots-vertical" v-bind="props"></v-btn>
      </template>

      <v-card class="h4-th">
        <!-- report user button -->
        <v-list-item
          prepend-icon="mdi-account-alert"
          title="รายงานบัญชี"
          class="pointer"
        >
          <v-dialog
            v-model="reportDialog"
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
                    @click="
                      reportDialog = false;
                      moreMenu = false;
                    "
                  ></v-btn>
                </v-col>
              </v-row>
              <v-card-title class="text-center"> รายงานบัญชี </v-card-title>
              <!-- select issue user -->
              <v-card-text>
                <v-form ref="form">
                  <p class="mb-3">รายละเอียดปัญหาของบัญชีผู้ใช้นี้</p>
                  <v-radio-group
                    v-model="issue"
                    :rules="[(v) => !!v || 'กรุณาเลือกรายละเอียด']"
                    color="mattBlue"
                  >
                    <v-radio label="สแปม" value="สแปม"></v-radio>
                    <v-radio
                      v-if="notice.type === 'ประกาศพบเจอของหาย'"
                      label="ไม่ให้ค่าตอบแทนตามที่ตกลง"
                      value="ไม่ให้ค่าตอบแทนตามที่ตกลง"
                    ></v-radio>
                    <v-radio
                      v-if="notice.type === 'ประกาศพบเจอของหาย'"
                      label="ไม่ใช่เจ้าของของหาย"
                      value="ไม่ใช่เจ้าของของหาย"
                    ></v-radio>
                    <v-radio
                      v-if="notice.type !== 'ประกาศพบเจอของหาย'"
                      label="ไม่ได้ของคืน"
                      value="ไม่ได้ของคืน"
                    ></v-radio>
                  </v-radio-group>
                </v-form>
              </v-card-text>

              <v-card-actions class="mt-5">
                <v-row>
                  <v-col>
                    <v-btn
                      class="bg-mattBlue"
                      rounded="pill"
                      block
                      @click="confirmReportUser()"
                    >
                      ยืนยัน
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn
                      variant="outlined"
                      rounded="pill"
                      block
                      @click="
                        reportDialog = false;
                        moreMenu = false;
                      "
                    >
                      ยกเลิก
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-list-item>
      </v-card>
    </v-menu>
  </v-sheet>

  <div class="hh-scroll">

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

  </div>

  <!-- input message -->
  <v-sheet class="d-flex bg-lightBrown align-center" style="padding:2px;">
    <!-- text field message -->
    <v-text-field
      class="flex-grow-1 px-2 h4-th"
      variant="plain"
      v-model.trim="text"
      autofocus="true"
      :disabled="isReport"
    ></v-text-field>
    <!-- send button -->
    <v-btn
      class="bg-mattBlue mr-2"
      icon="mdi-send"
      @click.prevent="sendMessage()"
      :disabled="isReport"
    ></v-btn>
  </v-sheet>

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
  getMatchNotificationFirebase,
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
      isSendNotifyNotice: true,
      receiveNotifyNotice: null,
      isLoading: false,
      text: "",
      dialog: {
        value: false,
        type: "success",
        content: "",
      },
      isReward: false,
      moreMenu: false,
      issue: "",
      reportDialog: false,
      isReport: false,
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
          this.chatId,
          this.notice.userId === this.getUserId
            ? this.visitorId
            : this.notice.userId,
          this.text
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
        "wait confirm receipt",
        this.chatId,
        this.notice.userId === this.getUserId
          ? this.visitorId
          : this.notice.userId,
        this.isReward
          ? "รอการยืนยันการรับส่งของและให้ค่าตอบแทน"
          : "รอการยืนยันการรับส่งของ"
      );
      this.confirmDialog = false;
      this.isReward = false;
      this.dialog = {
        value: true,
        type: "success",
        content: "ยืนยันการคืนของสำเร็จ",
      };
    },
    async confirmReceiveItem() {
      const text =
        this.receiveNotifyNotice.text ===
        "รอการยืนยันการรับส่งของและให้ค่าตอบแทน"
          ? "ยืนยันการรับส่งของสำเร็จและให้ค่าตอบแทน"
          : "ยืนยันการรับส่งของสำเร็จ";

      await this.sendNotification(
        "confirm receipt",
        this.chatId,
        this.notice.userId === this.getUserId
          ? this.visitorId
          : this.notice.userId,
        text
      );

      await updateNoticeFirebase(this.notice.noticeId, { status: true });

      this.confirmDialog = false;

      this.dialog = {
        value: true,
        type: "success",
        content: text,
      };
    },
    async confirmReportUser() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        await this.sendNotification(
          "report user",
          this.chatId,
          this.notice.userId === this.getUserId
            ? this.visitorId
            : this.notice.userId,
          this.issue
        );
        this.issue = "";
        this.reportDialog = false;
        this.moreMenu = false;
        this.isReport = true;
        this.dialog = {
          value: true,
          type: "success",
          content: "รายงานบัญชีสำเร็จ",
        };
      }
    },

    async sendNotificationMessage(chatId, receiver, text) {
      // check is exist notification type message
      const notification = await getMatchNotificationFirebase(
        "message",
        chatId,
        receiver
      );

      if (notification !== null) {
        // yes , update time notification
        const updateNotification = {
          dateTime: new Date(),
          text: text,
        };
        await updateNotificationFirebase(
          notification.notificationId,
          updateNotification
        );
      } else {
        //no , create notification
        await this.sendNotification("message", chatId, receiver, text);
      }
    },

    async sendNotification(type, itemId, receiver, text) {
      const notification = {
        sender: this.getUserId,
        receiver: receiver,
        itemId: itemId,
        type: type,
        text: text,
        dateTime: new Date(),
      };
      await createNotificationFirebase(notification);
    },

    async getIsSendNotifyNotice() {
      const isSend = await isExistNotificationFirebase(
        "wait confirm receipt",
        this.chatId
      );
      this.isSendNotifyNotice = isSend;
    },
    async getIsReceiveNotifyNotice() {
      const receiveNotification = await getMatchNotificationFirebase(
        "wait confirm receipt",
        this.chatId,
        this.getUserId
      );

      this.receiveNotifyNotice = receiveNotification;
    },
    async getIsReport() {
      const isReport = await isExistNotificationFirebase(
        "report user",
        this.chatId
      );
      this.isReport = isReport;
    },
    setShowDialog(isShow) {
      this.dialog.value = isShow;
      if (!isShow) {
        if (this.dialog.content === "ยืนยันการคืนของสำเร็จ") {
          this.isSendNotifyNotice = true;
        } else if (
          this.dialog.content === "ยืนยันการรับของสำเร็จ" ||
          this.dialog.content === "ยืนยันการรับส่งของสำเร็จและให้ค่าตอบแทน"
        ) {
          this.$emit("updateStatus", true);
        }
      }
    },
    async initChat() {
      this.isLoading = true;
      await this.getIsReport();
      await this.getMessages();
      await this.getIsSendNotifyNotice();
      await this.getIsReceiveNotifyNotice();
      this.isLoading = false;
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
      this.isSendNotifyNotice = true;
      this.receiveNotifyNotice = null;
      this.isReport = false;
      this.initChat();
    },
  },

  created() {
    this.initChat();
  },
};
</script>

<style>
.scroll {
  height: 68vh;
  margin: 0;
  overflow-y: auto;
}
.hh-scroll{
  height:490px;
}

.card-col {
  display: flex;
  flex-direction: column;
  height: auto;
}
</style>
