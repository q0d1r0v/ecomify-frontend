<script setup lang="ts">
// imports
import { Loading } from "quasar";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import { client } from "../utils/axios";
import { CreateUrl } from "../modules/create-url";
import { Icon } from "@iconify/vue/dist/iconify.js";
import { vMaska } from "maska/vue";
import { useI18n } from "vue-i18n";

// types
interface IDialogDataTypes {
  model_value: boolean;
  product_data: any;
  form: {
    full_name: string;
    address: string;
    phone_number: string;
    additional_phone_number: string;
    description: string;
  };
}

// i18n
const t = useI18n();

// route
const route = useRoute();

// data
const dialog_data = ref<IDialogDataTypes>({
  model_value: false,
  product_data: null,
  form: {
    full_name: "",
    address: "",
    phone_number: "",
    additional_phone_number: "",
    description: "",
  },
});
const product_data = ref<{
  product: any;
  images: any;
  product_description: any;
}>({
  images: [],
  product: null,
  product_description: "",
});

// functions
async function getProductData() {
  try {
    Loading.show();
    const { data } = await client.get("/api/show-order-product", {
      params: {
        product_id: route.query?.product_id,
        lang: localStorage.getItem("lang") || "uz",
      },
    });
    product_data.value = data.response.data;
  } catch (err) {
    toast.error(t.t("product.load_error_message"));
  } finally {
    Loading.hide();
  }
}
function changeIndex(image: any) {
  product_data.value.images.splice(0, 0, image);

  product_data.value.images = product_data?.value.images.filter(
    (value: any, index: any) =>
      product_data?.value.images.indexOf(value) === index
  );
}
function showOrderDialog() {
  dialog_data.value.form.full_name = "";
  dialog_data.value.form.address = "";
  dialog_data.value.form.phone_number = "";
  dialog_data.value.form.additional_phone_number = "";
  dialog_data.value.form.description = "";
  dialog_data.value.model_value = true;
}
async function sendForm() {
  try {
    Loading.show();
    await client.post("/api/create-order", {
      full_name: dialog_data.value.form.full_name,
      address: dialog_data.value.form.address,
      phone_number: dialog_data.value.form.phone_number,
      additional_phone_number: dialog_data.value.form.additional_phone_number,
      description: dialog_data.value.form.description,
      product_id: product_data.value.product?.id,
    });
    dialog_data.value.model_value = false;
    toast.success(t.t("product.create_order_message"));
  } catch (err) {
    toast.error(t.t("product.create_order_error_message"));
  } finally {
    Loading.hide();
  }
}

// onMounted
onMounted(() => {
  getProductData();
});
</script>

<template>
  <div class="min-h-screen">
    <div>
      <q-btn outline color="primary" @click="$router.go(-1)">
        <Icon icon="ri-arrow-left-line" />
      </q-btn>
    </div>
    <div
      class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 max-[630px]:grid-cols-1 gap-4 mt-4"
    >
      <div v-if="product_data.images.length">
        <div>
          <img
            :src="CreateUrl(product_data?.images[0].name)"
            alt="#product_image"
            width="400"
          />
        </div>
        <div
          v-if="product_data?.images.length > 1"
          class="flex items-center mt-4 gap-2"
        >
          <div
            v-for="image of product_data?.images"
            :key="image.id"
            class="border p-2"
          >
            <img
              :src="CreateUrl(image.name)"
              alt="#img"
              width="60"
              class="cursor-pointer"
              @click="changeIndex(image)"
            />
          </div>
        </div>
      </div>
      <div>
        <div class="text-xl font-bold">
          {{
            parseInt(product_data?.product?.price)
              .toLocaleString()
              .split(",")
              .join(" ")
          }}
          UZS
        </div>
        <div class="mt-4">
          <q-btn unelevated color="primary" @click="showOrderDialog">
            <div class="flex items-center gap-4">
              <div>
                {{ $t("product.order_btn_text") }}
              </div>
              <div class="text-xl">
                <Icon icon="ri-shopping-cart-line" />
              </div>
            </div>
          </q-btn>
        </div>
      </div>
    </div>

    <div class="mt-6 text-xs md:max-w-[1200px]">
      <div v-html="product_data.product_description"></div>
    </div>

    <q-dialog v-model="dialog_data.model_value" persistent>
      <q-card class="p-4 w-[500px]">
        <div class="text-xl">
          {{ $t("product.form.title") }}
        </div>
        <div class="mt-4">
          <q-input
            :placeholder="t.t('product.form.full_name')"
            outlined
            dense
            class="mt-2"
            clearable
            v-model="dialog_data.form.full_name"
          />
          <q-input
            :placeholder="t.t('product.form.address')"
            outlined
            dense
            class="mt-2"
            v-model="dialog_data.form.address"
            clearable
          />
          <q-input
            :placeholder="t.t('product.form.phone_number')"
            outlined
            dense
            class="mt-2"
            v-model="dialog_data.form.phone_number"
            clearable
            v-maska="'+998-##-###-##-##'"
          />
          <q-input
            :placeholder="t.t('product.form.additional_phone_number')"
            outlined
            dense
            class="mt-2"
            v-model="dialog_data.form.additional_phone_number"
            clearable
            v-maska="'+998-##-###-##-##'"
          />
          <q-input
            type="textarea"
            :placeholder="t.t('product.form.description')"
            outlined
            dense
            class="mt-2"
            v-model="dialog_data.form.description"
            clearable
          />
        </div>
        <div class="flex items-center justify-end gap-2 mt-4">
          <q-btn
            color="primary"
            unelevated
            :disable="
              !dialog_data.form.full_name ||
              !dialog_data.form.address ||
              !dialog_data.form.phone_number ||
              !dialog_data.form.description
            "
            @click="sendForm"
            >{{ $t("product.form.accept") }}</q-btn
          >
          <q-btn
            color="negative"
            unelevated
            @click="dialog_data.model_value = false"
            >{{ $t("product.form.cancel") }}</q-btn
          >
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
