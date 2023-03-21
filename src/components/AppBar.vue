<template>
  <v-app-bar density="compact" class="bg-mattBlue text-whiteCream">
    <!-- menu button -->
    <v-app-bar-nav-icon
      v-if="getUserId != null"
      variant="text"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>
    <!-- name website -->
    <v-app-bar-title color="whiteCream" class="h3-en"
      >Physical Center-less Lost and Found System</v-app-bar-title
    >

    <!-- notification button -->
    <v-menu
      v-if="getUserId != null"
      v-model="notificationMenu"
      :close-on-content-click="false"
      location="start"
    >
      <!-- notification button -->
      <template v-slot:activator="{ props }">
        <v-btn class="mr-3" icon="mdi-bell" color="lightGreen" v-bind="props">
        </v-btn>
      </template>

      <v-card min-width="300" max-height="200" class="h4-th overflow-y-auto">
        <v-list>
          <!-- profile information -->
          <v-list-item
            v-for="(notification, index) in notifications"
            :key="index"
            @click="clickNotification(notification)"
            ><template v-slot:prepend>
              <v-avatar color="mattBlue"
                ><v-icon>{{
                  getIconNotification(notification.type)
                }}</v-icon></v-avatar
              >
            </template>
            <v-list-item-title>
              {{
                notification.type === "report user"
                  ? "ถูกรายงานบัญชี"
                  : notification.type === "expire soon"
                  ? notification.text
                  : notification.senderName
              }}</v-list-item-title
            >
            <v-list-item-subtitle
              v-if="
                notification.type !== 'report user' &&
                notification.type !== 'expire soon'
              "
              >{{ notification.text }}</v-list-item-subtitle
            >
            <template v-slot:append v-if="notification.type === 'message'">
              <p class="h5-th">
                {{ getDateTimeNotification(notification.dateTime.seconds) }}
              </p>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <!-- log in button -->
    <v-btn
      v-if="getUserId == null"
      class="h4-th"
      variant="text"
      color="whiteCream"
      to="/log-in"
      >เข้าสู่ระบบ</v-btn
    >

    <!-- profile button -->
    <v-menu
      v-else
      v-model="profileMenu"
      :close-on-content-click="false"
      location="start"
    >
      <!-- profile avatar -->
      <template v-slot:activator="{ props }">
        <v-avatar
          class="bg-lightGreen mr-3 pointer h4-th"
          v-bind="props"
          variant="elevated"
        >
          {{ getProfileName() }}
        </v-avatar>
      </template>

      <v-card min-width="300" class="h4-th">
        <v-list>
          <!-- profile information -->
          <v-list-item
            ><template v-slot:prepend>
              <v-avatar color="mattBlue">{{ getProfileName() }}</v-avatar>
            </template>
            <v-list-item-title>
              ชื่อ : {{ user.firstName }} {{ user.lastName }}</v-list-item-title
            >
            <v-list-item-subtitle
              >อีเมล : {{ user.email }}</v-list-item-subtitle
            >
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <!-- edit account button -->
          <v-list-item
            @click="editAccount()"
            prepend-icon="mdi-account-edit-outline"
            title="แก้ไขบัญชี"
          >
          </v-list-item>

          <!-- log out button -->
          <v-list-item
            @click="logOut()"
            prepend-icon="mdi-logout"
            title="ออกจากระบบ"
          >
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>

  <!-- navigation drawer -->
  <v-navigation-drawer
    v-model="drawer"
    class="bg-lightGreen h4-th"
    disable-resize-watcher
  >
    <v-list class="pt-0">
      <v-list-item
        v-for="item in items"
        :key="item"
        @click="clickMenu(item.route)"
        :value="item"
        :title="item.title"
        :prepend-icon="item.icon"
        class="bg-lightBrown mt-5 shadow"
      >
      </v-list-item
      ><v-list-group value="chat">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="แชท"
            prepend-icon="mdi-forum-outline"
            class="bg-lightBrown mt-5 shadow"
          ></v-list-item>
        </template>

        <v-list-item
          v-for="(chat, i) in chatsMenu"
          :key="i"
          :value="chat.title"
          :title="chat.title"
          @click="
            clickMenu({ name: 'chatList', params: { isVistor: chat.isVistor } })
          "
          style="background-color: #e5c2a3"
        ></v-list-item
      ></v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {
  getUserByIdFirebase,
  getNameByIdFirebase,
} from "../services/firebases/users";
import { getNotificationsByReceiverFirebase } from "../services/firebases/notifications";
import { getLastestMessageByChatIdFirebase } from "../services/firebases/messages";
import { getChatByIdFirebase } from "@/services/firebases/chats";
import {
  convertTimestampToDDMMYY,
  convertTimestampToTime,
  isToday,
} from "@/services/DateTime";
export default {
  name: "AppBar",

  data() {
    return {
      user: {
        firstName: "marry",
        lastName: "holland ",
        email: "marry@gmail.com",
        username: "marry59",
        password: "marry12345",
      },

      profileMenu: false,
      notificationMenu: false,
      drawer: false,

      chatsMenu: [
        { title: "แชทผู้ติดต่อใบประกาศ", isVistor: true },
        { title: "แชทเจ้าของใบประกาศ", isVistor: false },
      ],

      items: [
        {
          title: "ค้นหาประกาศของหาย",
          icon: "mdi-file-search-outline",
          route: "/search",
        },
        {
          title: "เพิ่มประกาศของหาย",
          icon: "mdi-file-plus-outline",
          route: "/add-notice",
        },
        {
          title: "ประวัติใบประกาศ",
          icon: "mdi-history",
          route: "/history",
        },
      ],

      notifications: [],
    };
  },
  methods: {
    logOut() {
      this.closeAllPopup();
      this.$store.dispatch("userId/logOut");
      this.$router.push("/");
    },
    editAccount() {
      this.$router.push(`/edit-account`);
      this.closeAllPopup();
    },
    async getUser() {
      const user = await getUserByIdFirebase(this.getUserId);
      this.user = user;
    },
    getProfileName() {
      const name = `${this.user.username.charAt(0)}
      `.toUpperCase();
      return name;
    },
    async getNotifications() {
      const notificationsList = await getNotificationsByReceiverFirebase(
        this.getUserId
      );
      for (let i in notificationsList) {
        let notification = notificationsList[i];
        notification.senderName = await getNameByIdFirebase(
          notification.sender
        );

        if (notification.type === "message") {
          const chat = await getChatByIdFirebase(notification.itemId);
          const item = await getLastestMessageByChatIdFirebase(
            notification.itemId,
            notification.receiver !== chat.visitorId
          );
          notification.dateTime = item.dateTime;
          notification.isVistor = chat.visitorId === this.getUserId;
        } else if (
          notification.type === "wait confirm receipt" ||
          notification.type === "confirm receipt"
        ) {
          const chat = await getChatByIdFirebase(notification.itemId);

          notification.isVistor = chat.visitorId === this.getUserId;
        }
        notificationsList[i] = notification;
      }
      this.notifications = notificationsList;
    },
    getIconNotification(type) {
      let icon = "mdi-account-alert";
      if (type === "message") {
        icon = "mdi-forum-outline";
      } else if (type === "wait confirm receipt") {
        icon = "mdi-package-variant";
      } else if (type === "confirm receipt") {
        icon = "mdi-package-variant-closed";
      } else if (type === "expire soon") {
        icon = "mdi-file-clock-outline";
      }
      return icon;
    },
    clickNotification(notification) {
      if (notification.type === "expire soon") {
        this.$router.push({
          path: `/history`,
        });
        this.closeAllPopup();
      } else if (notification.type !== "report user") {
        this.$router.push({
          path: `/chat-list/${notification.isVistor}`,
          query: { chatId: notification.itemId },
        });
        this.closeAllPopup();
      }
    },
    clickMenu(path) {
      this.$router.push(path);
      this.closeAllPopup();
    },
    closeAllPopup() {
      this.profileMenu = false;
      this.notificationMenu = false;
      this.drawer = false;
    },

    getDateTimeNotification(timestamp) {
      const date = new Date(timestamp * 1000);
      if (isToday(date)) {
        return convertTimestampToTime(timestamp);
      } else {
        return convertTimestampToDDMMYY(timestamp);
      }
    },
  },

  computed: {
    getUserId() {
      return this.$store.getters["userId/getUserId"];
    },
  },
  watch: {
    getUserId: {
      handler: function () {
        if (this.getUserId != null) {
          this.getUser();
          this.getNotifications();
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.shadow {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>
