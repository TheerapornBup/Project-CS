<template>
  <CardContent>
    <template v-slot:content-right
      ><label class="title">LOG IN</label>
      <v-form class="log-in-form" ref="form">
        <div class="log-in-field">
          <label class="h4-th">ชื่อผู้ใช้/อีเมล</label>
          <v-text-field
            prepend-inner-icon="mdi-account"
            bg-color="lightWhite"
            density="compact"
            variant="solo"
            v-model="username"
            :rules="usernameRules"
          />
        </div>
        <div class="log-in-field">
          <label class="h4-th">รหัสผ่าน</label>
          <v-text-field
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append-inner="toggleShowPassword"
            bg-color="lightWhite"
            density="compact"
            variant="solo"
            v-model="password"
            :rules="passwordRules"
          />
        </div>
        <div class="log-in-field">
          <v-btn
            class="bg-lightGreen text-black btn-login h4-th"
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
            class="bg-blueGreen text-whiteCream btn-login h4-th"
            rounded
            block
          >
            สร้างบัญชี
          </v-btn>
        </div>
      </v-form></template
    > </CardContent
  ><CustomDialog
    :value="dialog.value"
    :type="dialog.type"
    :content="dialog.content"
    @onChangeDialog="setShowDialog"
  />
</template>

<script>
import CardContent from "./CardContent.vue";
import { isMatchUserFirebase } from "../services/firebases/users";
import { encryptData } from "../services/encrypt";
import CustomDialog from "./CustomDialog.vue";
export default {
  name: "LogIn",
  components: {
    CardContent,
    CustomDialog,
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
          (v && v.length >= 8) || "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
      ],
      dialog: {
        value: false,
        type: "warning",
        content: "",
      },
    };
  },
  methods: {
    logIn() {
      this.$router.push("/search");
      this.$store.dispatch("userId/logIn", this.userId);
      this.resetForm();
    },
    async validateForm() {
      const { valid } = await this.$refs.form.validate();

      const encryptPassword = encryptData(this.password);

      this.userId = await isMatchUserFirebase(this.username, encryptPassword);

      if (valid && this.userId !== null) {
        this.logIn();
      } else {
        this.dialog = {
          value: true,
          type: "warning",
          content: "ชื่อผู้ใช้/อีเมล หรือรหัสผ่าน ไม่ถูกต้อง",
        };
        //alert("ชื่อผู้ใช้/อีเมล หรือรหัสผ่าน ไม่ถูกต้อง");
        //this.password = "";
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
    setShowDialog(isShow) {
      this.dialog.value = isShow;
      if (!isShow) {
        if (
          this.dialog.content === "ชื่อผู้ใช้/อีเมล หรือรหัสผ่าน ไม่ถูกต้อง"
        ) {
          this.password = "";
        }
      }
    },
  },
};
</script>

<style>
.dp__input {
  border-radius: 40px !important;
  height: 45px !important;
}

.dp__input_icon {
  left: 180px;
  top: 52%;
}

.dp__clear_icon {
  top: 52%;
  right: 60px;
}
.v-field {
  border-radius: 40px;
}
.v-text-field {
  color: black;
}
.v-messages {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
}
.v-input {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
}
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

.btn-login {
  height: 45px;
  margin-top: 20px;
}
</style>
