<script setup lang="ts">
// imports
import { Loading } from "quasar";
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { toast } from "vue3-toastify";
import { client } from "../utils/axios";
import { CreateUrl } from "../modules/create-url";

// route
const route = useRoute()

// data
const product_data = ref<any>(null)

// functions
async function getProductData() {
    try {
        Loading.show()
        const { data } = await client.get("/api/show-order-product", {
            params: {
                product_id: route.query?.product_id
            }
        })
        product_data.value = data.response.data
        console.log(data)
    } catch (err) {
        toast.error("Product ma'lumotlarini yuklab olishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}

// onMounted
onMounted(() => {
    getProductData()
})
</script>

<template>
    <div class="h-screen">
        <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 max-[630px]:grid-cols-1 gap-4 mt-4">
            <div class="border">
                <div>
                    <img :src="CreateUrl(product_data?.images[0].name)" alt="#product_image" width="400">
                </div>
                <div v-if="product_data?.images.length > 1">
                    other images
                </div>
            </div>
            <div class="border">
                price and other info
            </div>
        </div>

        <div class="border mt-4">
            html information
        </div>
    </div>
</template>