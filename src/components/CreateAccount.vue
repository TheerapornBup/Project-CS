<template>
  <CardContent>
    <template v-slot:content-left>
      <!-- register title -->
      <label class="title">REGISTER</label>

      <v-form class="log-in-form" ref="form">
        <div class="log-in-group-field">
          <!-- first name text field -->
          <div class="log-in-field">
            <label class="h4-th">ชื่อ</label>
            <v-text-field
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model.trim="firstName"
              :rules="nameRules"
              autofocus="true"
            />
          </div>

          <!-- last name text field -->
          <div class="log-in-field">
            <label class="h4-th">นามสกุล</label>
            <v-text-field
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model.trim="lastName"
              :rules="nameRules"
            />
          </div>

          <!-- email text field -->
          <div class="log-in-field">
            <label class="h4-th">อีเมล</label>
            <v-text-field
              type="email"
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model.trim="email"
              :rules="emailRules"
            />
          </div>
        </div>

        <!-- <v-divider thickness="3" color="whiteCream"></v-divider> -->

        <!-- username text field -->
        <div class="log-in-group-field">
          <div class="log-in-field">
            <label class="h4-th">ชื่อผู้ใช้</label>
            <v-text-field
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model.trim="username"
              :rules="usernameRules"
            />
          </div>

          <!-- password text field -->
          <div class="log-in-field">
            <label class="h4-th">รหัสผ่าน</label>
            <v-text-field
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append-inner="toggleShowPassword"
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model.trim="password"
              :rules="passwordRules"
            />
          </div>

          <!-- confirm password text field -->
          <div class="log-in-field">
            <label class="h4-th">ยืนยันรหัสผ่าน</label>
            <v-text-field
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append-inner="toggleShowPassword"
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model.trim="confirmPassword"
              :rules="confirmPasswordRules"
            />
          </div>
        </div>

        <!-- policy checkbox -->
        <div class="log-in-field">
          <v-checkbox
            class="checkbox-text"
            v-model="isAgree"
            density="compact"
            :rules="checkboxRules"
          >
            <template v-slot:label>
              <div>
                ฉันได้อ่าน และ อนุมัติ
                <router-link to="/policy-terms">
                  ข้อกำหนดในการให้บริการและนโยบายความเป็นส่วนตัวแล้ว
                </router-link>
              </div>
            </template>
          </v-checkbox>
        </div>

        <!-- create account button -->
        <div class="log-in-field log-in-group-field">
          <v-btn
            class="bg-lightGreen text-black btn h4-th"
            rounded
            block
            @click.prevent="validateForm"
          >
            สร้างบัญชี
          </v-btn>
        </div>
      </v-form>
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
  createUserFirebase,
  isExistUsernameFirebase,
  isExistEmailFirebase,
} from "../services/firebases/users";
export default {
  name: "CreateAccount",
  components: {
    CardContent,
    CustomDialog,
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      isAgree: false,
      showPassword: false,

      nameRules: [(v) => !!v || "กรุณากรอกชื่อ"],
      emailRules: [
        (v) => !!v || "กรุณากรอกอีเมล",
        (v) =>
          (v && /^[a-zA-z.-]+@[a-zA-z.-]+\.[a-z]+$/i.test(v)) ||
          "รูปแบบอีเมลไม่ถูกต้อง",
      ],
      usernameRules: [
        (v) => !!v || "กรุณากรอกชื่อผู้ใช้",
        (v) => (v && !v.includes("@")) || "ชื่อผู้ใช้ต้องไม่มีเครื่องหมาย @",
        (v) =>
          (v && v.length >= 5) || "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 5 ตัวอักษร",
      ],
      passwordRules: [
        (v) => !!v || "กรุณากรอกรหัสผ่าน",
        (v) =>
          (v && v.length >= 8) || "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
      ],
      confirmPasswordRules: [
        (v) => !!v || "กรุณายืนยันรหัสผ่าน",
        (v) => v === this.password || "ยืนยันรหัสผ่านไม่ถูกต้อง",
      ],
      checkboxRules: [
        (v) =>
          !!v ||
          "คุณต้องอนุมัติข้อกำหนดในการให้บริการและนโยบายความเป็นส่วนตัวแล้ว",
      ],

      dialog: {
        value: false,
        type: "success",
        content: "",
      },
    };
  },
  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    async addUser() {
      const encryptPassword = encryptData(this.password);

      const user = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        username: this.username,
        password: encryptPassword,
      };

      await createUserFirebase(user);

      this.dialog = {
        value: true,
        type: "success",
        content: "สร้างบัญชีสำเร็จ",
      };
      // alert("สร้างบัญชีสำเร็จ");
      // this.resetForm();
      // this.$router.push("/");
    },

    async validateForm() {
      const { valid } = await this.$refs.form.validate();

      const isExistUsername = await isExistUsernameFirebase(this.username);
      const isExistEmail = await isExistEmailFirebase(this.email);

      if (isExistUsername) {
        this.dialog = {
          value: true,
          type: "warning",
          content: "ชื่อผู้ใช้นี้มีผู้ใช้งานแล้ว กรุณากรอกชื่อผู้ใช้ใหม่",
        };
        // alert("ชื่อผู้ใช้นี้มีผู้ใช้งานแล้ว กรุณากรอกชื่อผู้ใช้ใหม่");
        // this.username = "";
      } else if (isExistEmail) {
        this.dialog = {
          value: true,
          type: "warning",
          content: "อีเมลนี้มีผู้ใช้งานแล้ว กรุณากรอกอีเมลใหม่",
        };
        // alert("อีเมลนี้มีผู้ใช้งานแล้ว กรุณากรอกอีเมลใหม่");
        // this.email = "";
      } else if (valid) {
        await this.addUser();
      }
    },
    resetForm() {
      this.$refs.form.reset();
    },
    setShowDialog(isShow) {
      this.dialog.value = isShow;
      if (!isShow) {
        if (this.dialog.content === "สร้างบัญชีสำเร็จ") {
          this.resetForm();
          this.$router.push("/");
        } else if (
          this.dialog.content ===
          "ชื่อผู้ใช้นี้มีผู้ใช้งานแล้ว กรุณากรอกชื่อผู้ใช้ใหม่"
        ) {
          this.username = "";
        } else if (
          this.dialog.content === "อีเมลนี้มีผู้ใช้งานแล้ว กรุณากรอกอีเมลใหม่"
        ) {
          this.email = "";
        }
      }
    },
  },
};
</script>

<style scoped>
.title {
  font-family: "Playfair Display";
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 53px;
  padding-top: 5px;
  text-align: center;
}

.log-in-form {
  width: 90%;
}

.log-in-group-field {
  width: 70%;
  margin: auto;
}

.log-in-field {
  margin-bottom: 10px;
}

.checkbox-text {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 18px;
}

.v-text-field {
  height: 40px;
}

.btn {
  height: 40px;
  margin-top: 0px;
}
</style>
