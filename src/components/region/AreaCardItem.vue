<script setup>
const props = defineProps(
  { 'area': Object }
)

const emit = defineEmits(['moveToPosition'])

const moveToPosition = () => { 
  emit('moveToPosition', props.area);
}

</script>

<template>
  <div href="" class="bg-white rounded-lg border-2" @click="moveToPosition">
    <div class="aspect-h-1 aspect-w-1 h-40  w-full overflow-hidden rounded-t-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
      <img v-if="area.firstimage !='' " :src="area.firstimage" class="h-full w-full object-cover object-center group-hover:opacity-75" />
      <img v-else class="h-44 w-full object-cover object-center group-hover:opacity-75" src="/src/assets/img/no_img.png" />
    </div>
    <!-- <h3 class="mt-4 text-sm text-gray-700">{{ area.title }}</h3> -->
    <div class="p-2">
      <h3 class="mt-1 text-lg font-medium text-gray-900">{{ area.title }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ area.addr1 }} {{ area.addr2 }}</p>
    </div>
  </div>
</template>

<style></style>