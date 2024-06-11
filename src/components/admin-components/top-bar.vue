<script setup lang="ts">
// imports
import { Icon } from '@iconify/vue';
</script>
<template>
    <div class="px-4 pt-6 pb-4 bg-[#F4F7FE] flex items-center justify-between">
        <div>
            <div class="text-[#7D86AF]">
                Sahifa / {{ $route.meta.title }}
            </div>
            <div class="text-xl">
                {{ $route.meta.title }}
            </div>
        </div>
        <div class="bg-white cursor-pointer p-2 text-xl rounded-md border border-red-100">
            <Icon icon="ri-logout-box-r-line" class="text-red-500" />

            <q-tooltip>
                Chiqish
            </q-tooltip>
        </div>
    </div>
</template>