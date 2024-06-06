<script setup>
import { ref, onMounted } from "vue";
import HeaderNav from "@/components/common/HeaderNav.vue";
import MagazineCover from "@/components/magazine/MagazineCover.vue";
import { useRouter } from "vue-router";
import axios from "axios";

const { VITE_RESTAPI_SERVICE_URL } = import.meta.env;
const router = useRouter();

const instance = axios.create({
  baseURL: VITE_RESTAPI_SERVICE_URL, // 서버 주소
  timeout: 1000000, // 타임아웃 설정
});

const NewMagazines = ref([]);
const HotMagazine = ref([]);
const WholeMagazine = ref([]);

const getAllData = () => {
  // instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
  instance.get("/magazine/view/all").then((res) => {
    WholeMagazine.value = res.data;
    console.log("WholeMagazine 불러오기 성공!");
    console.log(WholeMagazine.value);
  });
  instance.get("/magazine/view/hot").then((res) => {
    HotMagazine.value = res.data;
    console.log("HotMagazine 불러오기 성공!");
    console.log(HotMagazine.value);
  });
  instance.get("/magazine/view/new").then((res) => {
    NewMagazines.value = res.data;
    console.log("NewMagazines 불러오기 성공!");
    console.log(NewMagazines.value);
  });
};

getAllData();
</script>

<template>
  <div class="wrapper mx-72 mt-32">
    <nav>
      <HeaderNav />
    </nav>
    <div class="relative">
      <div class="h-48 my-10 overflow-hidden z-10">
        <img class="object-cover w-full h-full" src="/src/assets/img/jeju_mag_img/jeju_magazine_2.jpeg" alt="" />
      </div>
      <div class="absolute z-20 top-1/3 text-white w-full text-5xl text-center bagel-fat-one-regular">이번 휴가는 제주도 어때?</div>
    </div>

    <div class="hot-magazine">
      <p class="text-2xl">What's Hot?</p>
      <img class="w-24 m-2" src="/src/assets/img/arrow2_flip.png" alt="" />
      <div class="flex">
        <MagazineCover v-for="magazine in HotMagazine" :key="magazine.magazine_id" :magazine="magazine" />
      </div>
    </div>
    <div class="new-magazine">
      <p class="text-2xl">Just Arrived!</p>
      <img class="w-24 m-2" src="/src/assets/img/arrow2_flip.png" alt="" />
      <div class="flex">
        <MagazineCover class="" v-for="magazine in NewMagazines" :key="magazine.magazine_id" :magazine="magazine" />
      </div>
    </div>
    <div class="trend-magazine">
      <p class="text-2xl">All Magazines</p>
      <img class="w-24 m-2" src="/src/assets/img/arrow2_flip.png" alt="" />
      <div class="flex">
        <MagazineCover v-for="magazine in WholeMagazine" :key="magazine.magazine_id" :magazine="magazine" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
