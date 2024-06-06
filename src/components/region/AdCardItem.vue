<script setup>
import { ref } from "vue"
const props = defineProps({
  'post': Object
})

const color = ref([
  'rgb(240, 250, 255)',
  'rgb(241, 250, 240)',
  'rgb(242, 235, 255)',
])

</script>

<template>
  <article class="flex max-w-xl flex-col items-start justify-between mx-4 mt-8 p-4 rounded-md" 
  :style="{ backgroundColor: color[post.id-1] }">
    <div class="flex items-center gap-x-4 text-xs">
      <time :datetime="post.datetime" class="text-gray-500">{{ post.date }}</time>
      <a :href="post.category.href"
        class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">{{
          post.category.title }}</a>
    </div>
    <div class="group relative">
      <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
        <a :href="post.href">
          <span class="absolute inset-0" />
          {{ post.title }}
        </a>
      </h3>
      <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{{ post.description }}</p>
    </div>
  </article>
</template>

<style></style>