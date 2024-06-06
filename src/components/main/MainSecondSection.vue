<script setup>
import { ref } from "vue";
import AreaCardItem from "@/components/region/AreaCardItem.vue"
const areas = ref([
  {
    title: "가회동성당",
    addr1: "서울특별시 종로구 북촌로 57 (가회동)",
    addr2: "",
    firstimage: "http://tong.visitkorea.or.kr/cms/resource/61/2780561_image2_1.png"
  },
  {
    title: "갈산근린공원",
    addr1: "서울 양천구 신정동 162-56",
    addr2: "",
    firstimage: "http://tong.visitkorea.or.kr/cms/resource/62/2612062_image2_1.bmp"
  },
  {
    title: "가루매마을",
    addr1: "경기도 양평군 지평면 부일길 101 (지평면)",
    addr2: "",
    firstimage: "http://tong.visitkorea.or.kr/cms/resource/63/2480263_image2_1.jpg"
  },
  {
    title: "가메창(암메)",
    addr1: "제주특별자치도 제주시 한경면 청수로 13-3",
    addr2: "",
    firstimage: "http://tong.visitkorea.or.kr/cms/resource/01/1884201_image2_1.jpg"
  },
])

</script>

<template>
  <div class="recommend-contaner text-title-font noto-sans-kr-regular" style="padding: 50px 20% 70px;">
    <div class="content_title text-title-font">
      <span style="color: #5f93df;font-size: 2.5rem;" class="bagel-fat-one-regular">Seoul</span><br>
      우리 지역 핫플이 궁금해?
      <hr>
    </div>
    <div class="scroll_wrap flex flex-wrap gap-4 pt-10 md:justify-center">
      <AreaCardItem class="w-1/4 md:w-64 scroll_on" v-for="area in areas" :key="area.title" :area="area" />
    </div>
  </div>
</template>

<style scoped></style>