<script setup lang="ts">
// imports
import { useI18n } from "vue-i18n"
import { ref, onMounted } from "vue"
import { Loading } from "quasar";
import { toast } from "vue3-toastify";
import { client } from "../utils/axios";
import { CreateUrl } from "../modules/create-url";

// use lang
const { t } = useI18n()

// data
const slide = ref(0)
const banners = ref<any[]>([])
const random_products = ref<any[]>([])

// functions
async function getFirstData() {
    try {
        const { data } = await client.get("/api/get-banners")
        const products = await client.get("/api/get-random-products", {
            params: {
                lang: localStorage.getItem("lang") || "uz"
            }
        })
        console.log(products)

        random_products.value = products.data
        banners.value = data.response.data
    } catch (err) {
        toast.error("Banner ma'lumotlarini yuklab olishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}

// on mounted
onMounted(() => {
    getFirstData()
})
</script>

<template>
    <div>
        <div class="rounded-md overflow-hidden">
            <q-carousel v-model="slide" navigation infinite autoplay animated class="carusel">
                <q-carousel-slide v-for="(banner, index) of banners" :name="~~index" :img-src="CreateUrl(banner.name)"
                    style="width: 100% !important;" />
            </q-carousel>
        </div>

        <div>
            <div class="mt-6 text-lg cursor-pointer">
                Taxminiy tovarlar
            </div>

            <div class="mb-4">
                <div class="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 max-[630px]:grid-cols-2 gap-4 mt-4">
                    <div class="bg-white rounded-md p-4 card" v-for="product of random_products" :index="product.id"
                        CssClass="UseHand">
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
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@media screen and (max-width: 580px) {
    .carusel {
        height: 200px !important;
    }
}

@media screen and (min-width: 768px) {
    .carusel {
        height: 400px !important;
    }
}

@media screen and (min-width: 1200px) {
    .carusel {
        height: 550px !important;
    }
}

.card:hover {
    cursor: pointer !important;
}
</style>