<template>
  <!-- banner -->
  <v-card rounded="0" elevation="0">
    <v-img
      :src="require('../assets/banner.jpg')"
      aspect-ratio="2.75"
      cover
      width="100%"
    >
      <v-row class="mt-20">
        <v-col cols="5" offset="1">
          <h1>Physical Center-less Lost and Found System</h1>
          <p>
            ระบบที่จะช่วยคุณตามหาสิ่งของที่ทำหายไปได้กว้างไกลมากขึ้นและรวดเร็วขึ้น
            เนื่องจากศูนย์รวมของหายไม่ได้รวมอยู่ที่เดียว
            ผู้ที่พบเจอของหายของคุณก็ไม่ต้องเสียเวลา
            เดินทางนำสิ่งของมาทำเรื่องฝากหาเจ้าของที่ศูนย์
            เเต่สามารถเก็บไว้กับตัวและประกาศหา เจ้าของได้ด้วยตัวเอง
            คุณอาจเจอสิ่งของของคุณอยู่ในใบประกาศกำลังรอให้คุณไปรับคืน
            ในเร็ววันก็เป็นได้
          </p>
        </v-col>
      </v-row>
    </v-img>
  </v-card>
  <v-container>
    <v-row>
      <!-- feature system -->
      <v-col cols="12">
        <h2>“ ฟังก์ชันการใช้งาน ”</h2>
      </v-col>

      <v-col cols="12" class="d-flex justify-space-evenly">
        <v-card
          v-for="feature in featuresList"
          :key="feature"
          class="feature-card bg-lightGreen d-flex flex-column justify-center align-center"
        >
          <v-icon :size="80">{{ feature.icon }}</v-icon>
          <p>{{ feature.title }}</p>
        </v-card>
      </v-col>

      <!-- item type  -->
      <v-col cols="12">
        <h2>“ ประเภทสิ่งของ ”</h2>
      </v-col>

      <v-col cols="4" v-for="i in 16" :key="i">
        <v-avatar size="120">
          <v-img :src="require('../assets/cosmetics.jpg')" cover></v-img>
        </v-avatar>
        <v-card rounded="pill" class="bg-lightBrown py-2">
          <h3 class="text-center">เครื่องสำอาง</h3>
        </v-card>
      </v-col>

      <!-- process  -->
      <v-col cols="12">
        <h2>“ วิธีใช้งานเบื้องต้น ”</h2>
      </v-col>

      <v-col cols="12" class="d-flex justify-space-evenly">
        <v-card
          v-for="(process, index) in processesList"
          :key="index"
          class="process-card d-flex flex-column justify-space-around align-center pa-8"
          :class="process.color"
        >
          <v-avatar size="x-large" class="bg-whiteCream number">{{
            index + 1
          }}</v-avatar>
          <p>{{ process.text }}</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- footer -->
  <v-footer class="bg-mattBlue mt-10" style="height: 100px">
    <p>about us</p>
  </v-footer>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      featuresList: [
        { icon: "mdi-file-search-outline", title: "ค้นหาประกาศ" },
        { icon: "mdi-file-plus-outline", title: "เพิ่มใบประกาศ" },
        { icon: "mdi-forum-outline", title: "แชท" },
        { icon: "mdi-map-marker-radius", title: "นัดหมายสถานที่" },
        {
          icon: "mdi-package-variant-closed",
          title: "ยืนยันการรับของ/ส่งของ",
        },
      ],
      processesList: [
        {
          text: "เข้าสู่ระบบ เพื่อสามารถค้นหารายการ ของหายที่ถูกประกาศ นอกเหนือจากนี้ สามารถระบุรายละเอียดพื่อเจาะจงการค้นหาได้",
          color: "bg-mattBlue",
        },
        {
          text: "สร้างใบประกาศเพื่อประกาศลงหน้าเว็บ หากต้องการตามหาของหาย หรือ ประกาศพบเจอของหายแล้วรอการ ติดต่อมารับคืน",
          color: "bg-blueGreen",
        },
        {
          text: "เมื่อเจอใบประกาศที่ตรงกับความต้องการ สามารถกดปุ่มแชทเพื่อเริ่มการ สนทนาเรื่องการ รับ/ส่งมอบ สิ่งของ",
          color: "bg-lightGreen",
        },
      ],
    };
  },
};
</script>

<style scoped>
h1 {
  font-family: "Playfair Display";
  font-style: normal;
  font-weight: 500;
  font-size: 64px;
  line-height: 85px;
}
p {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
}
h2 {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 51px;
  text-align: center;
}
h3 {
  font-family: "Noto Serif Thai";
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 38px;
}
.feature-card {
  width: 210px;
  height: 210px;
  border-radius: 20px;
  box-shadow: 0px 8px 16px 5px rgba(0, 0, 0, 0.25);
}
.process-card {
  width: 350px;
  height: 300px;
  border-radius: 20px;
  box-shadow: 0px 8px 16px 5px rgba(0, 0, 0, 0.25);
}

.mdi-file-search-outline,
.mdi-file-plus-outline,
.mdi-forum-outline,
.mdi-map-marker-radius,
.mdi-package-variant-closed {
  background: linear-gradient(180deg, #358787 29.69%, #484848 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.number {
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 29px;
}
</style>
