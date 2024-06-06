<script setup>
import MagazineCover from "@/components/magazine/MagazineCover.vue";
import { ref } from "vue";
import axios from "axios";

const { VITE_RESTAPI_SERVICE_URL } = import.meta.env;

const instance = axios.create({
  baseURL: VITE_RESTAPI_SERVICE_URL, // 서버 주소
  timeout: 1000000, // 타임아웃 설정
});
const HotMagazine = ref([]);

const getAllData = () => {
  instance.get("/magazine/view/hot").then((res) => {
    HotMagazine.value = res.data;
    console.log("HotMagazine 불러오기 성공!");
    console.log(HotMagazine.value);
  });
};

getAllData();
</script>

<template>
  <div class="px-10 my-1 flex justify-center bg-blue-100">
    <div class="magazine-section py-10">
      <div class="pb-2">
        <div class="text-3xl pb-2 poetsen-one-regular">Trending Magazine</div>
        <div class="nanum-gothic-semibold pl-2">요즘 뜨는 여행 매거진</div>
        <!-- <img class="w-24 px-2" src="/src/assets/img/arrow2_flip.png" alt="" /> -->
      </div>
      <hr />
      <div class="flex space-x-4">
        <MagazineCover v-for="magazine in HotMagazine" :key="magazine.magazine_id" :magazine="magazine" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
