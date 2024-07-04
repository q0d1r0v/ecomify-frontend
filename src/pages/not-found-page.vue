<script setup lang="ts">
// imports
import { useRouter } from "vue-router"

// router
const router = useRouter()

// functions 
function goBack() {
    if (localStorage.getItem("access_token")) {
        router.push('/admin/dashboard')
    } else {
        router.push('/')
    }
}

</script>

<template>
    <div class="flex items-center justify-center h-screen">
        <div>
            <img src="../assets/not_found_svg_icon.svg" alt="#404" width="600">
            <div class="flex items-center justify-center">
                <div class="border rounded-md px-2 py-2 text-sm cursor-pointer select-none" @click="goBack">
                    {{ $t('not_fount_text') }}
                </div>
            </div>
        </div>
    </div>
</template>