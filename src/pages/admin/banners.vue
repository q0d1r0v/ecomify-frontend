<script setup lang="ts">
// imports
import { Icon } from '@iconify/vue/dist/iconify.js';
import { Loading } from 'quasar';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';
import { admin, client } from '../../utils/axios';

// types
interface IBannerDataTypes {
    dialog: {
        model_value: boolean,
        title: string,
        editing: {
            value: boolean,
            dialog_model: boolean,
            data: any
        },
        files: any[]
    },
    data: any[]
}

// headers of table
const header: any = [
    {
        name: 'id',
        required: true,
        label: 'Banner ID',
        field: 'id',
        align: 'left',
        sortable: true
    },
    {
        name: 'banner',
        required: true,
        label: 'Banner',
        field: 'banner',
        align: 'left',
        sortable: true
    },
    {
        name: 'created_at',
        required: true,
        label: 'Created at',
        field: 'created_at',
        align: 'left',
        sortable: true
    },
    {
        name: 'updated_at',
        required: true,
        label: 'Updated at',
        field: 'updated_at',
        align: 'left',
        sortable: true
    },
    {
        name: 'actions',
        required: true,
        label: 'Amallar',
        field: 'actions',
        align: 'left'
    },
]

// data
const banner_data = ref<IBannerDataTypes>({
    data: [],
    dialog: {
        model_value: false,
        title: '',
        editing: {
            value: false,
            dialog_model: false,
            data: null
        },
        files: []
    }
})

// functions
async function getBannerData() {
    try {
        Loading.show()
        const { data } = await client.get("/api/get-banners")
        banner_data.value.data = data.response.data
    } catch (err) {
        toast.error("Banner ma'lumotlarini yuklab olishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}
function showDialog(action_name: string) {
    if (action_name === 'create') {
        banner_data.value.dialog.editing.value = false
        banner_data.value.dialog.files = []
        banner_data.value.dialog.title = "Yangi banner yaratish"
        banner_data.value.dialog.model_value = true
    }
}
async function sendForm() {
    try {
        Loading.show()
        const form_data = new FormData

        banner_data.value.dialog.files.map((file) => {
            form_data.append('files', file)
        })
        form_data.append('is_banner', 'active')
        await admin.post("/api/upload-file", form_data)
        setTimeout(async () => {
            await getBannerData()
            Loading.hide()
            banner_data.value.dialog.model_value = false
            toast.success("Banner muvaffaqiyatli yaratildi!")
        }, 1000)
    } catch (err) {
        toast.error("Yangi banner yaratishda xatolik yuz berdi!")
        Loading.hide()
    }
}
function getUrlForFile(name: string) {
    const ImgUrl = import.meta.env.VITE_APP_FILE_URL + name
    return ImgUrl
}
async function deleteFile() {
    try {
        Loading.show()
        await admin.delete("/api/delete-banner", {
            params: {
                banner_id: banner_data.value.dialog.editing.data?.id
            }
        })
        await getBannerData()
        banner_data.value.dialog.editing.dialog_model = false
        toast.success("Banner muvaffaqiyatli o'chirildi!")
    } catch (err) {
        toast.error("Bannerni o'chirishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}
function showDeleteFileDialog(data: any) {
    banner_data.value.dialog.editing.data = data
    banner_data.value.dialog.editing.dialog_model = true
}

// on mounted
onMounted(() => {
    getBannerData()
})

</script>

<template>
    <div>
        <div class="flex items-center justify-end">
            <q-btn color="primary" @click="showDialog('create')" unelevated>
                <q-tooltip>
                    Yangi banner yaratish
                </q-tooltip>
                <Icon icon="ri-add-fill" class="text-lg" />
            </q-btn>
        </div>
        <div class="mt-4">
            <q-table :columns="header" :rows="banner_data.data" flat hide-pagination :rows-per-page-options="[0]"
                no-data-label="Ma'lumotlar mavjud emas!">
                <template #body-cell-banner="props">
                    <q-td>
                        <img :src="getUrlForFile(props.row.name)" alt="#banner" width="40">
                    </q-td>
                </template>

                <template #body-cell-actions="props">
                    <q-td>
                        <q-btn unelevated outline round color="negative" dense @click="showDeleteFileDialog(props.row)">
                            <Icon icon="ri-delete-bin-line" />
                        </q-btn>
                    </q-td>
                </template>
            </q-table>
        </div>

        <q-dialog v-model="banner_data.dialog.model_value" persistent>
            <q-card class="p-4 w-[500px]">
                <div class="text-xl">
                    Yangi banner yaratish
                </div>
                <div class="mt-4">
                    <q-file v-model="banner_data.dialog.files" multiple label="Bannerni yuklash" outlined use-chips
                        dense>
                        <template #append>
                            <Icon icon="ri-upload-cloud-line" />
                        </template>
                    </q-file>
                </div>
                <div class="flex items-center justify-end gap-2 mt-10">
                    <q-btn color="primary" unelevated :disable="!banner_data.dialog.files.length"
                        @click="sendForm">Yaratish</q-btn>
                    <q-btn color="negative" unelevated @click="banner_data.dialog.model_value = false">Bekor
                        qilish</q-btn>
                </div>
            </q-card>
        </q-dialog>

        <q-dialog v-model="banner_data.dialog.editing.dialog_model" persistent>
            <q-card class="p-4">
                <div>
                    <span class="text-xl">
                        Ushbu fileni o'chirishni tasdiqlaysizmi?
                    </span>
                </div>
                <div class="mt-6 flex justify-end gap-2">
                    <q-btn color="primary" unelevated @click="deleteFile">Tasdiqlash</q-btn>
                    <q-btn color="negative" unelevated @click="banner_data.dialog.editing.dialog_model = false">Bekor
                        qilish</q-btn>
                </div>
            </q-card>
        </q-dialog>
    </div>
</template>