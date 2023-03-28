<template>
  <CardContent>
    <template v-slot:content-left>
      <!-- account icon -->
      <v-icon class="icon-user" color="whiteCream" size="80"
        >mdi-account-circle</v-icon
      >
      <v-form class="log-in-form" ref="form">
        <!-- edit account form -->
        <div v-if="selectedMenu === 'editAccount'">
          <!-- username text field -->
          <div class="log-in-field">
            <label class="h4-th">ชื่อผู้ใช้</label>
            <v-text-field
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model="user.username"
              :rules="usernameRules"
            />
          </div>

          <!-- email text field -->
          <div class="log-in-field">
            <label class="h4-th">อีเมล</label>
            <v-text-field
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model.trim="user.email"
              :rules="emailRules"
            />
          </div>

          <!-- first name text field -->
          <div class="log-in-field">
            <label class="h4-th">ชื่อ</label>
            <v-text-field
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model.trim="user.firstName"
              :rules="nameRules"
            />
          </div>

          <!-- last name text field -->
          <div class="log-in-field">
            <label class="h4-th">นามสกุล</label>
            <v-text-field
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model.trim="user.lastName"
              :rules="nameRules"
            />
          </div>
        </div>

        <!-- change password form -->
        <div v-else>
          <!-- current password text field -->
          <div class="log-in-field">
            <label class="h4-th">รหัสผ่านเดิม</label>
            <v-text-field
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model="currentPassword"
              :rules="currentPasswordRules"
              @click:append-inner="toggleShowPassword"
            />
          </div>

          <!-- new password text field -->
          <div class="log-in-field">
            <label class="h4-th">รหัสผ่านใหม่</label>
            <v-text-field
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model="newPassword"
              :rules="passwordRules"
              @click:append-inner="toggleShowPassword"
            />
          </div>

          <!-- confirm password text field -->
          <div class="log-in-field">
            <label class="h4-th">ยืนยันรหัสผ่านใหม่</label>
            <v-text-field
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model="confirmNewPassword"
              :rules="confirmPasswordRules"
              @click:append-inner="toggleShowPassword"
            />
          </div>
        </div>

        <!-- save button -->
        <v-row class="log-in-field">
          <v-col
            ><v-btn
              class="bg-lightGreen text-black btn h4-th"
              block
              rounded
              @click.prevent="validateForm"
            >
              บันทึก
            </v-btn></v-col
          >

          <!-- cancel button -->
          <v-col
            ><v-btn
              class="bg-blueGreen text-black btn border-btn h4-th"
              block
              rounded
              @click="clearForm"
            >
              ยกเลิก
            </v-btn></v-col
          >
        </v-row>
      </v-form>
    </template>

    <template v-slot:content-right>
      <!-- edit account menu -->
      <v-list-item
        :class="
          selectedMenu === 'editAccount' ? 'bg-blueGreen' : 'bg-whiteCream'
        "
        class="menu-item"
        title="แก้ไขข้อมูลส่วนตัว"
        @click="setSelectedMenu('editAccount')"
      ></v-list-item>

      <!-- change password menu -->
      <v-list-item
        :class="
          selectedMenu === 'changePassword' ? 'bg-blueGreen' : 'bg-whiteCream'
        "
        class="menu-item"
        title="เปลี่ยนรหัสผ่าน"
        @click="setSelectedMenu('changePassword')"
      ></v-list-item>

      <v-spacer></v-spacer>

      <!-- delete account button -->
      <v-btn class="ma-5 h4-th" color="error" rounded="pill"
        >ลบบัญชี
        <!-- confirm delete notice dialog -->
        <v-dialog
          v-model="deleteDialog"
          persistent
          activator="parent"
          width="auto"
        >
          <v-card class="h4-th pa-5">
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

            <v-card-title class="text-center">
              คุณแน่ใจหรือไม่ว่าต้องการลบ “บัญชี” นี้?
            </v-card-title>
            <v-card-text
              >เมื่อกด “ลบบัญชี” ข้อมูลของคุณจะถูกลบออกจากระบบภายใน 30
              วัน</v-card-text
            >
            <v-card-actions class="d-flex justify-space-evenly">
              <v-btn
                class="bg-error flex-grow-1"
                rounded="pill "
                @click="confirmDeleteAccount()"
              >
                ลบ
              </v-btn>
              <v-btn
                variant="outlined flex-grow-1"
                rounded="pill "
                @click="deleteDialog = false"
              >
                ยกเลิก
              </v-btn>
            </v-card-actions></v-card
          ></v-dialog
        >
      </v-btn>
    </template>
  </CardContent>
  <CustomDialog
    :value="dialog.value"
    :type="dialog.type"
    :content="dialog.content"
    @onChangeDialog="setShowDialog"
  />
</template>

<script>
import CardContent from "./CardContent.vue";
import CustomDialog from "./CustomDialog.vue";
import { encryptData } from "../services/encrypt";
import {
  getUserByIdFirebase,
  updateUserFirebase,
} from "../services/firebases/users";
import { deleteUserAccount } from "@/services/deleteItem";

export default {
  name: "EditAccount",
  components: {
    CardContent,
    CustomDialog,
  },
  data() {
    return {
      selectedMenu: "editAccount",
      deleteDialog: false,
      user: {
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
      },
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      showPassword: false,
      nameRules: [(v) => !!v || "กรุณากรอกชื่อ"],
      emailRules: [
        (v) => !!v || "กรุณากรอกอีเมล",
        (v) =>
          (v && /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(v)) ||
          "รูปแบบอีเมลไม่ถูกต้อง",
      ],
      usernameRules: [
        (v) => !!v || "กรุณากรอกชื่อผู้ใช้",
        (v) => (v && !v.includes("@")) || "ชื่อผู้ใช้ต้องไม่มีเครื่องหมาย @",
        (v) =>
          (v && v.length >= 5) || "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 5 ตัวอักษร",
      ],
      currentPasswordRules: [
        (v) => !!v || "กรุณากรอกรหัสผ่านเดิม",
        (v) =>
          (v && v.length >= 8) || "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
      ],
      passwordRules: [
        (v) => !!v || "กรุณากรอกรหัสผ่านใหม่",
        (v) =>
          (v && v.length >= 8) || "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
      ],
      confirmPasswordRules: [
        (v) => !!v || "กรุณายืนยันรหัสผ่านใหม่",
        (v) => v === this.newPassword || "ยืนยันรหัสผ่านไม่ถูกต้อง",
      ],
      dialog: {
        value: false,
        type: "success",
        content: "",
      },
    };
  },
  methods: {
    setSelectedMenu(menu) {
      this.selectedMenu = menu;
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    async getUser() {
      const user = await getUserByIdFirebase(this.getUserId);
      this.user = user;
    },
    async updateAccount() {
      const newData = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        username: this.user.username,
      };
      await updateUserFirebase(this.getUserId, newData);
      this.dialog = {
        value: true,
        type: "success",
        content: "แก้ไขข้อมูลส่วนตัวสำเร็จ",
      };
    },

    async updatePassword() {
      const encryptPassword = encryptData(this.newPassword);

      const newData = {
        password: encryptPassword,
      };
      await updateUserFirebase(this.getUserId, newData);
      this.dialog = {
        value: true,
        type: "success",
        content: "เปลี่ยนรหัสผ่านใหม่สำเร็จ",
      };
    },

    async validateForm() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        if (this.selectedMenu === "editAccount") {
          this.updateAccount();
        } else {
          const encryptCurrentPassword = encryptData(this.currentPassword);
          const encryptNewPassword = encryptData(this.newPassword);
          if (encryptCurrentPassword !== this.user.password) {
            this.dialog = {
              value: true,
              type: "warning",
              content: "รหัสผ่านเดิมไม่ถูกต้อง",
            };
          } else if (encryptNewPassword === this.user.password) {
            this.dialog = {
              value: true,
              type: "warning",
              content: "กรุณากรอกรหัสผ่านใหม่",
            };
          } else {
            this.updatePassword();
          }
        }
      }
    },
    clearForm() {
      this.$router.back();
    },

    resetForm() {
      this.$refs.form.reset();
    },

    async confirmDeleteAccount() {
      await deleteUserAccount(this.getUserId);
      this.deleteDialog = false;
      this.dialog = {
        value: true,
        type: "success",
        content: "ลบบัญชีสำเร็จ",
      };
    },
    setShowDialog(isShow) {
      this.dialog.value = isShow;
      if (!isShow) {
        if (
          this.dialog.content === "แก้ไขข้อมูลส่วนตัวสำเร็จ" ||
          this.dialog.content === "เปลี่ยนรหัสผ่านใหม่สำเร็จ"
        ) {
          this.$router.back();
          this.resetForm();
        } else if (this.dialog.content === "รหัสผ่านเดิมไม่ถูกต้อง") {
          this.currentPassword = "";
        } else if (this.dialog.content === "กรุณากรอกรหัสผ่านใหม่") {
          this.newPassword = "";
          this.confirmNewPassword = "";
        } else if (this.dialog.content === "ลบบัญชีสำเร็จ") {
          this.$router.push("/");
          this.$store.dispatch("userId/logOut");
        }
      }
    },
  },
  computed: {
    getUserId() {
      return this.$store.getters["userId/getUserId"];
    },
  },
  created() {
    this.getUser();
  },
};
</script>

<style scoped>
.icon-user {
  padding-top: 50px;
  margin: auto;
}
.menu-item {
  height: 50px;
  text-align: center;
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
}

.log-in-form {
  width: 70%;
  margin: auto;
}

.log-in-field {
  margin-bottom: 0;
}

.btn {
  height: 45px;
  margin-top: 20px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}
.border-btn {
  border: 2px solid #292929;
}
</style>
