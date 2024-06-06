<script setup>
defineProps({ item: Object })

</script>

<template>
    <div class="m-2">
        <div >
            <label for="">
                <img class="w-24" :src="`/src/assets/img/area_icon/${ item.img}`">
                {{ item.name }}
            </label>
        </div>
        <input type="hidden" value="{item.code}">
    </div>
</template>

<style scoped></style>