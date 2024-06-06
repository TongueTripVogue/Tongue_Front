<script setup>
import MainFirstSection from "@/components/main/MainFirstSection.vue"
import MainSecondSection from "@/components/main/MainSecondSection.vue"
import MainGeminiSection from "@/components/main/MainGeminiSection.vue";
import MainMagazineSection from "@/components/main/MainMagazineSection.vue"
import HeaderNav from "@/components/common/HeaderNav.vue";

</script>

<template>
    <div>
        <div class="wrapper">
            <nav>
                <HeaderNav />
            </nav>
        </div>
        <div>
            <MainFirstSection />
            <MainSecondSection />
            <MainGeminiSection />
            <MainMagazineSection />
        </div>
    </div>
</template>

<style scoped>


</style>