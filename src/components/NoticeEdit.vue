<template>
  <v-container>
    <div class="add-notice-card rounded-xl h4-th">
      <v-row no-gutters>
        <v-col cols="6" class="pt-0"
          ><v-list-item
            :class="
              type === 'ประกาศตามหาของหาย' ? 'bg-blueGreen' : 'bg-whiteCream'
            "
            class="text-center rounded-ts-xl h4-th py-4"
            title="ประกาศตามหาของหาย"
            @click="setSelectedMenu('ประกาศตามหาของหาย')"
          ></v-list-item
        ></v-col>

        <v-col cols="6" class="pt-0"
          ><v-list-item
            :class="
              type === 'ประกาศพบเจอของหาย' ? 'bg-blueGreen' : 'bg-whiteCream'
            "
            class="text-center rounded-te-xl h4-th py-4"
            title="ประกาศพบเจอของหาย"
            @click="setSelectedMenu('ประกาศพบเจอของหาย')"
          ></v-list-item
        ></v-col>
      </v-row>

      <div class="pt-5">
        <v-card-text>
          <div id="app" class="container">
            <div class="row">
              <div class="">
                <form>
                  <div
                    class="form-group d-flex flex-column justify-center align-center"
                  >
                    <template v-if="pic !== null || preview !== null">
                      <img
                        :src="preview !== null ? preview : pic"
                        style="height: 200px"
                      />
                    </template>
                    <div
                      v-else
                      class="border"
                      style="width: 30%; height: 200px"
                    ></div>
                    <input
                      type="file"
                      accept="image/*"
                      @change="previewImage"
                      class="form-control-file h4-th mt-2"
                      id="my-file"
                    />
                  </div>
                </form>
              </div>

              <div class="w-100"></div>
            </div>
          </div>

          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="6">
                  <v-text class="topic">ประเภทของหาย</v-text>
                  <v-select
                    class="mt-3"
                    style="width: auto"
                    variant="solo"
                    required
                    v-model="itemType"
                    :rules="itemTypeRules"
                    :items="[
                      'บัตรสำคัญประจำตัว',
                      'เงิน',
                      'กระเป๋า',
                      'อุปกรณ์อิเล็กทรอนิกส์',
                      'เครื่องประดับ',
                      'เครื่องสำอาง',
                      'เอกสาร',
                      'เสื้อผ้า',
                      'แว่นตา',
                      'กุญแจ',
                      'อุปกรณ์กีฬา',
                      'อุปกรณ์ถ่ายภาพ',
                      'เครื่องเขียน',
                      'หนังสือ',
                      'อุปกรณ์ทางการแพทย์',
                      'รองเท้า',
                    ]"
                  ></v-select>
                </v-col>

                <v-col cols="5" md="4">
                  <v-text class="topic">{{
                    type === "ประกาศตามหาของหาย"
                      ? "สถานที่ทำของหาย"
                      : "สถานที่ที่พบของหาย"
                  }}</v-text>
                  <v-text-field
                    class="mt-3"
                    append-inner-icon="mdi-map-marker-radius"
                    @click:append-inner="mapCard = !mapCard"
                    variant="solo"
                    v-model="locationAddress"
                    :rules="locationRules"
                  ></v-text-field
                ></v-col>
                <div v-show="mapCard">
                  <v-card
                    rounded="lg"
                    class="bg-grey card-map"
                    style="position: absolute"
                  >
                    <GMapMap
                      :center="{
                        lat: locationLat,
                        lng: locationLong,
                      }"
                      :zoom="15"
                      style="width: 100%; height: 220px"
                      @click="changeLocation($event)"
                    >
                      <GMapMarker
                        :position="{
                          lat: locationLat,
                          lng: locationLong,
                        }"
                      />
                    </GMapMap>
                  </v-card>
                </div>
              </v-row>

              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="6">
                  <v-text class="topic">{{
                    type === "ประกาศตามหาของหาย"
                      ? "รายละเอียดของหายที่ตามหา"
                      : "รายละเอียดของหายที่พบ"
                  }}</v-text>
                  <v-textarea
                    class="mt-3"
                    variant="solo"
                    v-model="detail"
                  ></v-textarea>
                </v-col>
                <v-col cols="4">
                  <v-text class="topic">{{
                    type === "ประกาศตามหาของหาย"
                      ? "วันเวลาที่คาดว่าของหาย"
                      : "วันเวลาที่พบของหาย"
                  }}</v-text>
                  <VueDatePicker
                    v-model="dateTime"
                    class="mt-3"
                    variant="solo"
                    :max-date="new Date()"
                    :clearable="false"
                  ></VueDatePicker>
                  <v-col cols="1"></v-col>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4"></v-col>
                <v-col cols="2">
                  <v-btn
                    class="save-btn mt-2 h4-th"
                    @click.prevent="updateNotice()"
                    >บันทึก</v-btn
                  >
                </v-col>
                <v-col cols="2">
                  <v-btn
                    class="discard-btn mt-2 h4-th text-whiteCream"
                    @click="cancelButton()"
                    >ยกเลิก</v-btn
                  >
                </v-col>
                <v-col cols="4"></v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </div>
    </div>
  </v-container>
  <CustomDialog
    :value="dialog.value"
    :type="dialog.type"
    :content="dialog.content"
    @onChangeDialog="setShowDialog"
  />
</template>

<script>
import CustomDialog from "./CustomDialog.vue";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { uploadBytes } from "firebase/storage";

import axios from "axios";
import {
  getNoticeByIdFirebase,
  updateNoticeFirebase,
} from "../services/firebases/notices";

export default {
  name: "NoticeEdit",
  components: {
    CustomDialog,
  },
  data() {
    return {
      type: "ประกาศตามหาของหาย",

      mapCard: false,
      locationLat: 0,
      locationLong: 0,
      locationAddress: "",

      preview: null,
      image: null,
      preview_list: [],
      image_list: [],
      pathpic: "",

      dateTime: new Date(),
      detail: "",
      itemType: "",
      pic: null,
      noticeId: "",

      dialog: {
        value: false,
        type: "success",
        content: "",
      },

      itemTypeRules: [(v) => !!v || "กรุณาเลือกประเภทของหาย"],
      locationRules: [
        (v) =>
          (!!v && this.locationLat !== 0 && this.locationLong !== 0) ||
          "กรุณาเลือกสถานที่",
      ],
    };
  },
  created() {
    this.noticeId = this.$route.params.id;
    this.getNotice();
  },
  watch: {
    "$route.params.id"() {
      this.noticeId = this.$route.params.id;
      this.getNotice();
    },
  },
  computed: {
    getUserId() {
      return this.$store.getters["userId/getUserId"];
    },
  },
  methods: {
    async getNotice() {
      const notice = await getNoticeByIdFirebase(this.noticeId);

      this.type = notice.type;
      this.itemType = notice.itemType;
      this.detail = notice.detail;
      this.dateTime = new Date(notice.dateTime.seconds * 1000);
      this.pic = notice.pic;
      this.locationLat = notice.lat;
      this.locationLong = notice.long;
      this.locationAddress = this.getAddressFrom(
        this.locationLat,
        this.locationLong
      );
    },
    setShowDialog(isShow) {
      this.dialog.value = isShow;
      if (!isShow) {
        if (this.dialog.content === "แก้ไขประกาศสำเร็จ") {
          this.$router.push("/history");
          this.reset();
        }
      }
    },
    async downloadPic() {
      const storage = getStorage();
      const starsRef = ref(storage, this.pathpic);
      let url = null;
      url = await getDownloadURL(starsRef);
      // Get the download URL
      return url;
    },
    async uploadPic() {
      const storage = getStorage();
      const storageRef = ref(storage, this.pathpic);

      // 'file' comes from the Blob or File API
      await uploadBytes(storageRef, this.image).then(() => {
        console.log("Uploaded a blob or file!");
      });
    },

    setSelectedMenu(menu) {
      this.type = menu;
      // console.log("ประเภทประกาศ ทดลองกด >>"+menu);
    },

    cancelButton() {
      this.$router.push("/history");
      this.reset();
    },

    // UPDATE 'Notice' in to Friebase
    async updateNotice() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        let picture = this.pic;
        if (this.image !== null) {
          this.pathpic = this.noticeId + ".jpg";
          await this.uploadPic();
          picture = await this.downloadPic();
        }
        const notice = {
          type: this.type,
          detail: this.detail,
          itemType: this.itemType,
          dateTime: this.dateTime,
          lat: this.locationLat,
          long: this.locationLong,
          pic: picture,
        };
        console.log(notice);

        await updateNoticeFirebase(this.noticeId, notice);
        this.dialog = {
          value: true,
          type: "success",
          content: "แก้ไขประกาศสำเร็จ",
        };
      }
    },

    // About 'Location'
    setLocationPosition(lat, lng) {
      (this.locationLat = lat), (this.locationLong = lng);
    },
    setLocationAddress(address) {
      this.locationAddress = address;
    },
    getAddressFrom(lat, long) {
      axios
        .get(
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
            lat +
            ", " +
            long +
            "&key=AIzaSyDEJiW679Uw3p7X5xgQEamRU3agd2zWUAM"
        )
        .then((response) => {
          if (response.data.error_message) {
            console.log(response.data.error_message);
          } else {
            this.setLocationAddress(response.data.results[0].formatted_address);
            console.log(response.data.results[0].formatted_address);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    },

    //click map to change location
    changeLocation(e) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      this.setLocationPosition(lat, lng);
      this.getAddressFrom(lat, lng);
    },

    // About 'Preview Picture'
    previewImage: function (event) {
      var input = event.target;
      if (input.files) {
        var reader = new FileReader();
        reader.onload = (e) => {
          this.preview = e.target.result;
        };
        this.image = input.files[0];
        reader.readAsDataURL(input.files[0]);
        console.log("Here File : " + this.image);
      }
    },
    previewMultiImage: function (event) {
      var input = event.target;
      var count = input.files.length;
      var index = 0;
      if (input.files) {
        while (count--) {
          var reader = new FileReader();
          reader.onload = (e) => {
            this.preview_list.push(e.target.result);
          };
          this.image_list.push(input.files[index]);
          reader.readAsDataURL(input.files[index]);
          index++;
        }
      }
    },
    reset: function () {
      this.image = null;
      this.preview = null;
      this.image_list = [];
      this.preview_list = [];

      this.type = "ประกาศตามหาของหาย";
      this.mapCard = false;
      this.locationLat = 0;
      this.locationLong = 0;
      this.locationAddress = "";
      this.dateTime = new Date();
      this.itemType = "";
      this.detail = "";
      this.pic = null;
    },
  },
};
</script>

<style>
.v-field {
  border-radius: 40px;
}

.add-notice-card {
  width: 912px;
  height: auto;
  background: #358787;
  margin: auto;
  box-shadow: 0px 8px 16px 8px rgba(0, 0, 0, 0.25);
}

.topic {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  color: #eae7e6;
}

.save-btn {
  width: 210px;
  height: 40px;
  background: #a6d2cd;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 40px;
}

.discard-btn {
  width: 210px;
  height: 40px;
  box-sizing: border-box;
  border: 2px solid #292929;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 40px;
  background-color: #358787;
}

.dp__input {
  border-radius: 40px;
  height: 60px;
}

.dp__input_icon {
  left: 220px;
  top: 52%;
}

.dp__clear_icon {
  top: 52%;
  right: 60px;
}

.mx-icon-calendar,
.mx-icon-clear {
  font-size: 20px;
  margin: 1px -51px;
}

.mx-input {
  border-radius: 40px;
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
  height: 55px;
  width: 270px;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 40px;
  padding-bottom: 16px;
}

.mx-datepicker-popup {
  position: absolute;
  left: 850.263px;
  top: 300px;
}

.card-map {
  margin-top: 40px !important;
  height: 220px;
  width: 25% !important;
}
input[type="file"] {
  width: 30%;
  max-width: 30%;
  color: #444;
  background: #f1f1f1;
  border-radius: 8px;
}
input[type="file"]::file-selector-button {
  margin-right: 20px;
  border: none;
  background: #a6d2cd;
  padding: 5px 10px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  color: black;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

input[type="file"]::file-selector-button:hover {
  background: #95c3bd;
}
</style>
