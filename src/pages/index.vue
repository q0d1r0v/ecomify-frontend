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

// functions
async function getBanners() {
    try {
        const { data } = await client.get("/api/get-banners")
        banners.value = data.response.data
    } catch (err) {
        toast.error("Banner ma'lumotlarini yuklab olishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}

// on mounted
onMounted(() => {
    getBanners()
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
</style>