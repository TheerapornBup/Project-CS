<template>
  <CardContent>
    <template v-slot:content-left>
      <label class="title">REGISTER</label>
      <v-form class="log-in-form" ref="form">
        <div class="log-in-group-field">
          <div class="log-in-field">
            <label class="label-text">ชื่อ</label>
            <v-text-field
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model.trim="firstName"
              :rules="nameRules"
            />
          </div>
          <div class="log-in-field">
            <label class="label-text">นามสกุล</label>
            <v-text-field
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model.trim="lastName"
              :rules="nameRules"
            />
          </div>
          <div class="log-in-field">
            <label class="label-text">อีเมล</label>
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

        <v-divider thickness="3" color="whiteCream"></v-divider>

        <div class="log-in-group-field">
          <div class="log-in-field">
            <label class="label-text">ชื่อผู้ใช้</label>
            <v-text-field
              bg-color="lightWhite"
              density="compact"
              variant="solo"
              v-model.trim="username"
              :rules="usernameRules"
            />
          </div>
          <div class="log-in-field">
            <label class="label-text">รหัสผ่าน</label>
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
          <div class="log-in-field">
            <label class="label-text">ยืนยันรหัสผ่าน</label>
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

        <div class="log-in-field">
          <v-checkbox
            class="checkbox-text"
            v-model="isAgree"
            :label="`ฉันได้อ่าน และ อนุมัติ ข้อกำหนดในการให้บริการและนโยบายความเป็นส่วนตัวแล้ว`"
            density="compact"
            :rules="checkboxRules"
          ></v-checkbox>
        </div>
        <div class="log-in-field log-in-group-field">
          <v-btn
            class="bg-lightGreen text-black btn"
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
</template>

<script>
import CardContent from "./CardContent.vue";

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
      alert("สร้างบัญชีสำเร็จ");
      this.resetForm();
      this.$router.push("/");
    },

    async validateForm() {
      const { valid } = await this.$refs.form.validate();

      const isExistUsername = await isExistUsernameFirebase(this.username);
      const isExistEmail = await isExistEmailFirebase(this.email);

      if (isExistUsername) {
        alert("ชื่อผู้ใช้นี้มีผู้ใช้งานแล้ว กรุณากรอกชื่อผู้ใช้ใหม่");
        this.username = "";
      } else if (isExistEmail) {
        alert("อีเมลนี้มีผู้ใช้งานแล้ว กรุณากรอกอีเมลใหม่");
        this.email = "";
      } else if (valid) {
        await this.addUser();
      }
    },
    resetForm() {
      this.$refs.form.reset();
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

.label-text {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  color: #f1f1f1;
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
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
}
</style>
