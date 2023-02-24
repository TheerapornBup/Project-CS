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
          class="bg-lightGreen mr-2 pointer h4-th"
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
  <v-navigation-drawer v-model="drawer" class="bg-lightGreen h4-th">
    <v-list class="pt-0">
      <v-list-item
        v-for="item in items"
        :key="item"
        :to="item.route"
        :value="item"
        :title="item.title"
        :prepend-icon="item.icon"
        class="bg-lightBrown mt-5 shadow"
      >
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { getUserByIdFirebase } from "../services/firebases/users";
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

      drawer: false,

      items: [
        {
          title: "ค้นหาประกาศของหาย",
          icon: "mdi-file-search-outline",
          route: "/search",
        },
        {
          title: "เพิ่มประกาศของหาย",
          icon: "mdi-file-plus-outline",
          route: "/search",
        },
        {
          title: "ประวัติใบประกาศที่เคยสร้าง",
          icon: "mdi-history",
          route: "/history",
        },
        {
          title: "แชท",
          icon: "mdi-forum-outline",
          route: "/chat-list",
        },
      ],
    };
  },
  methods: {
    logOut() {
      this.$store.dispatch("userId/logOut");
      this.$router.push("/");
      this.profileMenu = false;
    },
    editAccount() {
      this.$router.push(`/edit-account`);
      this.profileMenu = false;
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
