<script setup lang="ts">
// imports
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { Loading } from 'quasar';
import { toast } from 'vue3-toastify';
import { admin, client } from '../../utils/axios';

// types
interface IUserDataTypes {
    data: any[],
    dialog_data: {
        title: string,
        model_value: boolean,
        deleting: {
            model_value: boolean,
            data: any
        },
        editing: {
            value: boolean,
            data: any
        },
        form: {
            full_name: string,
            username: string,
            new_username: string,
            password: string,
            new_password: string,
        }
    }
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
        name: 'full_name',
        required: true,
        label: 'Ism familya',
        field: 'full_name',
        align: 'left',
        sortable: true
    },
    {
        name: 'username',
        required: true,
        label: 'Foydlanuvchi nomi',
        field: 'username',
        align: 'left',
        sortable: true
    },
    {
        name: 'created_at',
        required: true,
        label: 'Yaratilgan sana',
        field: 'created_at',
        align: 'left',
        sortable: true
    },
    {
        name: 'updated_at',
        required: true,
        label: 'Yangilangan sana',
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
const user_data = ref<IUserDataTypes>({
    data: [],
    dialog_data: {
        title: '',
        model_value: false,
        deleting: {
            model_value: false,
            data: null
        },
        editing: {
            value: false,
            data: null
        },
        form: {
            full_name: '',
            username: '',
            new_username: '',
            password: '',
            new_password: '',
        }
    }
})

// functions
async function getUsers() {
    try {
        Loading.show()

        const { data } = await admin.get("/api/get-users")

        user_data.value.data = data
    } catch (err) {
        toast.error("Foydalanuvchini yaratishda xatolik yuz bderdi!")
    } finally {
        Loading.hide()
    }
}

function showDialog(action_name: string, data?: any) {
    if (action_name === "create") {
        user_data.value.dialog_data.editing.value = false
        user_data.value.dialog_data.title = "Yangi foydalanuvchi(admin) yaratish"
        user_data.value.dialog_data.form.full_name = ""
        user_data.value.dialog_data.form.username = ""
        user_data.value.dialog_data.form.password = ""
        user_data.value.dialog_data.model_value = true
    } else {
        user_data.value.dialog_data.editing.value = true
        user_data.value.dialog_data.editing.data = data
        user_data.value.dialog_data.title = "Foydalanuvchini(admin) yangilash"
        user_data.value.dialog_data.form.full_name = data.full_name
        user_data.value.dialog_data.form.username = data.username
        user_data.value.dialog_data.form.password = ""
        user_data.value.dialog_data.model_value = true
    }
}
async function sendForm() {
    if (!user_data.value.dialog_data.editing.value) {
        try {
            Loading.show()
            await client.post("/auth/register", {
                full_name: user_data.value.dialog_data.form.full_name,
                username: user_data.value.dialog_data.form.username,
                password: user_data.value.dialog_data.form.password,
                register_secret_key: import.meta.env.VITE_APP_REGISTER_KEY,
            })
            await getUsers()
            user_data.value.dialog_data.model_value = false
            toast.success("Foydalanuvchi muvaffaqiyatli yaratildi!")
        } catch (err) {
            toast.error("Foydalanuvchini yaratishda xatolik yuz berdi!")
        } finally {
            Loading.hide()
        }
    } else {
        try {
            Loading.show()
            await admin.put("/api/update-user", {
                user_id: user_data.value.dialog_data.editing.data?.id,
                full_name: user_data.value.dialog_data.form.full_name,
                username: user_data.value.dialog_data.form.username,
                password: user_data.value.dialog_data.form.password,
            })
            await getUsers()
            user_data.value.dialog_data.model_value = false
            toast.success("Foydalanuvchi muvaffaqiyatli yangilandi!")
        } catch (err) {
            toast.error("Foydalanuvchini yangilashda xatolik yuz berdi!")
        } finally {
            Loading.hide()
        }
    }
}
function showDeleteDialog(data: any) {
    user_data.value.dialog_data.deleting.data = data
    user_data.value.dialog_data.deleting.model_value = true
}
async function deleteUser() {
    try {
        Loading.show()
        await admin.delete("/api/delete-user", {
            params: {
                user_id: user_data.value.dialog_data.deleting.data?.id,
            }
        })
        await getUsers()
        user_data.value.dialog_data.deleting.model_value = false
        toast.success("Foydalanuvchi muvaffaqiyatli o'chirildi!")
    } catch (err) {
        toast.error("Foydalanuvchini o'chirishda xatolik yuz berdi!")
    } finally {
        Loading.hide()
    }
}


// on mounted
onMounted(() => {
    getUsers()
})

</script>
<template>
    <div>
        <div class="flex items-center justify-end">
            <q-btn color="primary" unelevated @click="showDialog('create')">
                <q-tooltip>
                    Yangi admin yaratish
                </q-tooltip>
                <Icon icon="ri-add-fill" class="text-lg" />
            </q-btn>
        </div>

        <div class="mt-4">
            <q-table :columns="header" :rows="user_data.data" flat hide-pagination :rows-per-page-options="[0]"
                no-data-label="Ma'lumotlar mavjud emas!">
                <template #body-cell-actions="props">
                    <q-td>
                        <q-btn unelevated outline round color="warning" dense class="mr-2"
                            @click="showDialog('update', props.row)">
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

            <q-dialog v-model="user_data.dialog_data.model_value" persistent>
                <q-card class="p-4 w-[500px]">
                    <div class="text-xl">
                        {{ user_data.dialog_data.title }}
                    </div>
                    <div class="mt-4">
                        <q-input placeholder="Ism familya*" outlined dense class="mt-2" clearable
                            v-model="user_data.dialog_data.form.full_name" />
                        <q-input placeholder="Foydalanuvchi nomi*" outlined dense class="mt-2"
                            v-model="user_data.dialog_data.form.username" clearable />
                        <q-input placeholder="Parol*" outlined dense class="mt-2"
                            v-model="user_data.dialog_data.form.password" clearable />
                    </div>
                    <div class="flex items-center justify-end gap-2 mt-4">
                        <q-btn color="primary" unelevated
                            :disable="!user_data.dialog_data.form.full_name || !user_data.dialog_data.form.username || !user_data.dialog_data.form.password"
                            v-if="!user_data.dialog_data.editing.value" @click="sendForm">Yaratish</q-btn>
                        <q-btn color="primary" unelevated
                            :disable="!user_data.dialog_data.form.full_name || !user_data.dialog_data.form.username || !user_data.dialog_data.form.password"
                            v-else @click="sendForm">O'zgartirish</q-btn>
                        <q-btn color="negative" unelevated @click="user_data.dialog_data.model_value = false">Bekor
                            qilish</q-btn>
                    </div>
                </q-card>
            </q-dialog>

            <q-dialog v-model="user_data.dialog_data.deleting.model_value" persistent>
                <q-card class="p-4">
                    <div>
                        <span class="text-xl">
                            Ushbu foydalanuvchini(admin) o'chirishni tasdiqlaysizmi?
                        </span>
                    </div>
                    <div class="mt-6 flex justify-end gap-2">
                        <q-btn color="primary" unelevated @click="deleteUser">Tasdiqlash</q-btn>
                        <q-btn color="negative" unelevated
                            @click="user_data.dialog_data.deleting.model_value = false">Bekor
                            qilish</q-btn>
                    </div>
                </q-card>
            </q-dialog>
        </div>
    </div>
</template>