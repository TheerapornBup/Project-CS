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
                    <template
                      v-if="
                        type === 'ประกาศพบเจอของหาย' ||
                        (type === 'ประกาศตามหาของหาย' &&
                          isDefaultPic &&
                          preview === null)
                      "
                    >
                      <img
                        :src="require(`../assets/${defaultImage}`)"
                        style="height: 200px"
                      />
                    </template>
                    <template
                      v-else-if="
                        type === 'ประกาศตามหาของหาย' &&
                        (pic !== null || preview !== null)
                      "
                    >
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
                      :style="
                        type === 'ประกาศพบเจอของหาย' ? 'display: none' : ''
                      "
                    />
                  </div>
                </form>
              </div>

              <div class="w-100"></div>
            </div>
          </div>

          <!--cardbox---->
          <v-form ref="form" class="pt-5">
            <v-container class="add-notice-box">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="6">
                  <v-text class="topic">ประเภทของหาย</v-text>
                  <v-select
                    class="mt-3"
                    style="width: auto"
                    variant="solo"
                    density="compact"
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
                      'อื่นๆ'
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
                    density="compact"
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
                    density="compact"
                    v-model="detail"
                    :rules="detailRules"
                  ></v-textarea>
                </v-col>
                <v-col cols="4">
                  <v-row>
                    <v-col cols="12">
                      <v-text class="topic">{{
                        type === "ประกาศตามหาของหาย"
                          ? "วันเวลาที่คาดว่าของหาย"
                          : "วันเวลาที่พบของหาย"
                      }}</v-text>
                      <VueDatePicker
                        v-model="dateTime"
                        class="mt-3"
                        variant="solo"
                        :format="'dd/MM/yyyy'"
                        :max-date="new Date()"
                        :clearable="false"
                        style="width: 230px"
                      ></VueDatePicker>
                    </v-col>
                    <v-col cols="12">
                      <v-checkbox
                        class="mt-3 ml-2"
                        v-model="reward"
                        density="compact"
                        color="mattBlue"
                      >
                        <template v-slot:label>
                          <div class="pl-2">
                            <p>
                              ต้องการ{{
                                type === "ประกาศตามหาของหาย" ? "ให้" : "รับ"
                              }}ค่าตอบแทนตาม
                            </p>
                            <router-link to="/reward-law" target="_blank">
                              กฎหมายการรับสินน้ำใจ
                            </router-link>
                          </div>
                        </template>
                      </v-checkbox>
                    </v-col>
                  </v-row>

                  <v-col cols="1"></v-col>
                </v-col>
              </v-row>
            </v-container>
            <v-row>
              <v-col cols="4"></v-col>
              <v-col cols="2">
                <v-btn
                  class="save-btn mt-4 h4-th"
                  @click.prevent="updateNotice()"
                  >บันทึก</v-btn
                >
              </v-col>
              <v-col cols="2">
                <v-btn
                  class="discard-btn mt-4 h4-th text-whiteCream"
                  @click="cancelButton()"
                  >ยกเลิก</v-btn
                >
              </v-col>
              <v-col cols="4"></v-col>
            </v-row>
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
      reward: false,
      pic: null,
      noticeId: "",
      defaultImage: null,
      defautPic: {
        บัตรสำคัญประจำตัว: "credit-card-default.jpg",
        เงิน: "money-default.jpg",
        กระเป๋า: "bag-default.jpg",
        อุปกรณ์อิเล็กทรอนิกส์: "electronic-default.jpg",
        เครื่องประดับ: "accessories-default.jpg",
        เครื่องสำอาง: "cosmetics-default.jpg",
        เอกสาร: "document-default.jpg",
        เสื้อผ้า: "clothes-default.jpg",
        แว่นตา: "glasses-default.jpg",
        กุญแจ: "keys-default.jpg",
        อุปกรณ์กีฬา: "sports-default.jpg",
        อุปกรณ์ถ่ายภาพ: "camera-default.jpg",
        เครื่องเขียน: "stationeries-default.jpg",
        หนังสือ: "book-default.jpg",
        อุปกรณ์ทางการแพทย์: "medical-default.jpg",
        รองเท้า: "shoes-default.jpg",
        อื่นๆ:"other-default.jpg"
      },

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
      detailRules: [(v) => !!v || "กรุณากรอกรายละเอียด"],
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

    itemType() {
      if (this.itemType !== null) {
        this.defaultImage = this.defautPic[this.itemType];
      } else {
        this.defaultImage = null;
      }
    },
  },
  computed: {
    getUserId() {
      return this.$store.getters["userId/getUserId"];
    },
    isDefaultPic() {
      return this.pic !== null ? this.pic.includes("-default.jpg") : false;
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
      this.reward = notice.reward;
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

        if (
          this.type === "ประกาศพบเจอของหาย" ||
          (this.type === "ประกาศตามหาของหาย" &&
            this.isDefaultPic &&
            this.image === null)
        ) {
          this.pathpic = this.defaultImage;
          picture = await this.downloadPic();
        } else if (this.image !== null && this.type === "ประกาศตามหาของหาย") {
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
          reward: this.reward,
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
            `&key=${process.env.VUE_APP_MAP_KEY}`
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
      this.defaultImage = null;
      this.reward = false;
    },
  },
};
</script>

<style></style>
