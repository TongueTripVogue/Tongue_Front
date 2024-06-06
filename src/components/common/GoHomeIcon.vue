<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const moveToMain = () => {
  router.push({ name: 'login' })
}

</script>

<template>
  <button @click="moveToMain">
    <i class="pi pi-angle-left pr-2" style="font-size: 1.5rem"></i>
  </button>
</template>


<style></style>