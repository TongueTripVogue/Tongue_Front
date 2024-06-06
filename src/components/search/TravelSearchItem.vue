<script setup>
import {ref, onMounted} from "vue"
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { RegionService } from "@/service/RegionService.js";

onMounted(() => {
    RegionService.getRegions().then((data) => (cities.value = data)),
    RegionService.getTourTypes().then((data) => (tourist.value = data))
})


const selectedCity = ref();
const cities = ref();

const selectedTour = ref();
const tourist = ref();

const regionValue = ref('');

const emit = defineEmits(['regionSearch'])

const regionSearch = () => {
    // console.log(regionValue.value);
    // console.log(selectedTour.value);
    // console.log(selectedCity.value);
    emit('regionSearch', regionValue.value,selectedTour.value, selectedCity.value )
}

</script>

<template>
    <div class="noto-sans-kr-regular card flex justify-content-center gap-3 p-4 opacity-90 bg-graywhite rounded-lg">
        <!-- <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City" checkmark :highlightOnSelect="false" class="w-full md:w-14rem" /> -->
        <Dropdown v-model="selectedCity" :options="cities" filter optionLabel="name" placeholder="Select a Country" class="w-full md:w-14rem">
            <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                    <div>{{ slotProps.value.name }}</div>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
            </template>
            <template #option="slotProps">
                <div class="flex align-items-center">
                    <div>{{ slotProps.option.name }}</div>
                </div>
            </template>
        </Dropdown>
        <Dropdown v-model="selectedTour" :options="tourist" optionLabel="name" placeholder="Select a Tourist" checkmark :highlightOnSelect="false" class="w-full md:w-14rem" />
        <InputText type="text" v-model="regionValue" class="w-full" />
        <Button
              icon="pi pi-search"
              severity="secondary"
              rounded
              
              @click="regionSearch"
              aria-label="Search"
              class="w-32 p-3 bg-[#293c6c]"
            />
    </div>
</template>

<style scoped>

</style>