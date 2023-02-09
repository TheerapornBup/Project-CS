<template>
  <CardContent>
    <template v-slot:content-left>
      <v-icon class="icon-user" color="whiteCream" size="80"
        >mdi-account-circle</v-icon
      >
      <v-form class="log-in-form" ref="form">
        <div v-if="selectedMenu === 'editAccount'">
          <div class="log-in-field">
            <label class="label-text">ชื่อผู้ใช้</label>
            <v-text-field
              rounded
              filled
              dense
              v-model="user.username"
              :rules="usernameRules"
            />
          </div>
          <div class="log-in-field">
            <label class="label-text">อีเมล</label>
            <v-text-field
              rounded
              filled
              dense
              v-model.trim="user.email"
              :rules="emailRules"
            />
          </div>
          <div class="log-in-field">
            <label class="label-text">ชื่อ</label>
            <v-text-field
              rounded
              filled
              dense
              v-model.trim="user.firstName"
              :rules="nameRules"
            />
          </div>
          <div class="log-in-field">
            <label class="label-text">นามสกุล</label>
            <v-text-field
              rounded
              filled
              dense
              v-model.trim="user.lastName"
              :rules="nameRules"
            />
          </div>
        </div>

        <div v-else>
          <div class="log-in-field">
            <label class="label-text">รหัสผ่านเดิม</label>
            <v-text-field
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              rounded
              filled
              dense
              v-model="currentPassword"
              :rules="currentPasswordRules"
              @click:append-inner="toggleShowPassword"
            />
          </div>
          <div class="log-in-field">
            <label class="label-text">รหัสผ่านใหม่</label>
            <v-text-field
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              rounded
              filled
              dense
              v-model="newPassword"
              :rules="passwordRules"
              @click:append-inner="toggleShowPassword"
            />
          </div>
          <div class="log-in-field">
            <label class="label-text">ยืนยันรหัสผ่านใหม่</label>
            <v-text-field
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              rounded
              filled
              dense
              v-model="confirmNewPassword"
              :rules="confirmPasswordRules"
              @click:append-inner="toggleShowPassword"
            />
          </div>
        </div>

        <v-row class="log-in-field">
          <v-col
            ><v-btn
              class="bg-lightGreen text-black btn"
              block
              rounded
              @click.prevent="validateForm"
            >
              บันทึก
            </v-btn></v-col
          >
          <v-col
            ><v-btn
              class="bg-blueGreen text-black btn border-btn"
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
      <v-list-item
        :class="
          selectedMenu === 'editAccount' ? 'bg-blueGreen' : 'bg-whiteCream'
        "
        class="menu-item"
        title="แก้ไขข้อมูลส่วนตัว"
        @click="setSelectedMenu('editAccount')"
      ></v-list-item>
      <v-list-item
        :class="
          selectedMenu === 'changePassword' ? 'bg-blueGreen' : 'bg-whiteCream'
        "
        class="menu-item"
        title="เปลี่ยนรหัสผ่าน"
        @click="setSelectedMenu('changePassword')"
      ></v-list-item>
    </template>
  </CardContent>
</template>

<script>
import CardContent from "./CardContent.vue";
import { encryptData } from "../services/encrypt";
import {
  getUserByIdFirebase,
  updateUserFirebase,
} from "../services/firebases/users";
export default {
  name: "EditAccount",
  components: {
    CardContent,
  },
  data() {
    return {
      userId: null,
      selectedMenu: "editAccount",
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
        (v) => !!v || "กรุณากรอกรหัสผ่าน",
        (v) =>
          (v && v.length >= 6) || "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
      ],
      passwordRules: [
        (v) => !!v || "กรุณากรอกรหัสผ่าน",
        (v) =>
          (v && v.length >= 6) || "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
      ],
      confirmPasswordRules: [
        (v) => !!v || "กรุณายืนยันรหัสผ่าน",
        (v) => v === this.newPassword || "ยืนยันรหัสผ่านไม่ถูกต้อง",
      ],
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
      const user = await getUserByIdFirebase(this.userId);
      this.user = user;
    },
    async updateAccount() {
      const newData = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        username: this.user.username,
      };
      await updateUserFirebase(this.userId, newData);
      alert("update user account successfully");
      this.$router.push("/about");
      this.resetForm();
    },

    async updatePassword() {
      const encryptPassword = encryptData(this.newPassword);
      console.log("encrypt");
      const newData = {
        password: encryptPassword,
      };
      await updateUserFirebase(this.userId, newData);
      alert("update password successfully");
      this.$router.push("/about");
      this.resetForm();
    },

    async validateForm() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        if (this.selectedMenu === "editAccount") {
          this.updateAccount();
        } else {
          if (this.currentPassword === this.user.password) {
            this.updatePassword();
          } else {
            alert("รหัสผ่านเดิมไม่ถูกต้อง");
            this.currentPassword = "";
          }
        }
      }
    },
    clearForm() {
      this.$router.push("/about");
    },

    resetForm() {
      this.$refs.form.reset();
    },
  },
  created() {
    const id = this.$route.params.id;
    this.userId = id;
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

.label-text {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  color: #f1f1f1;
}

input {
  border-radius: 40px !important;
  background-color: #f1f1f1 !important;
}
.v-text-field {
  color: black;
}

.btn {
  height: 45px;
  margin-top: 20px;
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}
.border-btn {
  border: 2px solid #292929;
}
</style>
