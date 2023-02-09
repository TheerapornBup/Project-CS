<template>
  <CardContent>
    <template v-slot:content-right
      ><label class="title">LOG IN</label>
      <v-form class="log-in-form" ref="form">
        <div class="log-in-field">
          <label class="label-text">ชื่อผู้ใช้/อีเมล</label>
          <v-text-field
            prepend-inner-icon="mdi-account"
            rounded
            filled
            dense
            v-model="username"
            :rules="usernameRules"
          />
        </div>
        <div class="log-in-field">
          <label class="label-text">รหัสผ่าน</label>
          <v-text-field
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            rounded
            filled
            dense
            v-model="password"
            :rules="passwordRules"
            @click:append-inner="toggleShowPassword"
          />
        </div>
        <div class="log-in-field">
          <v-btn
            class="bg-lightGreen text-black btn"
            rounded
            block
            @click.prevent="validateForm"
          >
            เข้าสู่ระบบ
          </v-btn>
        </div>
        <div class="log-in-field">
          <v-btn
            to="/create-account"
            class="bg-blueGreen text-whiteCream btn"
            rounded
            block
          >
            สร้างบัญชี
          </v-btn>
        </div>
      </v-form></template
    >
  </CardContent>
</template>

<script>
import CardContent from "./CardContent.vue";
import { isMatchUserFirebase } from "../services/firebases/users";
import { encryptData } from "../services/encrypt";
export default {
  name: "LogIn",
  components: {
    CardContent,
  },
  data() {
    return {
      username: "",
      password: "",
      userId: null,
      showPassword: false,

      usernameRules: [(v) => !!v || "กรุณากรอกชื่อผู้ใช้หรืออีเมล"],
      passwordRules: [
        (v) => !!v || "กรุณากรอกรหัสผ่าน",
        (v) =>
          (v && v.length >= 6) || "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
      ],
    };
  },
  methods: {
    logIn() {
      this.$router.push(`/edit-account/${this.userId}`);
      this.resetForm();
    },
    async validateForm() {
      const { valid } = await this.$refs.form.validate();

      const encryptPassword = encryptData(this.password);

      this.userId = await isMatchUserFirebase(this.username, encryptPassword);

      if (valid && this.userId !== null) {
        this.logIn();
      } else {
        alert("ชื่อผู้ใช้/อีเมล หรือรหัสผ่าน ไม่ถูกต้อง");
        this.password = "";
      }
    },
    resetForm() {
      this.$refs.form.reset();
      this.accountId = null;
    },

    toggleShowPassword() {
      this.showPassword = !this.showPassword;
      // const encryptPassword1 = encryptData("tom1234");
      // const encryptPassword2 = encryptData("tom1234");
      // const encryptPassword3 = encryptData("tom1234");
      // console.log("encryptPassword1: ", encryptPassword1);
      // console.log("encryptPassword2: ", encryptPassword2);
      // console.log("encryptPassword3: ", encryptPassword3);
    },
  },
};
</script>

<style scopes>
.title {
  font-family: "Playfair Display";
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 53px;
  padding-top: 100px;
  text-align: center;
}

.log-in-form {
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
}

input {
  border-radius: 40px !important;
  background-color: #f1f1f1 !important;
}

.btn {
  height: 45px;
  margin-top: 20px;
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
}
</style>
