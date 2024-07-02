<script setup lang="ts">
// imports
import { Icon } from '@iconify/vue/dist/iconify.js';
import { Loading } from 'quasar';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import { admin } from '../../utils/axios';

// data
const date = ref<any>("")
const selected_date = ref<any>("")
const show_calendar = ref<boolean>(true)
const order_counter = ref<{ done_orders: number, orders: number }>({
    done_orders: 0,
    orders: 0
})

// functions
async function changeDate() {
    try {
        Loading.show()
        selected_date.value = `${date.value?.from.split("/").join("-").toString()}/${date.value?.to.split("/").join("-").toString()}`
        const { data } = await admin.get("/api/get-orders-dashboard", {
            params: {
                from_date: date.value?.from.split("/").join("-").toString(),
                to_date: date.value?.to.split("/").join("-").toString()
            }
        })
        order_counter.value = data.response.data
    } catch (err) {
        toast.error("Buyurtma ma'lumotlarini yuklab olishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}
function resetData() {
    date.value = ""
    selected_date.value = ""
}

</script>

<template>
    <div>
        <div class="flex items-center justify-end">
            <div>
                <q-input v-model="selected_date" outlined dense @clear="resetData" clearable readonly
                    label="Sana oralig'i">
                    <template v-slot:append>
                        <q-tooltip>
                            Sana oralig'ida xisobotlarni ko'rish
                        </q-tooltip>
                        <q-icon name="event" class="cursor-pointer" @click="show_calendar = true">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="date" range @update:model-value="changeDate" title="Sana oralig'i">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Yopish" color="primary" flat />
                                    </div>
                                </q-date>
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
            </div>
        </div>

        <div class="mt-6 flex gap-4">
            <div class="bg-white w-[400px] px-8 py-6 rounded-md">
                Jarayondagi buyurtmalar soni: <span class="text-xl ml-2">{{ order_counter.orders }}</span>
            </div>
            <div class="bg-white w-[400px] px-8 py-6 rounded-md">
                Yakinlangan buyurtmalar soni: <span class="text-xl ml-2">{{ order_counter.done_orders }}</span>
            </div>
        </div>
    </div>
</template>