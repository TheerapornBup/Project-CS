<template>
  <CardContent>
    <!-- chat -->
    <template v-slot:content-left>
      <ChatMessage
        :chatId="chatId"
        :notice="notice"
        :visitorId="getUserId"
        :name="notice.name"
      />
    </template>
    <!-- notice details -->
    <template v-slot:content-right>
      <NoticeDetails :notice="notice" :showStatus="false" />
    </template>
  </CardContent>
</template>

<script>
import CardContent from "./CardContent.vue";
import NoticeDetails from "./NoticeDetails.vue";
import ChatMessage from "./ChatMessage.vue";
import {
  getChatFirebase,
  createChatFirebase,
} from "../services/firebases/chats";

export default {
  name: "NoticeChat",
  components: {
    CardContent,
    NoticeDetails,
    ChatMessage,
  },
  props: {
    notice: {
      type: Object,
    },
  },
  data() {
    return {
      chatId: null,
    };
  },
  methods: {
    async getChatId() {
      //get Chat id from firebase
      let chatId = await getChatFirebase(this.notice.noticeId, this.getUserId);

      if (chatId === null) {
        //create Chat
        const chat = {
          noticeId: this.notice.noticeId,
          visitorId: this.getUserId,
        };
        chatId = await createChatFirebase(chat);
      }
      this.chatId = chatId;
    },
  },
  computed: {
    getUserId() {
      return this.$store.getters["userId/getUserId"];
    },
  },
  async created() {
    await this.getChatId();
  },
};
</script>

<style scoped></style>
