<script setup lang="ts">
// imports
import { Loading } from "quasar";
import { ref, onMounted } from "vue"
import { toast } from "vue3-toastify";
import { admin } from "../../utils/axios";
import { Icon } from "@iconify/vue/dist/iconify.js";
import { useRouter } from 'vue-router'

// types
interface IOrdersDataTypes {
    filters: {
        search: string,
        status: {
            value: any,
            data: any[]
        },
        date: any
    },
    pagination: {
        page: number,
        max: number
        max_pages: number
    },
    data: any[]
}

// headers of table
const header: any = [
    {
        name: 'id',
        required: true,
        label: 'Buyurtma ID',
        field: 'id',
        align: 'left',
        sortable: true
    },
    {
        name: 'full_name',
        required: true,
        label: 'Ism familya',
        field: 'full_name',
        align: 'left',
        sortable: true
    },
    {
        name: 'address',
        required: true,
        label: 'Manzil',
        field: 'address',
        align: 'left',
        sortable: true
    },
    {
        name: 'phone_number',
        required: true,
        label: 'Telefon raqam',
        field: 'phone_number',
        align: 'left',
        sortable: true
    },
    {
        name: 'additional_phone_number',
        required: true,
        label: 'Qo\'shimcha telefon raqam',
        field: 'phone_number',
        align: 'left',
        sortable: true
    },
    {
        name: 'product_id',
        required: true,
        label: 'Buyurtma berilgan tovar',
        field: 'product_id',
        align: 'left',
        sortable: true
    },
    {
        name: 'created_at',
        required: true,
        label: 'Buyurtma yaratilgan sana',
        field: 'created_at',
        align: 'left',
        sortable: true
    },
    {
        name: 'done',
        required: true,
        label: 'Holati',
        field: 'done',
        align: 'left',
        sortable: true
    }
]

// router
const router = useRouter();

// data
const orders_data = ref<IOrdersDataTypes>({
    pagination: {
        page: 1,
        max: 1,
        max_pages: 6
    },
    filters: {
        search: '',
        date: null,
        status: {
            value: 'active',
            data: [
                {
                    id: 1,
                    title: 'Yakunlangan',
                    value: 'done'
                },
                {
                    id: 2,
                    title: 'Yakunlanmagan',
                    value: 'active'
                }
            ]
        }
    },
    data: [],
})

// functions
function openOnNewTab(product_id: number) {
    const RouteData = router.resolve({ path: '/product', query: { product_id: product_id } });
    window.open(RouteData.href, '_blank');
}
async function getOrders() {
    try {
        const { data } = await admin.get("/api/get-orders", {
            params: {
                page_number: orders_data.value.pagination.page,
                limit: 20,
                status: orders_data.value.filters.status.value,
                order_id: orders_data.value.filters.search
            }
        })

        orders_data.value.data = data.response.data.data
        orders_data.value.pagination.max = ~~data.response.data.last_page || 1
    } catch (err) {
        toast.error("Buyurtmalarni yuklab olishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}
async function updateStatus(order_id: number, status: boolean) {
    try {
        Loading.show()
        await admin.put("/api/update-order", {
            order_id,
            status: status
        })
        await getOrders()
    } catch (err) {
        toast.error("Buyurtmalarni yuklab olishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}


// on mounted
onMounted(() => {
    getOrders()
})

</script>

<template>
    <div>
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div class="bg-white w-[230px]">
                    <q-input v-model="orders_data.filters.search" outlined dense placeholder="Qidiruv(ID)..."
                        @keyup.enter="getOrders">
                        <template #append>
                            <div>
                                <Icon icon="ri-search-line" class="text-sm cursor-pointer" @click="getOrders" />
                            </div>
                        </template>
                    </q-input>
                </div>

                <div class="bg-white w-[230px]">
                    <q-select v-model="orders_data.filters.status.value" :options="orders_data.filters.status.data"
                        option-value="value" option-label="title" outlined dense label="Holat"
                        @update:model-value="getOrders" map-options emit-value clearable />
                </div>
            </div>
            <div class=" flex items-center justify-end">
                <q-pagination v-model="orders_data.pagination.page" color="primary" :max="orders_data.pagination.max"
                    :max-pages="orders_data.pagination.max_pages" boundary-numbers />
            </div>
        </div>

        <div class="mt-4">
            <q-table :columns="header" :rows="orders_data.data" flat hide-pagination :rows-per-page-options="[0]"
                no-data-label="Ma'lumotlar mavjud emas!">
                <template #body-cell-product_id="props">
                    <td>
                        <q-btn round unelevated dense outline color="primary"
                            @click="openOnNewTab(props.row.product_id)">
                            <Icon icon="ri-eye-line" />
                            <q-tooltip>
                                Buyurtma berilgan tovarni ko'rish
                            </q-tooltip>
                        </q-btn>
                    </td>
                </template>
                <template #body-cell-done="props">
                    <td>
                        <q-toggle v-model="props.row.done"
                            @update:model-value="updateStatus(props.row.id, props.row.done)">
                            <q-tooltip>
                                {{ props.row.done ? 'Yakunlangan' : 'Yakunlanmagan' }}
                            </q-tooltip>
                        </q-toggle>
                    </td>
                </template>
            </q-table>
        </div>
    </div>
</template>