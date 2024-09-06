<script setup lang="ts">
// imports
import { Loading } from "quasar";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { client } from "../../utils/axios";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue/dist/iconify.js";

// types
interface IFormTypes {
  username: string;
  password: string;
}

// router
const router = useRouter();

// data
const form = ref<IFormTypes>({
  username: "",
  password: "",
});
const is_password = ref<boolean>(true);
// functions
async function signIn() {
  try {
    Loading.show();
    const { data } = await client.post("/auth/login", {
      username: form.value.username,
      password: form.value.password,
    });
    if (data?.status == 400) {
      toast.error("Kirishda xatolik yuz berdi!");
    } else {
      localStorage.setItem("access_token", data.response.access_token);
      localStorage.setItem("user", JSON.stringify(data.response.user));
      router.push("/admin/dashboard");
    }
  } catch (err) {
    toast.error("Kirishda xatolik yuz berdi!");
  } finally {
    Loading.hide();
  }
}
</script>

<template>
  <div class="parent-bg">
    <div class="card">
      <div class="login_text">KIRISH</div>

      <div class="form">
        <q-input
          v-model="form.username"
          placeholder="Foydalanuvchi nomi"
          outlined
          dense
          clearable
          @keyup.enter="signIn"
        />
        <q-input
          v-model="form.password"
          placeholder="Parol"
          outlined
          dense
          clearable
          :type="is_password ? 'password' : 'text'"
          class="mt-4"
          @keyup.enter="signIn"
        >
          <template #append>
            <div>
              <Icon
                :icon="is_password ? 'ri-eye-line' : 'ri-eye-off-line'"
                @click="is_password = !is_password"
                class="cursor-pointer"
              />
            </div>
          </template>
        </q-input>

        <div class="flex items-center justify-center mt-8">
          <q-btn
            size="md"
            unelevated
            color="primary"
            push
            class="!w-[140px]"
            :disable="!form.username || !form.password"
            @click="signIn"
          >
            Kirish
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.parent-bg {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f7fe;

  & .card {
    width: 600px;
    height: 400px;
    background: #fff;
    border-radius: 5px;

    & .login_text {
      text-align: center;
      margin-top: 20px;
      font-size: xx-large;
    }

    .form {
      margin-top: 40px;
      padding-left: 60px;
      padding-right: 60px;
    }
  }
}
</style>
