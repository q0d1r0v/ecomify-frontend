<script setup lang="ts">
// imports
import { Icon } from '@iconify/vue/dist/iconify.js';
import { Loading } from 'quasar';
import { ref, onMounted } from "vue"
import { toast } from 'vue3-toastify';
import { admin } from '../../utils/axios';

// types
interface ICategoryDataTypes {
    dialog: {
        form: {
            name_uz: string,
            name_ru: string
            files: any[]
        },
        model_value: boolean,
        title: string,
        editing: {
            value: boolean,
            data: any
        },
    },
    deleting_dialog: {
        model_value: boolean,
        data: any
    }
    data: any[]
}

// headers of table
const header: any = [
    {
        name: 'id',
        required: true,
        label: 'ID',
        field: 'id',
        align: 'left',
        sortable: true
    },
    {
        name: 'name_uz',
        required: true,
        label: 'Nomi UZ',
        field: 'name_uz',
        align: 'left',
        sortable: true
    },
    {
        name: 'name_ru',
        required: true,
        label: 'Nomi RU',
        field: 'name_ru',
        align: 'left',
        sortable: true
    },
    {
        name: 'images',
        required: true,
        label: 'Rasmi',
        field: 'images',
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
const category_data = ref<ICategoryDataTypes>({
    data: [],
    dialog: {
        model_value: false,
        title: '',
        form: {
            name_uz: '',
            name_ru: '',
            files: []
        },
        editing: {
            value: false,
            data: null
        }
    },
    deleting_dialog: {
        model_value: false,
        data: null
    }
})

// functions
function getUrlForFile(name: string) {
    const ImgUrl = import.meta.env.VITE_APP_FILE_URL + name
    return ImgUrl
}
function showDialog(action_name: string, data?: any) {
    if (action_name === "create") {
        category_data.value.dialog.editing.value = false
        category_data.value.dialog.title = "Yangi kategoriya yaratish"
        category_data.value.dialog.form.files = []
        category_data.value.dialog.form.name_uz = ''
        category_data.value.dialog.form.name_ru = ''
        category_data.value.dialog.model_value = true
    } else {
        category_data.value.dialog.editing.value = true
        category_data.value.dialog.editing.data = data
        category_data.value.dialog.title = "Kategoriyani taxrirlash"
        category_data.value.dialog.form.name_uz = data.name_uz
        category_data.value.dialog.form.name_ru = data.name_ru
        category_data.value.dialog.model_value = true
    }
}
async function getCategories() {
    try {
        Loading.show()
        const { data } = await admin.get("/api/get-all-categories")
        category_data.value.data = data.response.data
    } catch (err) {
        toast.error("Kategoriyalarni yuklab olishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}
async function sendForm() {
    if (!category_data.value.dialog.editing.value) {
        try {
            Loading.show()
            const { data } = await admin.post("/api/create-category", {
                name_uz: category_data.value.dialog.form.name_uz,
                name_ru: category_data.value.dialog.form.name_ru
            })
            const form_data = new FormData
            category_data.value.dialog.form.files.map(file => {
                form_data.append("files", file)
            })
            form_data.append("category_id", data.response.data?.id)
            await admin.post("/api/upload-file", form_data)
            setTimeout(async () => {
                await getCategories()
                Loading.hide()
                category_data.value.dialog.model_value = false
            }, 1000)
        } catch (err) {
            toast.error("Yangi kategoriya yaratishda xatolik yuz berdi!")
            Loading.hide()
        }
    } else {
        try {
            Loading.show()
            await admin.put("/api/update-category", {
                category_id: category_data.value.dialog.editing.data?.id,
                name_uz: category_data.value.dialog.form.name_uz,
                name_ru: category_data.value.dialog.form.name_ru
            })
            await getCategories()
            category_data.value.dialog.model_value = false
            toast.success("Kategoriya muvaffaqiyatli o'zgartirildi!")
        } catch (err) {
            toast.error("Yangi kategoriya yaratishda xatolik yuz berdi!")
            Loading.hide()
        } finally {
            Loading.hide()
        }
    }
}
function showDeleteDialog(data: any) {
    category_data.value.deleting_dialog.data = data
    category_data.value.deleting_dialog.model_value = true
}
async function deleteCategory() {
    try {
        await admin.delete("/api/delete-category", {
            params: {
                category_id: category_data.value.deleting_dialog.data?.id
            }
        })
        await getCategories()
        category_data.value.deleting_dialog.model_value = false
        toast.success("Ushbu kategoriya muvoffaqiyatli o'chirildi!")
    } catch (err) {
        toast.error("Ushbu kategoriyani o'chirishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}

// on mounted
onMounted(() => {
    getCategories()
})

</script>

<template>
    <div>
        <div class="flex items-center justify-end">
            <q-btn color="primary" unelevated @click="showDialog('create')">
                <q-tooltip>
                    Yangi kategoriya yaratish
                </q-tooltip>
                <Icon icon="ri-add-fill" class="text-lg" />
            </q-btn>
        </div>
        <div class="mt-4">
            <q-table :columns="header" :rows="category_data.data" flat hide-pagination :rows-per-page-options="[0]"
                no-data-label="Ma'lumotlar mavjud emas!">
                <template #body-cell-images="props">
                    <q-td>
                        <img :src="getUrlForFile(props.row.images[0].name)" alt="#banner" width="40">
                    </q-td>
                </template>

                <template #body-cell-actions="props">
                    <q-td>
                        <q-btn unelevated outline round color="warning" dense @click="showDialog('edit', props.row)"
                            class="mr-2">
                            <q-tooltip>
                                O'zgartirish
                            </q-tooltip>
                            <Icon icon="ri-edit-line" />
                        </q-btn>
                        <q-btn unelevated outline round color="negative" dense @click="showDeleteDialog(props.row)">
                            <q-tooltip>
                                O'chirish
                            </q-tooltip>
                            <Icon icon="ri-delete-bin-line" />
                        </q-btn>
                    </q-td>
                </template>
            </q-table>

            <q-dialog v-model="category_data.dialog.model_value" persistent>
                <q-card class="p-4 w-[500px]">
                    <div class="text-xl">
                        {{ category_data.dialog.title }}
                    </div>
                    <div class="mt-4">
                        <q-file v-model="category_data.dialog.form.files" multiple label="Kategoriya rasmini yuklash"
                            outlined use-chips dense v-if="!category_data.dialog.editing.value">
                            <template #append>
                                <Icon icon="ri-upload-cloud-line" />
                            </template>
                        </q-file>
                        <q-input placeholder="Kategoriya nomi uz" outlined dense class="mt-2" clearable
                            v-model="category_data.dialog.form.name_uz" />
                        <q-input placeholder="Kategoriya nomi ru" outlined dense class="mt-2"
                            v-model="category_data.dialog.form.name_ru" clearable />
                    </div>
                    <div class="flex items-center justify-end gap-2 mt-4">
                        <q-btn color="primary" unelevated
                            :disable="!category_data.dialog.form.files.length || !category_data.dialog.form.name_uz || !category_data.dialog.form.name_ru"
                            @click="sendForm" v-if="!category_data.dialog.editing.value">Yaratish</q-btn>
                        <q-btn color="primary" unelevated
                            :disable="!category_data.dialog.form.name_uz || !category_data.dialog.form.name_ru"
                            @click="sendForm" v-else>O'zgartirish</q-btn>
                        <q-btn color="negative" unelevated @click="category_data.dialog.model_value = false">Bekor
                            qilish</q-btn>
                    </div>
                </q-card>
            </q-dialog>

            <q-dialog v-model="category_data.deleting_dialog.model_value" persistent>
                <q-card class="p-4">
                    <div>
                        <span class="text-xl">
                            Ushbu kategoriyani o'chirishni tasdiqlaysizmi?
                        </span>
                    </div>
                    <div class="mt-6 flex justify-end gap-2">
                        <q-btn color="primary" unelevated @click="deleteCategory">Tasdiqlash</q-btn>
                        <q-btn color="negative" unelevated
                            @click="category_data.deleting_dialog.model_value = false">Bekor
                            qilish</q-btn>
                    </div>
                </q-card>
            </q-dialog>
        </div>
    </div>
</template>