<script setup lang="ts">
// imports
import { Icon } from "@iconify/vue/dist/iconify.js";
import { Loading } from "quasar";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import { client } from "../../utils/axios";
import { CreateUrl } from "../../modules/create-url";
import { useRouter } from "vue-router";

// lang
const { locale } = useI18n();
const t = useI18n();

// router
const router = useRouter();

// data
const search = ref<string>("");
const categories = ref<any[]>([]);
const desktop_drawer = ref<boolean>(false);
const mobile_drawer = ref<boolean>(false);

// functions
function changeLang(lang: string) {
  if (lang === "uz") {
    localStorage.setItem("lang", "ru");
    window.location.reload();
  } else {
    localStorage.setItem("lang", "uz");
    window.location.reload();
  }
}
async function getCategories() {
  try {
    Loading.show();
    const { data } = await client.get("/api/get-categories", {
      params: {
        lang: localStorage.getItem("lang") || "uz",
      },
    });
    categories.value = data.data;
  } catch (err) {
    toast.error(t.t("bars.messages.get_categories_error_message"));
  } finally {
    Loading.hide();
  }
}
function showDrawer(action_name: string) {
  if (action_name === "desktop") {
    desktop_drawer.value = true;
  } else {
    mobile_drawer.value = true;
  }
}
function searchProducts() {
  router.push({
    path: "/products",
    query: {
      search: search.value,
      category_id: "",
      category_name: "",
    },
  });
}
function goToWithCategory(category_data: any, device_name: string) {
  if (device_name === "desktop") {
    desktop_drawer.value = false;
    router.push({
      path: "/products",
      query: {
        search: "",
        category_id: category_data.id,
        category_name: category_data.category_name,
      },
    });
  } else {
    mobile_drawer.value = false;
    router.push({
      path: "/products",
      query: {
        search: "",
        category_id: category_data.id,
        category_name: category_data.category_name,
      },
    });
  }
}

onMounted(() => {
  getCategories();
});
</script>

<template>
  <div>
    <div class="desktop">
      <div class="left flex items-center justify-start py-4">
        <div
          class="text-xl cursor-pointer select-none text-[#111CEF] font-semibold"
          @click="$router.push('/')"
        >
          ECOMIFY
        </div>

        <div
          class="category_button ml-6 px-4 py-[10px] gap-2 rounded-md cursor-pointer select-none"
          @click="showDrawer('desktop')"
        >
          <div>
            <Icon icon="ri-menu-4-line" />
          </div>
          <div>
            {{ $t("bars.category_title") }}
          </div>
        </div>

        <div class="ml-4 w-[250px]">
          <q-input
            v-model="search"
            outlined
            dense
            :placeholder="t.t('bars.search')"
            class="overflow-hidden"
            @keyup.enter="searchProducts"
          >
            <template #append>
              <div
                class="bg-[#111CEF] text-sm text-white absolute right-0 top-0 bottom-0 rounded-tr-md rounded-br-md flex items-center justify-center cursor-pointer select-none"
                @click="searchProducts"
              >
                <span class="text-xs px-2">
                  {{ $t("bars.btn_search_text") }}
                </span>
              </div>
            </template>
          </q-input>
        </div>
      </div>
      <div class="right flex items-center justify-end py-4">
        <div
          class="border border-[#111CEF] rounded-xl overflow-hidden flex items-center justify-center px-2 py-1 gap-2 cursor-pointer select-none"
          v-if="locale !== 'uz'"
          @click="changeLang(locale)"
        >
          <img src="../../assets/lang-images/uz.svg" alt="#uz" width="28" />
          <div>UZ</div>
        </div>
        <div
          class="border border-[#111CEF] rounded-xl overflow-hidden flex items-center justify-center px-2 py-1 gap-2 cursor-pointer select-none"
          v-else
          @click="changeLang(locale)"
        >
          <img src="../../assets/lang-images/ru.svg" alt="#ru" width="28" />
          <div>RU</div>
        </div>
      </div>
    </div>

    <div class="mobile flex items-center justify-between px-2 py-2">
      <div>
        <div
          class="category_button px-4 py-[10px] gap-2 rounded-md cursor-pointer select-none"
          @click="showDrawer('mobile')"
        >
          <div>
            <Icon icon="ri-menu-4-line" />
          </div>
          <div>
            {{ $t("bars.category_title") }}
          </div>
        </div>
      </div>
      <div>
        <div class="ml-4 w-[190px]">
          <q-input
            v-model="search"
            outlined
            dense
            :placeholder="t.t('bars.search')"
            class="overflow-hidden"
            @keyup.enter="searchProducts"
          >
            <template #append>
              <div
                class="bg-[#111CEF] text-sm text-white absolute right-0 top-0 bottom-0 rounded-tr-md rounded-br-md flex items-center justify-center cursor-pointer select-none"
                @click="searchProducts"
              >
                <span class="text-xs px-2">
                  {{ $t("bars.btn_search_text") }}
                </span>
              </div>
            </template>
          </q-input>
        </div>
      </div>
    </div>
  </div>
  <q-layout style="position: absolute" v-if="desktop_drawer">
    <q-drawer
      v-model="desktop_drawer"
      overlay
      ref="target"
      :width="500"
      behavior="mobile"
      persistent
    >
      <div class="px-4 pt-4 text-xl flex items-center justify-between">
        <div>
          {{ $t("bars.nav_category_title") }}
        </div>
        <div>
          <Icon
            icon="ri-close-line"
            class="cursor-pointer"
            @click="desktop_drawer = false"
          />
        </div>
      </div>
      <div class="drawer flex items-center gap-4 p-4">
        <div
          :class="
            category.id == $route.query.category_id
              ? `flex items-center gap-2 border text-[#111CEF] border-[#111CEF] p-2 rounded-md cursor-pointer select-none`
              : 'flex items-center gap-2 border hover:text-[#111CEF] hover:border-[#111CEF] p-2 rounded-md cursor-pointer select-none'
          "
          v-for="category of categories"
          @click="goToWithCategory(category, 'desktop')"
        >
          <img
            :src="CreateUrl(category.images[0].name)"
            alt="#category"
            width="40"
          />
          <div class="text-lg">
            {{ category.category_name }}
          </div>
        </div>
      </div>
    </q-drawer>
  </q-layout>

  <q-layout view="hHh lpR fFf" style="position: absolute" v-if="mobile_drawer">
    <q-drawer
      v-model="mobile_drawer"
      overlay
      ref="target"
      :width="350"
      behavior="mobile"
    >
      <div class="flex items-center justify-end pt-2 pr-2">
        <Icon
          icon="ri-close-line"
          class="cursor-pointer text-lg"
          @click="mobile_drawer = false"
        />
      </div>
      <div class="px-4 text-xl flex items-center justify-between">
        <div
          class="text-xl cursor-pointer select-none text-[#111CEF] font-semibold"
          @click="$router.push('/')"
        >
          ECOMIFY
        </div>

        <div>
          <div class="right flex items-center justify-end py-4">
            <div
              class="border border-[#111CEF] rounded-xl overflow-hidden flex items-center justify-center px-2 py-1 gap-2 cursor-pointer select-none"
              v-if="locale !== 'uz'"
              @click="changeLang(locale)"
            >
              <img src="../../assets/lang-images/uz.svg" alt="#uz" width="28" />
              <div class="text-sm">UZ</div>
            </div>
            <div
              class="border border-[#111CEF] rounded-xl overflow-hidden flex items-center justify-center px-2 py-1 gap-2 cursor-pointer select-none"
              v-else
              @click="changeLang(locale)"
            >
              <img src="../../assets/lang-images/ru.svg" alt="#ru" width="28" />
              <div class="text-sm">RU</div>
            </div>
          </div>
        </div>
      </div>
      <div class="drawer gap-4 p-4">
        <div
          :class="
            category.id == $route.query.category_id
              ? 'gap-2 text-[#111CEF] border-[#111CEF] rounded-md cursor-pointer select-none'
              : 'gap-2 active:text-[#111CEF] active:border-[#111CEF] rounded-md cursor-pointer select-none'
          "
          v-for="category of categories"
        >
          <div
            class="text-md mt-2 border transition-all rounded-md px-2 py-1 flex items-center gap-2"
            @click="goToWithCategory(category, 'mobile')"
          >
            <div>
              <img
                :src="CreateUrl(category.images[0].name)"
                alt="#category"
                width="20"
              />
            </div>
            <div>
              {{ category.category_name }}
            </div>
          </div>
        </div>
      </div>
    </q-drawer>
  </q-layout>
</template>

<style scoped lang="scss">
@media screen and (min-width: 480px) {
  .desktop {
    display: block !important;
    display: flex !important;
    justify-items: center;
    justify-content: space-between;
  }

  .mobile {
    display: none !important;
  }
}

@media screen and (max-width: 580px) {
  .desktop {
    display: none !important;
  }

  .mobile {
    display: flex !important;
  }
}

.category_button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111cef;
  color: #fff;
  transition: all 0.3s;
}

.category_button:hover {
  background: #111cefda;
}

.category_button:active {
  background: #111cefc9;
}
</style>
