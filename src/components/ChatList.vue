<template>
  <TabBar
    :tabs="tabs"
    :selected="selectedTab"
    @onChangeTab="filterNoticeStatus"
  >
    <template v-slot:content-tab
      ><v-container fluid class="d-flex">
        <!-- loading -->
        <v-progress-circular
          v-if="isLoading"
          class="ma-auto"
          size="50"
          indeterminate
          color="primary"
        ></v-progress-circular>

        <!-- show no chats -->
        <ShowNoData
          v-else-if="allChats.length === 0"
          icon="mdi-forum-outline"
          text="ไม่มีประวัติแชท"
        />

        <v-row v-else>
          <!-- chat list -->
          <v-col cols="3">
            <v-card class="bg-whiteCream">
              <v-list class="h4-th">
                <v-list-item
                  active-class="bg-lightBrown"
                  :class="
                    selectedChat === index ? 'bg-lightBrown' : 'bg-whiteCream'
                  "
                  v-for="(chat, index) in allChats"
                  :key="index"
                  :value="index"
                  :v-if="chat.messages.length > 0"
                  @click="selectedChat = index"
                >
                  <!-- user avatar -->
                  <template v-slot:prepend>
                    <v-avatar class="align-center" color="mattBlue">{{
                      getProfileName(chat)
                    }}</v-avatar>
                  </template>
                  <!-- user name -->
                  <v-list-item-title>{{
                    chat.visitorId === this.getUserId
                      ? chat.notice.name
                      : chat.visitorName
                  }}</v-list-item-title>
                  <!-- lastest message -->
                  <v-list-item-subtitle class="h5-th">{{
                    chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1].text
                      : ""
                  }}</v-list-item-subtitle>
                  <!-- time message -->
                  <template v-slot:append>
                    <p class="h5-th">
                      {{
                        chat.messages.length > 0
                          ? getDateTimeChat(
                              chat.messages[chat.messages.length - 1].dateTime
                                .seconds
                            )
                          : ""
                      }}
                    </p>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
          <!-- chat message -->
          <v-col cols="6">
            <ChatMessage
              v-if="allChats.length > 0"
              :chatId="allChats[selectedChat].chatId"
              :visitorId="allChats[selectedChat].visitorId"
              :notice="allChats[selectedChat].notice"
              :name="
                allChats[selectedChat].visitorId === this.getUserId
                  ? allChats[selectedChat].notice.name
                  : allChats[selectedChat].visitorName
              "
              @updateMessage="updateMessage"
              @updateStatus="updateStatus"
              class="noticeChat"
              ref="noticeChat"
            />
          </v-col>
          <!-- notice card -->
          <v-col cols="3">
            <v-card
              class="noticeCard"
              ref="noticeCard"
              :class="
                allChats[selectedChat].notice.type === 'ประกาศพบเจอของหาย'
                  ? 'bg-blueGreen'
                  : 'bg-lightBrown'
              "
            >
              <NoticeDetails
                v-if="allChats.length > 0"
                :notice="allChats[selectedChat].notice"
              />
            </v-card>
          </v-col>
        </v-row> </v-container
    ></template>
  </TabBar>
</template>

<script>
import NoticeDetails from "./NoticeDetails.vue";
import ShowNoData from "./ShowNoData.vue";
import {
  getNoticesByUserIdFirebase,
  getNoticeByIdFirebase,
} from "../services/firebases/notices";
import { getNameByIdFirebase } from "../services/firebases/users";
import {
  getChatByNoticeIdFirebase,
  getChatByVisitorIdFirebase,
} from "../services/firebases/chats";
import { getMessageByChatIdFirebase } from "../services/firebases/messages";
import {
  convertTimestampToDDMMYY,
  convertTimestampToTime,
  isToday,
} from "../services/DateTime";
import ChatMessage from "./ChatMessage.vue";
import TabBar from "./TabBar.vue";
export default {
  name: "ChatList",
  components: {
    NoticeDetails,
    TabBar,
    ChatMessage,
    ShowNoData,
  },
  data() {
    return {
      selectedChat: 0,
      tabs: ["ทั้งหมด", "ยืนยันสถานะแล้ว", "ยังไม่ยืนยันสถานะ"],
      allNotices: [],
      allChats: [],
      isVistor: true,
      isLoading: false,
      selectedTab: "ทั้งหมด",
    };
  },
  methods: {
    async filterNoticeStatus(tab) {
      this.selectedTab = tab;
      this.isLoading = true;
      this.selectedChat = 0;
      await this.getChats();

      if (tab !== "ทั้งหมด") {
        this.allChats = this.allChats.filter((chat) => {
          if (tab === "ยืนยันสถานะแล้ว") {
            return chat.notice.status === true;
          } else {
            return chat.notice.status === false;
          }
        });
      }

      this.isLoading = false;
    },
    getProfileName(chat) {
      const name =
        chat.visitorId === this.getUserId ? chat.notice.name : chat.visitorName;
      const n = `${name.charAt(0)}`.toUpperCase();
      return n;
    },
    async getChats() {
      this.isLoading = true;
      let chatsList = [];

      if (!this.isVistor) {
        //all notice that user = owner
        let noticesList = [];
        const notices = await getNoticesByUserIdFirebase(this.getUserId);
        const name = await getNameByIdFirebase(this.getUserId);
        for (let index in notices) {
          noticesList.push({ ...notices[index], name: name });
        }

        //all chat that user = owner notice

        for (let i in noticesList) {
          let chats = await getChatByNoticeIdFirebase(noticesList[i].noticeId);

          for (let j in chats) {
            const visitorName = await getNameByIdFirebase(chats[j].visitorId);
            const messages = await getMessageByChatIdFirebase(chats[j].chatId);
            chatsList.push({
              ...chats[j],
              visitorName: visitorName,
              notice: noticesList[i],
              messages: messages,
            });
          }
        }
      } else {
        //all chat that user = visitor
        let chats = await getChatByVisitorIdFirebase(this.getUserId);

        //all notice that user = visitor
        for (let i in chats) {
          const notice = await getNoticeByIdFirebase(chats[i].noticeId);
          const messages = await getMessageByChatIdFirebase(chats[i].chatId);

          const name = await getNameByIdFirebase(notice.userId);
          chatsList.push({
            ...chats[i],
            notice: { ...notice, name: name },
            messages: messages,
          });
        }
      }

      chatsList = chatsList.filter((chat) => chat.messages.length > 0);

      chatsList.sort(this.compareDateTime);

      this.allChats = chatsList;

      this.isLoading = false;
    },
    getSelectedChatByChatId() {
      if (this.$route.query.chatId !== null) {
        for (let i = 0; i < this.allChats.length; i++) {
          if (this.allChats[i].chatId === this.$route.query.chatId) {
            this.selectedChat = i;
          }
        }
      }
    },
    async getAllChatsAndSelectedChat(isSelectedChat = true) {
      this.isVistor = this.$route.params.isVistor === "true";
      await this.filterNoticeStatus("ทั้งหมด");
      if (isSelectedChat) {
        this.getSelectedChatByChatId();
      }
    },
    getDateTimeChat(timestamp) {
      const date = new Date(timestamp * 1000);
      if (isToday(date)) {
        return convertTimestampToTime(timestamp);
      } else {
        return convertTimestampToDDMMYY(timestamp);
      }
    },
    updateMessage(messages) {
      this.allChats[this.selectedChat] = {
        ...this.allChats[this.selectedChat],
        messages: messages,
      };
    },
    updateStatus(status) {
      this.allChats[this.selectedChat] = {
        ...this.allChats[this.selectedChat],
        notice: { ...this.allChats[this.selectedChat].notice, status: status },
      };
    },
    compareDateTime(a, b) {
      const dateTimeA =
        a.messages.length > 0 ? a.messages[a.messages.length - 1].dateTime : 0;
      const dateTimeB =
        b.messages.length > 0 ? b.messages[b.messages.length - 1].dateTime : 0;
      if (dateTimeA < dateTimeB) {
        return 1;
      }
      if (dateTimeA > dateTimeB) {
        return -1;
      }
      return 0;
    },
    // matchHeight() {
    //   var heightString = this.$refs.noticeCard.clientHeight;
    //   console.log("h: ", heightString);
    //   this.$refs.noticeChat.clientHeight = heightString;
    // },
  },
  computed: {
    getUserId() {
      return this.$store.getters["userId/getUserId"];
    },
  },
  watch: {
    selectedChat: {
      handler() {
        const containerChat = this.$refs.noticeChat;
        const containerCard = this.$refs.noticeCard;
        this.$nextTick(() => {
          containerChat.clientHeight = containerCard.clientHeight;
        });
      },
      deep: true,
    },
    chatId: function () {
      this.getMessages();
    },
    "$route.params.isVistor"() {
      this.getAllChatsAndSelectedChat(false);
    },
    "$route.query.chatId"() {
      this.getAllChatsAndSelectedChat();
    },
  },
  // mounted() {
  //   this.matchHeight();
  // },
  created() {
    this.getAllChatsAndSelectedChat();
  },
};
</script>

<style scoped></style>
