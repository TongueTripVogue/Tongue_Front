<script setup>
import { ref, onMounted } from "vue";
import AreaIconItem from "@/components/region/AreaIconItem.vue";
import AreaCardItem from "@/components/region/AreaCardItem.vue";
import AdCardItem from "@/components/region/AdCardItem.vue";
import axios from "axios";
import { RegionService } from "@/service/RegionService.js";
import Carousel from 'primevue/carousel';
import HeaderNav from "@/components/common/HeaderNav.vue"

const { VITE_PUBLIC_DATA_BASEURL } = import.meta.env;

onMounted(() => {
  RegionService.getRegions().then((data) => {
    products.value = data
    searchRegionArea(products.value[0].name, products.value[0].code)
  }),
    RegionService.getPosts().then((data) => (posts.value = data))
})

const products = ref();
const posts = ref();

const responsiveOptions = ref([
  {
    breakpoint: "1400px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 9,
    numScroll: 9,
  },
  {
    breakpoint: "767px",
    numVisible: 6,
    numScroll: 6,
  },
  {
    breakpoint: "575px",
    numVisible: 6,
    numScroll: 6,
  },
]);

const getSeverity = (status) => {
  switch (status) {
    case "INSTOCK":
      return "success";

    case "LOWSTOCK":
      return "warning";

    case "OUTOFSTOCK":
      return "danger";

    default:
      return null;
  }
};


const regionName = ref();
const area_card_list = ref([]);
let params = RegionService.getParams().then((data) => params = data);
const url = `${VITE_PUBLIC_DATA_BASEURL}areaBasedList1`;


const searchRegionArea = (name, code) => {
  regionName.value = name;

  params.contentTypeId = 12;
  params.areaCode = code;
  params.numOfRows = 12;
  params.pageNo = 1;

  axios.get(url, { params: params })
    .then((res) => {
      // console.log(res.data.response.body.items.item);
      area_card_list.value = res.data.response.body.items.item
    })
}

const searchRegionCode = (area) => {
  searchRegionArea(area.data.name, area.data.code);
}
</script>

<template>
  <div>
    <div class="wrapper">
      <nav>
          <HeaderNav />
      </nav>
    </div>
    <div class="flex flex-col items-center justify-center bg-[#CEDCFF] pt-24 pb-16 px-36">
      <div class="card">
        <Carousel :value="products" :numVisible="9" :numScroll="9" :responsiveOptions="responsiveOptions">
          <template #item="slotProps">
            <div class="p-3 text-center noto-sans-kr-regular" @click="searchRegionCode(slotProps)">
              <div class="mb-3">
                <div class="relative mx-auto">
                  <img :src="`/src/assets/img/area_icon/${slotProps.data.img}`" :alt="slotProps.data.name"
                    class="w-24 border rounded-full" />
                  <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data.inventoryStatus)"
                    class="absolute" style="left:5px; top: 5px" />
                </div>
              </div>
              <div class="mb-3 font-medium">{{ slotProps.data.name }}</div>
            </div>
          </template>
        </Carousel>
      </div>
      <!-- ad -->
      <div class="flex flex-row absolute top-64 z-0 noto-sans-kr-regular">
        <AdCardItem class="w-96" v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </div>
    <div class="mx-60 mt-32 mb-16 noto-sans-kr-regular">
      <div class="my-8">
        <h3>우리지역 핫플이 궁금해?</h3>

        <p class="text-gray-500">
          <span class="text-[#5f93df] text-2xl noto-sans-kr-bold">{{ regionName }}</span>
          추천 여행지
        </p>
      </div>
      <div class=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        <AreaCardItem v-for="area in area_card_list" :area="area" :key="area.contenttypeid" class="group" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
