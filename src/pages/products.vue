<script setup lang="ts">
// imports
import { ref, onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import { CreateUrl } from "../modules/create-url";
import { Loading } from "quasar";
import { toast } from "vue3-toastify";
import { client } from "../utils/axios";

// types
interface IProductsDataType {
    pagination: {
        page: number,
        max: number,
        max_pages: number
    },
    products: any[]
}

// route
const route = useRoute()

// data
const products_data = ref<IProductsDataType>({
    pagination: {
        page: 1,
        max: 1,
        max_pages: 6
    },
    products: []
})

// functions
async function getProducts() {
    try {
        if (route.query.category_id) {
            const { data } = await client.get("/api/get-products-with-category_id", {
                params: {
                    category_id: route.query.category_id,
                    page_number: products_data.value.pagination.page,
                    lang: localStorage.getItem("lang") || "uz",
                    limit: 15
                }
            })
            products_data.value.products = data.response.data.data
            products_data.value.pagination.max = data.response.data.last_page
        } else {
            const { data } = await client.get("/api/get-products", {
                params: {
                    name: route.query.search,
                    page_number: products_data.value.pagination.page,
                    lang: localStorage.getItem("lang") || "uz",
                    limit: 15
                }
            })
            products_data.value.products = data.response.data.data
            products_data.value.pagination.max = data.response.data.last_page
        }
    } catch (err) {
        toast.error("Tovarlarni yuklab olishda xatolik yuz bderi!")
    } finally {
        Loading.hide()
    }
}

// watch
watch(() => route.query.search, () => {
    getProducts()
})
watch(() => route.query.category_id, () => {
    getProducts()
})

// on mounted
onMounted(() => {
    getProducts()
})
</script>
<template>
    <div class="min-h-screen">
        <div class="flex items-center justify-between">
            <div class="">
                <span class="font-semibold">Qidiruv:</span> {{ route.query.search ? route.query.search :
                    route.query.category_name }}
            </div>
            <div>
                <q-pagination v-model="products_data.pagination.page" color="primary"
                    :max="products_data.pagination.max" :max-pages="products_data.pagination.max_pages" boundary-numbers
                    unelevated @update:model-value="getProducts" />
            </div>
        </div>

        <div class="mb-4">
            <div class="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 max-[630px]:grid-cols-2 gap-4 mt-4"
                v-if="products_data.products.length">
                <div class="bg-white rounded-md p-4 card cursor-pointer" v-for="product of products_data.products"
                    :index="product.id" @click="$router.push({ path: '/product', query: { product_id: product.id } })">
                    <div class="!w-full">
                        <img :src="CreateUrl(product.images[0].name)" :alt="product.name"
                            style="width: 100% !important;">
                    </div>
                    <div>
                        <div class="mt-4">
                            {{ product.name }}
                        </div>
                        <div class="mt-4 font-semibold">
                            {{ parseInt(product.price).toLocaleString().split(",").join(" ") }} UZS
                        </div>
                    </div>
                </div>
            </div>

            <div v-else>
                <div class="flex items-center justify-center mt-4">
                    <div class="m-auto text-center">
                        <div class="mb-4 text-lg">No data</div>
                        <img src="../assets/no-data.svg" alt="#no_data" width="240">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>