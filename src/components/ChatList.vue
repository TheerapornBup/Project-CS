<template>
  <TabBar :tabs="tabs" @onChangeTab="filterNoticeStatus">
    <template v-slot:content-tab
      ><v-container fluid>
        <v-row>
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
                    chat.messages[chat.messages.length - 1].text
                  }}</v-list-item-subtitle>
                  <!-- time message -->
                  <template v-slot:append>
                    <p class="h5-th">
                      {{
                        getTime(
                          chat.messages[chat.messages.length - 1].dateTime
                            .seconds
                        )
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
              :notice="allChats[selectedChat].notice"
              @updateMessage="updateMessage"
              class="noticeChat"
              ref="noticeChat"
            />
          </v-col>
          <!-- notice card -->
          <v-col cols="3">
            <v-card class="noticeCard" ref="noticeCard">
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
import { convertTimestampToTime } from "../services/DateTime";
import ChatMessage from "./ChatMessage.vue";
import TabBar from "./TabBar.vue";
export default {
  name: "ChatList",
  components: {
    NoticeDetails,
    TabBar,
    ChatMessage,
  },
  data() {
    return {
      selectedChat: 0,
      tabs: ["ทั้งหมด", "ยืนยันสถานะแล้ว", "ยังไม่ยืนยันสถานะ"],
      allNotices: [],
      allChats: [],
    };
  },
  methods: {
    filterNoticeStatus(tab) {
      if (tab === "ยืนยันสถานะแล้ว") {
        console.log(tab);
      } else if (tab === "ยังไม่ยืนยันสถานะ") {
        console.log(tab);
      } else {
        console.log(tab);
      }
    },
    getProfileName(chat) {
      const name =
        chat.visitorId === this.getUserId ? chat.notice.name : chat.visitorName;
      const n = `${name.charAt(0)}`.toUpperCase();
      return n;
    },
    async getNotices() {
      //all notice that user = owner
      let noticesList = [];
      const notices = await getNoticesByUserIdFirebase(this.getUserId);
      const name = await getNameByIdFirebase(this.getUserId);
      for (let index in notices) {
        noticesList.push({ ...notices[index], name: name });
      }

      //all chat that user = owner notice
      let chatsList = [];
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

      this.allChats = chatsList;
    },
    getTime(timestamp) {
      const time = convertTimestampToTime(timestamp);
      return time;
    },
    updateMessage(messages) {
      this.allChats[this.selectedChat] = {
        ...this.allChats[this.selectedChat],
        messages: messages,
      };
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
  },
  // mounted() {
  //   this.matchHeight();
  // },
  created() {
    this.getNotices();
  },
};
</script>

<style scoped></style>
