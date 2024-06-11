<script setup lang="ts">
// imports
import { Icon } from "@iconify/vue"
import { ref } from "vue"

// data
const nav_list = ref<any[]>([
    {
        id: 1,
        title: 'Dashboard',
        path: '/admin/dashboard',
        icon: 'ri-dashboard-line',
    },
    {
        id: 2,
        title: 'Banner',
        path: '/admin/banners',
        icon: 'ri-gallery-line',
    },
    {
        id: 3,
        title: 'Kategoriyalar',
        path: '/admin/categories',
        icon: 'ri-list-check-2',
    },
    {
        id: 4,
        title: 'Tovarlar',
        path: '/admin/products',
        icon: 'ri-store-line',
    },
    {
        id: 5,
        title: 'Buyurtmalar',
        path: '/admin/orders',
        icon: 'ri-luggage-cart-line',
    },
    {
        id: 6,
        title: 'Foydalanuvchilar',
        path: '/admin/users',
        icon: 'ri-group-line',
    }
])
</script>

<template>
    <div>
        <div class="for_logo flex items-center justify-center px-8 py-8 text-lg cursor-pointer select-none text-[#111CEF] font-semibold"
            @click="$router.push('/admin/dashboard')">
            ECOMIFY
        </div>

        <div class="pl-4 pt-6">
            <div v-for="list of nav_list" class="cursor-pointer select-none pb-6" @click="$router.push(list.path)">
                <div class="flex justify-between">
                    <div class="flex items-center justify-center gap-2">
                        <div>
                            <Icon :icon="list.icon"
                                :class="$route.path == list.path ? 'text-xl text-[#111CEF]' : ' text-xl text-[#A0ACD2]'" />
                        </div>
                        <div :class="$route.path == list.path ? 'text-md' : ' text-md text-[#A0ACD2]'">
                            {{ list.title }}
                        </div>
                    </div>
                    <div class="left-active" v-show="$route.path == list.path">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.for_logo {
    border-bottom: 1px solid #F4F7FE;
}

.left-active {
    width: 6px;
    background: #111CEF;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}
</style>