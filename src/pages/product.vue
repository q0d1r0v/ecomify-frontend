<script setup lang="ts">
// imports
import { Loading } from "quasar";
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { toast } from "vue3-toastify";
import { client } from "../utils/axios";

// route
const route = useRoute()

// data
const product_data = ref(null)

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
        <div>
            Product id {{ $route.query?.product_id }}
        </div>
        <pre>
            {{ product_data }}
        </pre>
    </div>
</template>