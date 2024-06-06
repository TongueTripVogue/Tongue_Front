<script setup>
import { ref } from "vue"
const props = defineProps({
  PlanItem: Object
})

const plan = ref(props.PlanItem)
console.log(plan)
</script>

<template>
  <div class="flex flex-row justify-between">
    <div class="flex flex-col">
      <div class="flex flex-row">
        <div class="text-lg font-bold">{{ plan.loc }}</div>
        <div class="flex align-items-center ml-3">
          <i class="pi pi-tag text-sm"></i>
          <span>{{ plan.day }} 일차</span>
        </div>
      </div>
      <div>{{ plan.address }}</div>
    </div>
    <div class="flex justify-center items-center">
      $ {{ plan.cost }} 원
    </div>
  </div>
</template>


<style scoped></style>