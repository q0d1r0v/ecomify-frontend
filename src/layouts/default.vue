<script setup lang="ts">
// imports
import TopBar from "../components/defaults/top-bar.vue"
import Footer from "../components/defaults/footer.vue"
import TopTitle from "../components/defaults/top-title.vue"
</script>

<template>
    <div class="h-screen">
        <div>
            <TopTitle />
        </div>
        <div style="border-bottom: 1px solid #F4F7FE;">
            <div class="for_desktop">
                <TopBar />
            </div>
        </div>
        <div class="for_desktop bg-[#F4F7FE] px-4 py-4">
            <div>
                <RouterView />
            </div>
            <div class="bg-[#F4F7FE]">
                <Footer />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@media screen and (min-width: 768px) {
    .for_desktop {
        padding-left: 14px;
        padding-right: 14px;
    }
}

@media screen and (min-width: 1200px) {
    .for_desktop {
        padding-left: 180px;
        padding-right: 180px;
    }
}
</style>