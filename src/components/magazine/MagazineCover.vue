<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({
  magazine: Object,
});
import "primeicons/primeicons.css";
const hover = ref(false);
console.log(props.magazine.coverImg);
// console.log(props.magazine.magazineDetailDtoList[0].img);

// const coverImg = ref("");
</script>

<template>
  <div class="">
    <div class="w-48 h-60 m-3" @mouseover="hover = true" @mouseleave="hover = false">
      <div v-if="hover" class="bg-[#bef264] z-0 w-48 h-60 rounded-md">
        <p
          class="relative top-36 pl-5 font-bold"
          @click="
            router.push({ name: 'magazineView', params: { magazineId: magazine.magazineId } })
          "
        >
          보러가기
        </p>
        <img class="relative w-20 top-36 pl-5" src="/src/assets/img/arrow2_flip.png" alt="" />
      </div>
      <img
        v-else
        class="object-cover z-0 w-48 h-60 rounded-md"
        :src="`${magazine.coverImg}`"
        alt=""
      />
      <p class="flex relative z-20 px-2 -top-56 text-4xl font-bold text-wrap">
        {{ magazine.magazineTitle }}
      </p>
    </div>
    <div class="flex relative z-10 bottom-11 justify-between px-6">
      <p class="pi pi-bookmark" style="color: black; font-weight: 500; font-size: 15pt"></p>
      <!-- {{ magazine.hit }}-->
      <p class="pi pi-heart" style="color: black; font-weight: 500; font-size: 15pt"></p>
      <!-- {{ magazine.like }}-->
    </div>
  </div>
</template>

<style scoped>
.cover-img {
  background-color: rgb(159, 255, 103);
}
</style>
