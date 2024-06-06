<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';

</script>

<template>
    <Card style="width: 15rem; overflow: hidden">
        <template #header>
            <img alt="user header" src="https://primefaces.org/cdn/primevue/images/usercard.png" />
        </template>
        <template #title>Advanced Card</template>
        <template #subtitle>Card subtitle</template>
        <!-- <template #content>
            <p class="">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>
        </template> -->
        <!-- <template #footer>
            <div class="flex gap-3">
                <Button label="Cancel" severity="secondary" outlined class="w-full" />
                <Button label="Save" class="w-full" />
            </div>
        </template> -->
    </Card>
</template>

<style scoped>

</style>