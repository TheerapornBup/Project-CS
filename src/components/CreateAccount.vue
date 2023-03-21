<template>
  <v-form ref="form">
    <v-row class="pt-5">
      <v-col cols="3"></v-col>
      <v-col cols="6">
        <!--cardbox-->
        <v-card class="card-register">
          <v-card-text>
            <v-row class="card-head">
              <v-col cols="4"></v-col>
              <v-col cols="4" style="text-align: center">
                <!-- register title -->
                <label class="title-regist add-on-title">REGISTER</label>
              </v-col>
              <v-col cols="4"></v-col>
            </v-row>

            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="5" class="pt-15">
                <!-- first name text field -->
                <label class="h4-th">ชื่อ</label>
                <v-text-field
                  bg-color="lightWhite"
                  density="compact"
                  variant="solo"
                  v-model.trim="firstName"
                  :rules="nameRules"
                  autofocus="true"
                />
              </v-col>
              <v-col cols="5" class="pt-15">
                <!-- last name text field -->
                <label class="h4-th">นามสกุล</label>
                <v-text-field
                  bg-color="lightWhite"
                  density="compact"
                  variant="solo"
                  v-model.trim="lastName"
                  :rules="lastNameRules"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="5">
                <!-- email text field -->

                <label class="h4-th">อีเมล</label>
                <v-text-field
                  type="email"
                  bg-color="lightWhite"
                  density="compact"
                  variant="solo"
                  v-model.trim="email"
                  :rules="emailRules"
                />
              </v-col>
              <v-col cols="5">
                <!-- username text field -->
                <label class="h4-th">ชื่อผู้ใช้</label>
                <v-text-field
                  bg-color="lightWhite"
                  density="compact"
                  variant="solo"
                  v-model.trim="username"
                  :rules="usernameRules"
                />
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>

            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="5">
                <!-- password text field -->
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
              </v-col>
              <v-col cols="5">
                <!-- confirm password text field -->
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
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>

            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10" class="">
                <!-- policy checkbox -->
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
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4"></v-col>
              <v-col cols="4" class="pt-5">
                <!-- create account button -->
                <v-btn
                  class="bg-lightGreen text-black btn-register h4-th"
                  rounded
                  block
                  @click.prevent="validateForm"
                >
                  สร้างบัญชี
                </v-btn>
              </v-col>
              <v-col cols="4"></v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>
  </v-form>
  <CustomDialog
    :value="dialog.value"
    :type="dialog.type"
    :content="dialog.content"
    @onChangeDialog="setShowDialog"
  />
</template>

<script>
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
      lastNameRules: [(v) => !!v || "กรุณากรอกนามสกุล"],
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

<style>
.v-field {
  border-radius: 40px !important;
}

.title-regist {
  font-family: "Playfair Display";
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 53px;
  padding-top: 5px;
  text-align: center;
}

.add-on-title {
  top: 50px;
  background-color: #eae7e6;
  position: relative;
  padding: 1px 16px 5px;
  border-radius: 50px;
}

.card-register {
  background: #eae7e6;
  box-shadow: 0px 8px 16px 8px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  height: auto;
}

.card-head {
  background-color: #358787;
  margin: -20px;
  height: 95px;
}

/*.log-in-form {
  width: 90%;
}

.log-in-group-field {
  width: 70%;
  margin: auto;
}

.log-in-field {
  margin-bottom: 10px;
}*/

.checkbox-text {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 18px;
}

/*.v-text-field {
  height: 40px;
}*/

.btn-register {
  height: 40px;
  margin-top: 0px;
}
</style>
