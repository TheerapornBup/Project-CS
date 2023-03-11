<template>
  <!-- banner -->
  <v-card rounded="0" elevation="0">
    <v-img
      :src="require('../assets/banner.jpg')"
      aspect-ratio="2.75"
      cover
      width="100%"
    >
      <v-row style="position: relative; top: 40px; z-index: 1">
        <v-col cols="5" offset="1">
          <h1>Physical Center-less Lost and Found System</h1>
          <div class="mt-8 d-flex flex-row justify-lg-space-between">
            <div class="bg-blueGreen" style="width: 20px; height: 160px"></div>
            <p class="pa-4">
              ระบบที่จะช่วยคุณตามหาสิ่งของที่ทำหายไปได้กว้างไกลมากขึ้นและรวดเร็วขึ้น
              เนื่องจากศูนย์รวมของหายไม่ได้รวมอยู่ที่เดียว
              ผู้ที่พบเจอของหายของคุณก็ไม่ต้องเสียเวลา
              เดินทางนำสิ่งของมาทำเรื่องฝากหาเจ้าของที่ศูนย์
              เเต่สามารถเก็บไว้กับตัวและประกาศหา เจ้าของได้ด้วยตัวเอง
              คุณอาจเจอสิ่งของของคุณอยู่ในใบประกาศกำลังรอให้คุณไปรับคืน
              ในเร็ววันก็เป็นได้
            </p>
          </div>
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

      <v-col cols="4" v-for="(itemType, index) in itemTypesList" :key="index">
        <div class="mx-3 my-10">
          <v-avatar
            size="120"
            style="
              position: absolute;
              z-index: 2;
              filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
            "
          >
            <v-img :src="require(`../assets/${itemType.image}`)" cover></v-img>
          </v-avatar>
          <v-card
            rounded="pill"
            class="bg-lightBrown py-2 itemType"
            style="position: relative; z-index: 1; top: 35px; left: 30px"
          >
            <h3 class="text-center pl-16">{{ itemType.name }}</h3>
          </v-card>
          <v-card
            elevation="0"
            rounded="xl"
            class="pa-3 h4-th hide"
            style="
              position: relative;
              top: 35px;
              left: 30px;
              background-color: #d5e7e5;
              width: 80%;
              float: right;
            "
          >
            {{ itemType.details }}
          </v-card>
        </div>
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
      itemTypesList: [
        {
          image: "shoes.jpg",
          name: "รองเท้า",
          details: "รองเท้าผ้าใบ, รองเท้าส้นสูง, รองเท้าแตะ, ฯลฯ",
        },
        {
          image: "clothes.jpg",
          name: "เสื้อผ้า",
          details: "เสื้อนอก, เสื้อกันหนาว, กระโปรง, กางเกง, เสื้อยืด, ฯลฯ",
        },
        {
          image: "bags.jpg",
          name: "กระเป๋า",
          details: "กระเป๋าสะพาย, กระเป๋าถือ, กระเป๋าสตางค์, ฯลฯ",
        },
        {
          image: "glasses.png",
          name: "แว่นตา",
          details: "แว่นสายตา, แว่นกันแดด, ฯลฯ",
        },
        {
          image: "accessories.png",
          name: "เครื่องประดับ",
          details:
            "นาฬิกา, แหวน, กำไล, สร้อย, ต่างหู, เข็มกลัด, กิ๊บติดผม, เข็มขัด, ฯลฯ",
        },
        {
          image: "cosmetics.jpg",
          name: "เครื่องสำอาง",
          details: "ลิปสติก, ตลับแป้ง, รองพื้น, ที่ปัดขนตา, แปรงแต่งหน้า, ฯลฯ",
        },
        {
          image: "money.png",
          name: "เงิน",
          details: "เงินสด",
        },
        {
          image: "credit-card.png",
          name: "บัตรสำคัญประจำตัว",
          details: "บัตรประชาชน, บัตรเครดิต, บัตรเดบิต, ฯลฯ",
        },
        {
          image: "keys.jpg",
          name: "กุญแจ",
          details: "กุญแจบ้าน, กุญแจรถ, คีย์การด์, ฯลฯ",
        },
        {
          image: "books.jpg",
          name: "หนังสือ",
          details: "หนังสือเรียน, หนังสืออ่านเล่น, เล่มหนังสือทั่วไป, ฯลฯ",
        },
        {
          image: "stationeries.jpg",
          name: "เครื่องเขียน",
          details: "สมุด, ดินสอ, ยางลบ, ไม้บรรทัด, กระเป๋าดินสอ, ปากกา, ฯลฯ",
        },
        {
          image: "documents.jpg",
          name: "เอกสาร",
          details: "เอกสารปิดผนึกในซอง, ใบรับรอง, ฯลฯ",
        },
        {
          image: "electronics.png",
          name: "อุปกรณ์อิเล็กทรอนิกส์",
          details:
            "โน้ตบุ๊ค, โทรศัพท์, สมาร์ทวอช, หูฟัง/แอร์พอด, แท็ปเล็ต, ฯลฯ",
        },
        {
          image: "medical.png",
          name: "อุปกรณ์ทางการแพทย์",
          details: "ยารักษาประจำตัว, คอนแทคเลนส์, รีเทนเนอร์, ฯลฯ",
        },
        {
          image: "camera.jpg",
          name: "อุปกรณ์ถ่ายภาพ",
          details:
            "กล้องถ่ายรูป, เลนส์กล้อง, ขาตั้ง, เมมโมรี่การ์ด, ม้วนฟิล์ม, ฯลฯ",
        },
        {
          image: "sports.jpg",
          name: "อุปกรณ์กีฬา",
          details: "ลูกบอล, ไม้เทนนิส, นกหวีด, นาฬิกาจับเวลา, กระบอกน้ำ ฯลฯ",
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
.hide {
  display: none;
}

.itemType:hover + .hide {
  display: block;
}
</style>
