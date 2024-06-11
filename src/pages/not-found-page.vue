<script setup lang="ts">
</script>

<template>
    <div class="flex items-center justify-center h-screen">
        <div>
            <img src="../assets/not_found_svg_icon.svg" alt="#404" width="600">
            <div class="flex items-center justify-center">
                <div class="border rounded-md px-2 py-2 text-sm cursor-pointer select-none"
                    @click="$router.push('/admin/dashboard')">
                    Bosh sahifaga qaytish
                </div>
            </div>
        </div>
    </div>
</template>