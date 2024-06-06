<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import "primeicons/primeicons.css";

const props = defineProps({ message: String });

const router = useRouter();
</script>

<template>
  <div class="plan-card">
    <div
      class="plan-card-title py-6 flex flex-col justify-center items-center text-gray-400 font-bold text-2xl space-y-3"
    >
      <i class="pi pi-exclamation-circle"></i>
      <div class="w-full text-center">{{ message }}이 없습니다</div>
    </div>
    <!-- <div class="plan-card-options flex relative">
      <div @click="router.push({ name: 'plan' })">일정 만들기</div>
      <div @click="router.push({ name: 'magazineMain' })">구경하기</div>
    </div> -->
  </div>
</template>

<style scoped>
.plan-card {
  margin: 10px;
  border-radius: 8pt;
  width: 200px;
}
.plan-card-title {
  top: -120px;
}

.plan-card-thumbnail {
  z-index: 0;
  border-radius: 8pt;
}
.plan-card-options {
  display: flex;
  justify-content: space-between;
  color: black;
  font-weight: 400;
  z-index: 20;
  padding: 0 10px;
}
</style>
