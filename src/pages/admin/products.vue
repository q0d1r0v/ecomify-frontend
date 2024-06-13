<script setup lang="ts">
// imports
import { Icon } from "@iconify/vue/dist/iconify.js";
import { Loading } from "quasar";
import { ref, onMounted, nextTick } from "vue"
import { toast } from "vue3-toastify";
import { admin, client } from "../../utils/axios";

// types
interface IProductDataTypes {
    data: any[],
    search: string,
    dialog_data: {
        model_value: boolean,
        title: string,
        pagination: {
            page: number,
            max: number
            max_pages: number
        },
        editing: {
            value: boolean,
            data: any
        },
        form: {
            name_uz: string,
            name_ru: string,
            description_uz: string,
            description_ru: string,
            price: string,
            files: any[],
            categories: {
                data: any[],
                value: any
            }
        },
        deleting: {
            model_value: boolean,
            data: any
        }
    }
}

// headers of table
const header: any = [
    {
        name: 'id',
        required: true,
        label: 'Tovar ID',
        field: 'id',
        align: 'left',
        sortable: true
    },
    {
        name: 'images',
        required: true,
        label: 'Taovar rasmi',
        field: 'images',
        align: 'left',
        sortable: true
    },
    {
        name: 'name_uz',
        required: true,
        label: 'Tovar nomi UZ',
        field: 'name_uz',
        align: 'left',
        sortable: true
    },
    {
        name: 'name_ru',
        required: true,
        label: 'Tovar nomi RU',
        field: 'name_ru',
        align: 'left',
        sortable: true
    },
    {
        name: 'price',
        required: true,
        label: 'Tovar narxi',
        field: (row: any) => parseInt(row.price).toLocaleString().split(",").join(' '),
        align: 'left',
        sortable: true
    },
    {
        name: 'active',
        required: true,
        label: 'Tovar holati',
        field: 'active',
        align: 'left',
        sortable: true
    },
    {
        name: 'created_at',
        required: true,
        label: 'Crated at',
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
const products_data = ref<IProductDataTypes>({
    data: [],
    search: '',
    dialog_data: {
        model_value: false,
        title: '',
        pagination: {
            page: 1,
            max: 1,
            max_pages: 6
        },
        form: {
            name_uz: '',
            name_ru: '',
            description_uz: '',
            description_ru: '',
            price: '',
            files: [],
            categories: {
                value: '',
                data: []
            }
        },
        editing: {
            value: false,
            data: null
        },
        deleting: {
            model_value: false,
            data: null
        }
    }
})

// functions
function getUrlForFile(name: string) {
    const ImgUrl = import.meta.env.VITE_APP_FILE_URL + name
    return ImgUrl
}
async function getProducts() {
    try {
        Loading.show()
        const { data } = await client.get("/api/get-products", {
            params: {
                name: products_data.value.search,
                lang: 'uz',
                page_number: products_data.value.dialog_data.pagination.page,
                limit: 20
            }
        })
        products_data.value.dialog_data.pagination.max = ~~data.response.data.last_page
        products_data.value.data = data.response.data.data
    } catch (err) {
        toast.error("Tovarlarni yuklab olishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}
async function changeProductStatus(data: any) {
    try {
        Loading.show()
        await admin.put("/api/update-status-of-product", {
            product_id: data?.id
        })
        toast.success("Tovarlarni statusi muvaffaqiyatli yangilandi!")
    } catch (err) {
        toast.error("Tovarlarni statusini o'zgartirishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}
async function getCategories() {
    try {
        Loading.show()
        const { data } = await admin.get("/api/get-all-categories")
        products_data.value.dialog_data.form.categories.data = data.response.data
    } catch (err) {
        toast.error("Kategoriyalarni yuklab olishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}
async function showDialog(action_name: string, data?: any) {
    await getCategories()
    if (action_name === "create") {
        products_data.value.dialog_data.editing.value = false
        products_data.value.dialog_data.title = "Yangi tovar yaratish"
        products_data.value.dialog_data.form.name_uz = ""
        products_data.value.dialog_data.form.name_ru = ""
        products_data.value.dialog_data.form.description_uz = ""
        products_data.value.dialog_data.form.description_ru = ""
        products_data.value.dialog_data.form.files = []
        products_data.value.dialog_data.form.price = ""
        products_data.value.dialog_data.form.categories.value = ''
        products_data.value.dialog_data.model_value = true
    } else {
        products_data.value.dialog_data.editing.value = true
        products_data.value.dialog_data.editing.data = data
        products_data.value.dialog_data.title = "Tovarni ma'lumotlarini yangilash"
        products_data.value.dialog_data.form.name_uz = data.name_uz
        products_data.value.dialog_data.form.name_ru = data.name_ru
        products_data.value.dialog_data.form.description_uz = data.description_uz
        products_data.value.dialog_data.form.description_ru = data.description_ru
        products_data.value.dialog_data.form.price = data.price
        products_data.value.dialog_data.form.categories.value = ~~data.category_id
        products_data.value.dialog_data.model_value = true
    }
}
async function sendForm() {
    if (!products_data.value.dialog_data.editing.value) {
        try {
            const { data } = await admin.post("/api/create-product", {
                name_uz: products_data.value.dialog_data.form.name_uz,
                name_ru: products_data.value.dialog_data.form.name_ru,
                description_uz: products_data.value.dialog_data.form.description_uz,
                description_ru: products_data.value.dialog_data.form.description_ru,
                category_id: products_data.value.dialog_data.form.categories.value,
                price: products_data.value.dialog_data.form.price,
            })
            const formData = new FormData()

            products_data.value.dialog_data.form.files.map((file) => {
                formData.append("files", file)
            })
            formData.append("product_id", data?.response?.data?.id)
            await admin.post("/api/upload-file", formData)

            await getProducts()

            products_data.value.dialog_data.model_value = false
            toast.success("Tovar muvaffaqiyatli yaratildi!")
        } catch (err) {
            toast.error("Tovarni yaratishda xatolik yuz berdi!")
        } finally {
            Loading.hide()
        }
    } else {
        try {

            await admin.put("/api/update-product-info", {
                product_id: products_data.value.dialog_data.editing.data?.id,
                name_uz: products_data.value.dialog_data.form.name_uz,
                name_ru: products_data.value.dialog_data.form.name_ru,
                description_uz: products_data.value.dialog_data.form.description_uz,
                description_ru: products_data.value.dialog_data.form.description_ru,
                category_id: products_data.value.dialog_data.form.categories.value,
                price: products_data.value.dialog_data.form.price,
            })
            await getProducts()

            products_data.value.dialog_data.model_value = false
            toast.success("Tovar muvaffaqiyatli yangilandi!")
        } catch (err) {
            toast.error("Tovarni o'zgartirishda xatolik yuz berdi!")
        } finally {
            Loading.hide()
        }
    }
}
function showDeleteDialog(data: any) {
    products_data.value.dialog_data.deleting.data = data
    products_data.value.dialog_data.deleting.model_value = true
}
async function deleteProduct() {
    try {

        await admin.delete("/api/delete-product", {
            params: {
                product_id: products_data.value.dialog_data.deleting.data?.id
            }
        })
        await getProducts()

        products_data.value.dialog_data.deleting.model_value = false
        toast.success("Tovar muvaffaqiyatli o'chirildi!")
    } catch (err) {
        toast.error("Tovarni o'chirishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}

// on mounted
onMounted(() => {
    getProducts()
})
</script>

<template>
    <div>
        <div class="flex items-center justify-between">
            <div class="bg-white">
                <q-input v-model="products_data.search" outlined dense @keyup.enter="getProducts"
                    placeholder="Qidiruv...">
                    <template #append>
                        <div>
                            <Icon icon="ri-search-line" class="text-sm cursor-pointer" @click="getProducts" />
                        </div>
                    </template>
                </q-input>
            </div>
            <div class=" flex items-center justify-end gap-4">
                <q-pagination v-model="products_data.dialog_data.pagination.page" color="primary"
                    :max="products_data.dialog_data.pagination.max"
                    :max-pages="products_data.dialog_data.pagination.max_pages" boundary-numbers
                    @update:model-value="getProducts" />
                <q-btn color="primary" unelevated @click="showDialog('create')">
                    <q-tooltip>
                        Yangi tovar yaratish
                    </q-tooltip>
                    <Icon icon="ri-add-fill" class="text-lg" />
                </q-btn>
            </div>
        </div>
        <div class="mt-4">
            <q-table :columns="header" :rows="products_data.data" flat hide-pagination :rows-per-page-options="[0]"
                no-data-label="Ma'lumotlar mavjud emas!">
                <template #body-cell-images="props">
                    <q-td v-if="props.row.images.length">
                        <img :src="getUrlForFile(props.row.images[0].name)" alt="#banner" width="40">
                    </q-td>
                    <q-td v-else>
                        <div>
                            #
                        </div>
                    </q-td>
                </template>

                <template #body-cell-actions="props">
                    <q-td>
                        <q-btn unelevated outline round color="warning" dense class="mr-2"
                            @click="showDialog('edit', props.row)">
                            <Icon icon="ri-edit-line" />
                        </q-btn>
                        <q-btn unelevated outline round color="negative" dense @click="showDeleteDialog(props.row)">
                            <Icon icon="ri-delete-bin-line" />
                        </q-btn>
                    </q-td>
                </template>

                <template #body-cell-active="props">
                    <q-td>
                        <q-toggle v-model="props.row.active" color="primary"
                            @update:model-value="changeProductStatus(props.row)" />
                    </q-td>
                </template>
            </q-table>
        </div>

        <q-dialog v-model="products_data.dialog_data.model_value" persistent>
            <q-card class="p-4 min-w-[1200px]">
                <div class="text-xl">
                    {{ products_data.dialog_data.title }}
                </div>
                <div class="mt-4">
                    <q-file v-model="products_data.dialog_data.form.files" multiple label="Tovar rasmini yuklash"
                        outlined use-chips dense v-if="!products_data.dialog_data.editing.value">
                        <template #append>
                            <Icon icon="ri-upload-cloud-line" />
                        </template>
                    </q-file>
                    <q-select label="Kategoriyalar" outlined dense class="mt-2" clearable
                        v-model="products_data.dialog_data.form.categories.value"
                        :options="products_data.dialog_data.form.categories.data" emit-value map-options
                        option-value="id" option-label="name_uz" />
                    <q-input placeholder="Tovar nomi uz" outlined dense class="mt-2" clearable
                        v-model="products_data.dialog_data.form.name_uz" />
                    <q-input placeholder="Tovar nomi ru" outlined dense class="mt-2" clearable
                        v-model="products_data.dialog_data.form.name_ru" />
                    <q-input placeholder="Tovar narxi" outlined dense class="mt-2" clearable
                        v-model="products_data.dialog_data.form.price" type="number" />
                    <div class="mt-4">
                        <div class="ml-1 text-md">
                            Tovar ma'lumotlar UZ
                        </div>
                        <div class="mt-2">
                            <q-editor v-model="products_data.dialog_data.form.description_uz" :dense="$q.screen.lt.md"
                                :toolbar="[
                    [
                        {
                            label: $q.lang.editor.align,
                            icon: $q.iconSet.editor.align,
                            fixedLabel: true,
                            list: 'only-icons',
                            options: ['left', 'center', 'right', 'justify']
                        },
                        {
                            label: $q.lang.editor.align,
                            icon: $q.iconSet.editor.align,
                            fixedLabel: true,
                            options: ['left', 'center', 'right', 'justify']
                        }
                    ],
                    ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                    ['token', 'hr', 'link', 'custom_btn'],
                    ['print', 'fullscreen'],
                    [
                        {
                            label: $q.lang.editor.formatting,
                            icon: $q.iconSet.editor.formatting,
                            list: 'no-icons',
                            options: [
                                'p',
                                'h1',
                                'h2',
                                'h3',
                                'h4',
                                'h5',
                                'h6',
                                'code'
                            ]
                        },
                        {
                            label: $q.lang.editor.fontSize,
                            icon: $q.iconSet.editor.fontSize,
                            fixedLabel: true,
                            fixedIcon: true,
                            list: 'no-icons',
                            options: [
                                'size-1',
                                'size-2',
                                'size-3',
                                'size-4',
                                'size-5',
                                'size-6',
                                'size-7'
                            ]
                        },
                        {
                            label: $q.lang.editor.defaultFont,
                            icon: $q.iconSet.editor.font,
                            fixedIcon: true,
                            list: 'no-icons',
                            options: [
                                'default_font',
                                'arial',
                                'arial_black',
                                'comic_sans',
                                'courier_new',
                                'impact',
                                'lucida_grande',
                                'times_new_roman',
                                'verdana'
                            ]
                        },
                        'removeFormat'
                    ],
                    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                    ['undo', 'redo'],
                    ['viewsource']
                ]" :fonts="{
                    arial: 'Arial',
                    arial_black: 'Arial Black',
                    comic_sans: 'Comic Sans MS',
                    courier_new: 'Courier New',
                    impact: 'Impact',
                    lucida_grande: 'Lucida Grande',
                    times_new_roman: 'Times New Roman',
                    verdana: 'Verdana'
                }" />
                        </div>
                    </div>

                    <div class="mt-4">
                        <div class="ml-1 text-md">
                            Tovar ma'lumotlar RU
                        </div>
                        <div class="mt-2">
                            <q-editor v-model="products_data.dialog_data.form.description_ru" :dense="$q.screen.lt.md"
                                :toolbar="[
                    [
                        {
                            label: $q.lang.editor.align,
                            icon: $q.iconSet.editor.align,
                            fixedLabel: true,
                            list: 'only-icons',
                            options: ['left', 'center', 'right', 'justify']
                        },
                        {
                            label: $q.lang.editor.align,
                            icon: $q.iconSet.editor.align,
                            fixedLabel: true,
                            options: ['left', 'center', 'right', 'justify']
                        }
                    ],
                    ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                    ['token', 'hr', 'link', 'custom_btn'],
                    ['print', 'fullscreen'],
                    [
                        {
                            label: $q.lang.editor.formatting,
                            icon: $q.iconSet.editor.formatting,
                            list: 'no-icons',
                            options: [
                                'p',
                                'h1',
                                'h2',
                                'h3',
                                'h4',
                                'h5',
                                'h6',
                                'code'
                            ]
                        },
                        {
                            label: $q.lang.editor.fontSize,
                            icon: $q.iconSet.editor.fontSize,
                            fixedLabel: true,
                            fixedIcon: true,
                            list: 'no-icons',
                            options: [
                                'size-1',
                                'size-2',
                                'size-3',
                                'size-4',
                                'size-5',
                                'size-6',
                                'size-7'
                            ]
                        },
                        {
                            label: $q.lang.editor.defaultFont,
                            icon: $q.iconSet.editor.font,
                            fixedIcon: true,
                            list: 'no-icons',
                            options: [
                                'default_font',
                                'arial',
                                'arial_black',
                                'comic_sans',
                                'courier_new',
                                'impact',
                                'lucida_grande',
                                'times_new_roman',
                                'verdana'
                            ]
                        },
                        'removeFormat'
                    ],
                    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                    ['undo', 'redo'],
                    ['viewsource']
                ]" :fonts="{
                    arial: 'Arial',
                    arial_black: 'Arial Black',
                    comic_sans: 'Comic Sans MS',
                    courier_new: 'Courier New',
                    impact: 'Impact',
                    lucida_grande: 'Lucida Grande',
                    times_new_roman: 'Times New Roman',
                    verdana: 'Verdana'
                }" />
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-end gap-2 mt-4">
                    <q-btn color="primary" unelevated
                        :disable="!products_data.dialog_data.form.files.length || !products_data.dialog_data.form.categories.value || !products_data.dialog_data.form.name_uz || !products_data.dialog_data.form.name_ru || !products_data.dialog_data.form.price || !products_data.dialog_data.form.description_uz || !products_data.dialog_data.form.description_ru"
                        v-if="!products_data.dialog_data.editing.value" @click="sendForm">Yaratish</q-btn>
                    <q-btn color="primary" unelevated
                        :disable="!products_data.dialog_data.form.categories.value || !products_data.dialog_data.form.name_uz || !products_data.dialog_data.form.name_ru || !products_data.dialog_data.form.price || !products_data.dialog_data.form.description_uz || !products_data.dialog_data.form.description_ru"
                        v-else @click="sendForm">O'zgartirish</q-btn>
                    <q-btn color="negative" unelevated @click="products_data.dialog_data.model_value = false">Bekor
                        qilish</q-btn>
                </div>
            </q-card>
        </q-dialog>

        <q-dialog v-model="products_data.dialog_data.deleting.model_value" persistent>
            <q-card class="p-4">
                <div>
                    <span class="text-xl">
                        Ushbu tovarni o'chirishni tasdiqlaysizmi?
                    </span>
                </div>
                <div class="mt-6 flex justify-end gap-2">
                    <q-btn color="primary" unelevated @click="deleteProduct">Tasdiqlash</q-btn>
                    <q-btn color="negative" unelevated
                        @click="products_data.dialog_data.deleting.model_value = false">Bekor
                        qilish</q-btn>
                </div>
            </q-card>
        </q-dialog>
    </div>
</template>