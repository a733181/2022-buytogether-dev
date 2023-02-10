<template>
  <div>
    <div class="container pt-32 pb-10">
      <Breadcrumbs class="mb-10">
        <div class="flex items-center">
          <RouterLink to="/" class="text-primary font-bold hover:opacity-60"
            >精選團購</RouterLink
          >
          <p>&ensp;/&ensp;{{ sellProdcut.name }}</p>
        </div>
      </Breadcrumbs>
      <div class="flex gap-8">
        <div class="w-2/5">
          <h1 class="font-bold text-2xl mb-3">{{ sellProdcut.name }}</h1>
          <p class="mb-6">${{ sellProdcut.price }}</p>
          <p class="mb-2">{{ sellProdcut.description }}</p>
          <p class="mb-2">
            銷量：{{ sellProdcut.maxNumber - sellProdcut.remaining }}
          </p>
          <div class="flex items-center justify-between mb-4">
            <img
              src="@/assets/svg/minus.svg"
              class="w-5 hover:opacity-60"
              @click="changeQuantity(-1)"
              alt="減少數量"
              title="減少數量"
            />
            <p>{{ quantity }}</p>
            <img
              src="@/assets/svg/plus.svg"
              class="w-5 hover:opacity-60"
              @click="changeQuantity(1)"
              alt="增加數量"
              title="增加數量"
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
        <div class="flex-1">
          <img
            class="rounded-xl h-96 object-cover w-full"
            :src="sellProdcut.image"
            :alt="sellProdcut.name"
          />
        </div>
      </div>
    </div>

    <div class="container pt-32 pb-10">
      <Breadcrumbs class="mb-10">
        <div class="flex">
          <RouterLink to="/" class="text-primary font-bold hover:opacity-60"
            >精選團購</RouterLink
          >
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
            <p>價格</p>
            <p>
              銷量：
              <!-- <span>{{ sellProdcut.remaining }}</span> -->
            </p>
            <div class="flex items-center justify-between">
              <img
                src="@/assets/svg/minus.svg"
                class="w-5 hover:opacity-60"
                @click="changeQuantity(-1)"
                alt="減少數量"
                title="減少數量"
              />
              <p>{{ quantity }}</p>
              <img
                src="@/assets/svg/plus.svg"
                class="w-5 hover:opacity-60"
                @click="changeQuantity(1)"
                alt="增加數量"
                title="增加數量"
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
        <img
          src="@/assets/svg/ellipsis-vertical.svg"
          alt="檢舉商品"
          title="檢舉商品"
          class="w-6 h-6 self-start hover:opacity-60"
          @click="clickBtnShowReportHandler"
        />
      </div>
      <!-- <div class="h-2 bg-gray-500 my-5 rounded-md"></div> -->
      <div v-if="sellProdcut.userId" class="flex items-center gap-4 my-5">
        <p>團購主：</p>
        <img
          :src="sellProdcut.userId.image"
          :alt="sellProdcut.userId.name"
          class="w-16 h-16 rounded-full object-cover"
        />
        <p>{{ sellProdcut.userId.name }}</p>
        <RouterLink
          :to="`/memberhome/${sellProdcut.userId._id}`"
          class="text-primary"
          >更多商品</RouterLink
        >
      </div>
      <!-- <div class="h-2 bg-gray-500 my-5 rounded-md"></div> -->
      <div class="flex gap-8 mb-10">
        <Tab
          tab="商品詳情"
          class="w-32"
          :active="activeTab"
          @click="activeTab = '商品詳情'"
        />
        <Tab
          tab="問與答"
          class="w-32"
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
        <SendMessage
          @message="submitMessageHandler"
          :isLoading="isLoadingMessage"
        />
      </div>
      <Model>
        <SendMessage @message="submitReportHandler" />
      </Model>
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
import Model from '@/components/ui/TheModel.vue';

import { useProductsStore } from '@/stores/products';
import { useCartStore } from '@/stores/carts';
import { useMessageStore } from '@/stores/messages';
import { useModelStore } from '@/stores/model';
import { useUserStore } from '@/stores/users';
import { useReportsStore } from '@/stores/reports';

const route = useRoute();

const { clickAddCartHandler } = useCartStore();
const product = useProductsStore();
const message = useMessageStore();
const { getSellProdctHander } = product;
const { sellProdcut } = storeToRefs(product);
const { sumbitMessageHandler, getProductMessageHandler } = message;
const { messageProduct, messagePage } = storeToRefs(message);
const { toggleShow } = storeToRefs(useModelStore());
const { isLoginHandler } = useUserStore();
const { createReporteHandler } = useReportsStore();
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

const submitMessageHandler = async (form) => {
  isLoadingMessage.value = true;
  const newFrom = {
    message: form.message,
    prodcutId: route.params.id,
  };
  await sumbitMessageHandler(newFrom);
  isLoadingMessage.value = false;
};

const clickBtnShowReportHandler = () => {
  if (!isLoginHandler()) return;
  toggleShow.value = !toggleShow.value;
};

const submitReportHandler = async (message) => {
  toggleShow.value = !toggleShow.value;
  const newFrom = {
    message: message.message,
    productId: route.params.id,
  };
  createReporteHandler(newFrom);
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
