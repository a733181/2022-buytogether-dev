<template>
  <div class="container py-20">
    <Breadcrumbs class="mb-10">
      <div class="flex">
        <RouterLink to="/products" class="hover:scale-105">商城</RouterLink>
        <p>&ensp;/&ensp;{{ sellProdcut.name }}</p>
      </div>
    </Breadcrumbs>
    <div class="flex items-center gap-12">
      <img
        class="rounded-xl h-96 object-cover w-1/2 lg:w-[60%]"
        :src="sellProdcut.image"
        :alt="sellProdcut.name"
      />
      <div class="flex flex-col gap-8 lg:w-[33%]">
        <div class="space-y-8 lg:w-1/2 mx-auto">
          <h1 class="text-3xl">{{ sellProdcut.name }}</h1>
          <p>
            剩餘數量：
            <span>{{ sellProdcut.remaining }}</span>
          </p>
          <div class="flex items-center justify-between">
            <img
              src="@/assets/svg/minus.svg"
              class="w-5 hover:opacity-60"
              @click="changeQuantity(-1)"
            />
            <p>{{ quantity }}</p>
            <img
              src="@/assets/svg/plus.svg"
              class="w-5 hover:opacity-60"
              @click="changeQuantity(1)"
            />
          </div>
          <Btn
            text="加入購物車"
            class="w-full"
            @click="clickAddCartHandler({ id: sellProdcut._id, quantity })"
          />
        </div>
      </div>
    </div>
    <div class="h-2 bg-gray-500 my-10 rounded-md"></div>
    <div class="flex gap-8 mb-10">
      <Tab
        tab="商品詳情"
        class="w-1/2 text-center"
        :active="activeTab"
        @click="activeTab = '商品詳情'"
      />
      <Tab
        tab="問與答"
        class="w-1/2 text-center"
        :active="activeTab"
        @click="activeTab = '問與答'"
      />
    </div>
    <div v-if="activeTab === '商品詳情'">
      <div class="mb-10">
        <h2 class="text-2xl mb-5">商品描述</h2>
        <p class="whitespace-pre">{{ sellProdcut.description }}</p>
      </div>
      <div v-if="sellProdcut.youtubeId" class="mb-10">
        <Youtube :data="sellProdcut.youtubeId" />
      </div>
      <div class="mb-10">
        <h2 class="text-2xl mb-5">商品圖片</h2>
        <img
          v-for="(src, index) in sellProdcut.images"
          :src="src"
          :key="index"
          class="w-1/2 mx-auto mt-6"
        />
      </div>
    </div>
    <div v-if="activeTab === '問與答'">
      <form @submit.prevent="submitHandler">
        <div class="mb-6">
          <Textarea
            v-model="form.message"
            title="訊息"
            :error="error.message.error"
            :errorText="error.message.value"
            @click="inputText"
          />
        </div>
        <div class="w-1/3 ml-auto">
          <Btn status="submit" text="確定" class="w-full" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ref, reactive } from 'vue';
import validator from 'validator';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Btn from '@/components/ui/TheBtn.vue';
import Tab from '@/components/ui/TheTab.vue';
import Youtube from '@/components/ui/YouToLink.vue';
import Textarea from '@/components/ui/TheTextarea.vue';

import { useProductsStore } from '@/stores/products';
import { useCartStore } from '@/stores/carts';
import { useUserStore } from '@/stores/users';
import { useMessageStore } from '@/stores/messages';

const route = useRoute();

const { clickAddCartHandler } = useCartStore();
const product = useProductsStore();
const { getSellProdctHander } = product;
const { sellProdcut } = storeToRefs(product);
const { sumbitMessageHandler } = useMessageStore();
getSellProdctHander(route.params.id);

const { isLoginHandler } = useUserStore();

const quantity = ref(1);

const activeTab = ref('問與答');

const changeQuantity = (num) => {
  if (quantity.value + num <= 0) {
    quantity.value = 1;
    return;
  }
  if (quantity.value + num > sellProdcut.value.remaining) {
    quantity.value = sellProdcut.value.remaining;
    return;
  }
  quantity.value += num;
};

const error = reactive({
  message: {
    error: false,
    value: '',
  },
});

const form = reactive({
  message: '',
  prodcutId: route.params.id,
});

const inputText = () => {
  isLoginHandler();
  error.message.error = false;
};

const validatorFormHandler = () => {
  if (validator.isEmpty(form.message)) {
    error.message.value = '為必填';
    error.message.error = true;
    return true;
  }
  return false;
};

const submitHandler = () => {
  if (validatorFormHandler()) return;
  sumbitMessageHandler(form);
};
</script>
