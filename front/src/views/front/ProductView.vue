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
            :disabled="isLoadingAddCart"
            :loading="isLoadingAddCart"
            @click="clickAddCartBtnHanlder({ id: sellProdcut._id, quantity })"
          />
        </div>
      </div>
    </div>
    <div class="h-2 bg-gray-500 my-10 rounded-md"></div>
    <div class="flex gap-8 mb-10">
      <Tab
        tab="商品詳情"
        class="w-1/2"
        :active="activeTab"
        @click="activeTab = '商品詳情'"
      />
      <Tab
        tab="問與答"
        class="w-1/2"
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
      <ul v-if="messageProduct.length" class="mb-6">
        <li
          v-for="item in messageProduct"
          :key="item._id"
          class="border-2 rounded-lg mb-2 px-4 py-2"
        >
          <div class="w-4/5 whitespace-pre">
            <p>問：</p>
            <p class="ml-2 whitespace-pre">{{ item.message }}</p>
          </div>
          <div class="ml-auto w-4/5 text-end">
            <p>團主答：</p>
            <p class="ml-2">{{ item.reply || '' }}</p>
          </div>
        </li>
      </ul>
      <Pagination
        v-if="messagePage.total > 1"
        class="ml-auto"
        :total="messagePage.total"
        :current="messagePage.current"
        @current="changePageHandler"
      />
      <SendMessage @message="submitHandler" :isLoading="isLoadingMessage" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ref, onUnmounted } from 'vue';

import Btn from '@/components/ui/TheBtn.vue';
import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Tab from '@/components/ui/TheTab.vue';
import Youtube from '@/components/ui/YouToLink.vue';
import SendMessage from '@/components/ui/SendProductMessage.vue';
import Pagination from '@/components/ui/ThePagination.vue';

import { useProductsStore } from '@/stores/products';
import { useCartStore } from '@/stores/carts';
import { useMessageStore } from '@/stores/messages';

const route = useRoute();

const { clickAddCartHandler } = useCartStore();
const product = useProductsStore();
const message = useMessageStore();
const { getSellProdctHander } = product;
const { sellProdcut } = storeToRefs(product);
const { sumbitMessageHandler, getProductMessageHandler } = message;
const { messageProduct, messagePage } = storeToRefs(message);
getSellProdctHander(route.params.id);
getProductMessageHandler(route.params.id);

const isLoadingMessage = ref(false);
const isLoadingAddCart = ref(false);

const quantity = ref(1);

const activeTab = ref('商品詳情');

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

const submitHandler = async (form) => {
  isLoadingMessage.value = true;
  const newFrom = {
    message: form.message,
    prodcutId: route.params.id,
  };
  await sumbitMessageHandler(newFrom);
  isLoadingMessage.value = false;
};

const changePageHandler = (page) => {
  messagePage.value.current = page;
  getProductMessageHandler(route.params.id);
};

const clickAddCartBtnHanlder = async (data) => {
  isLoadingAddCart.value = true;
  await clickAddCartHandler(data);
  isLoadingAddCart.value = false;
};

onUnmounted(() => {
  messagePage.value.current = 1;
});
</script>
