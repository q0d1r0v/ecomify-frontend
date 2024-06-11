<script setup lang="ts">
// imports
import LeftBar from '../components/admin-components/left-bar.vue'
import TopBar from '../components/admin-components/top-bar.vue'

</script>

<template>
    <div class="flex">
        <div class="w-1/6">
            <LeftBar />
        </div>
        <div class="w-5/6">
            <TopBar />
            <div class="h-screen bg-[#F4F7FE] w-full px-4 py-4">
                <RouterView />
            </div>
        </div>
    </div>
</template>