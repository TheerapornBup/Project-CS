<template>
  <v-container>
    <div class="card">
      <v-row>
        <v-col cols="1"> </v-col>
        <v-col cols="3" class="mt-3">
          <v-text class="topic">ประเภทของใบประกาศ</v-text>
        </v-col>
        <v-col cols="4">
          <v-checkbox
            label="ประกาศตามหาของหาย"
            @click="setSelectedMenu('ประกาศตามหาของหาย')"
          ></v-checkbox>
        </v-col>
        <v-col cols="4">
          <v-checkbox
            label="ประกาศพบเจอของหาย"
            @click="setSelectedMenu('ประกาศพบเจอของหาย')"
          ></v-checkbox>
        </v-col>
      </v-row>

      <div class="pt-5">
        <v-card-text>
          <div id="app" class="container">
            <div class="row">
              <div class="">
                <form>
                  <div class="form-group">
                    <v-row>
                      <v-col cols="4"></v-col>
                      <v-col cols="4" style="text-align: center">
                        <div class="border" style="width: 210px; height: 210px">
                          <v-row>
                            <v-col cols="12">
                              <template v-if="preview">
                                <img
                                  :src="preview"
                                  style="width: 200px; height: 200px"
                                />
                              </template>
                            </v-col>
                          </v-row>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          @change="previewImage"
                          class="form-control-file"
                          id="my-file"
                        />
                      </v-col>
                      <v-col cols="4"></v-col>
                    </v-row>
                  </div>
                </form>
              </div>

              <div class="w-100"></div>
            </div>
          </div>

          <v-form v-model="valid">
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
                  <v-text class="topic">สถานที่ที่เกี่ยวข้อง</v-text>
                  <v-text-field
                    class="mt-3"
                    append-inner-icon="mdi-map-marker"
                    @click:append-inner="mapCard = !mapCard"
                    variant="solo"
                    v-model="locationAddress"
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
                  <v-text class="topic">รายละเอียดของหาย</v-text>
                  <v-textarea
                    class="mt-3"
                    variant="solo"
                    v-model="detail"
                  ></v-textarea>
                </v-col>
                <v-col cols="4">
                  <v-text class="topic">วันที่ทำของหาย หรือพบเจอของหาย</v-text>
                  <VueDatePicker
                    v-model="dateTime"
                    class="mt-3"
                    variant="solo"
                  ></VueDatePicker>
                  <v-col cols="1"></v-col>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4"></v-col>
                <v-col cols="2">
                  <v-btn class="save-btn mt-2" @click="addNotice()"
                    >ลงประกาศ</v-btn
                  >
                </v-col>
                <v-col cols="2">
                  <v-btn class="discard-btn mt-2">ยกเลิก</v-btn>
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
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import CustomDialog from "./CustomDialog.vue";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { uploadBytes } from "firebase/storage";

import axios from "axios";
import {
  createNoticeFirebase,
  updateNoticeFirebase,
} from "../services/firebases/notices";

export default {
  name: "NoticeAdd",
  components: {
    VueDatePicker,
    CustomDialog,
  },
  data() {
    return {
      type: "ประกาศตามหาของหาย",

      mapCard: false,
      locationLat: 0,
      locationLong: 0,
      locationAddress: "",
      error: "",

      preview: null,
      image: null,
      preview_list: [],
      image_list: [],

      createDateTime: new Date(),
      dateTime: null,
      detail: "",
      itemType: "",
      pic: "",
      pathpic: "",

      defautPic: {
        บัตรสำคัญประจำตัว: "credit-card-dafault.jpg",
        เงิน: "money-dafault.jpg",
        กระเป๋า: "bag-default.jpg",
        อุปกรณ์อิเล็กทรอนิกส์: "electronic-dafault.jpg",
        เครื่องประดับ: "accessories-dafault.jpg",
        เครื่องสำอาง: "cosmetics-dafault.jpg",
        เอกสาร: "document-dafault.jpg",
        เสื้อผ้า: "clothes-dafault.jpg",
        แว่นตา: "glasses-dafault.jpg",
        กุญแจ: "keys-dafault.jpg",
        อุปกรณ์กีฬา: "sports-dafault.jpg",
        อุปกรณ์ถ่ายภาพ: "camera-dafault.jpg",
        เครื่องเขียน: "stationeries-dafault.jpg",
        หนังสือ: "book-dafault.jpg",
        อุปกรณ์ทางการแพทย์: "medical-default.jpg",
        รองเท้า: "shoes-dafault.jpg",
      },

      dialog: {
        value: false,
        type: "success",
        content: "",
      },
    };
  },
  created() {
    this.getCurrentLocation();
  },
  computed: {
    getUserId() {
      return this.$store.getters["userId/getUserId"];
    },
  },
  methods: {
    setShowDialog(isShow) {
      this.dialog.value = isShow;
      if (!isShow) {
        if (this.dialog.content === "สร้างประกาศสำเร็จ") {
          this.$router.push("/search");
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

    // ADD 'Notice' in to Friebase
    async addNotice() {
      const notice = {
        type: this.type,
        detail: this.detail,
        itemType: this.itemType,
        dateTime: this.dateTime,
        createDateTime: this.createDateTime,
        status: false,
        userId: this.getUserId,
        lat: this.locationLat,
        long: this.locationLong,
      };
      console.log(notice);
      const noticeId = await createNoticeFirebase(notice);
      if (this.image == null) {
        this.pathpic = this.defautPic[this.itemType];
      } else {
        this.pathpic = noticeId + ".jpg";
        await this.uploadPic();
      }

      const picture = await this.downloadPic();
      await updateNoticeFirebase(noticeId, { pic: picture });
      this.dialog = {
        value: true,
        type: "success",
        content: "สร้างประกาศสำเร็จ",
      };
    },

    // About 'Location'
    setLocationPosition(lat, lng) {
      (this.locationLat = lat), (this.locationLong = lng);
    },
    setLocationAddress(address) {
      this.locationAddress = address;
    },
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.getAddressFrom(
              position.coords.latitude,
              position.coords.longitude
            );
            this.setLocationPosition(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          (error) => {
            console.log(error.message);
          }
        );
      } else {
        console.log("your browser does not support geolocation API");
      }
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
    },
  },
};
</script>

<style>
.v-field {
  border-radius: 40px;
}

.card {
  width: 912px;
  height: auto;
  background: #358787;
  margin: auto;
  box-shadow: 0px 8px 16px 8px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
}

.topic {
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
</style>
