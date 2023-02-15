<template>
  <div class="container pt-44 lg:pt-32 pb-10">
    <Breadcrumbs class="mb-10">
      <div class="flex items-center">
        <RouterLink
          to="/"
          class="text-primary font-bold break-normal hover:opacity-60"
          >精選團購</RouterLink
        >
        <p>&ensp;/&ensp;</p>
        <p>{{ sellProduct.name }}</p>
      </div>
    </Breadcrumbs>
    <div class="flex flex-col lg:flex-row gap-8 items-stretch mb-20">
      <div class="lg:w-2/5 flex flex-col">
        <h1 class="font-bold text-2xl mb-3">{{ sellProduct.name }}</h1>
        <div class="mb-4 flex justify-between items-center">
          <p class="text-primary text-xl">${{ sellProduct.price }}</p>
          <p
            class="-mb-2 hover:opacity-60 text-gray-400"
            @click="clickBtnShowReportHandler"
          >
            檢舉
          </p>
        </div>
        <p class="mb-6">
          銷量：{{ sellProduct.maxNumber - sellProduct.remaining }}
        </p>
        <p class="mb-6 whitespace-pre-line">
          {{ sellProduct.description }}
        </p>
        <div v-if="sellProduct.userId" class="flex items-center gap-4 my-5">
          <p>團購主：</p>
          <img
            :src="sellProduct.userId.image"
            :alt="sellProduct.userId.name"
            class="w-16 h-16 rounded-full object-cover"
          />
          <p>{{ sellProduct.userId.name }}</p>
          <RouterLink
            :to="`/memberhome/${sellProduct.userId._id}`"
            class="text-primary"
            >更多商品</RouterLink
          >
        </div>
        <div class="mt-auto w-full">
          <div class="flex items-center justify-between mb-6">
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
            @click="clickAddCartBtnHanlder({ id: sellProduct._id, quantity })"
          />
        </div>
      </div>
      <div class="flex-1 -order-1 lg:order-1">
        <div class="relative h-[490px] mb-5">
          <div v-if="activeIndex === imagesLength + 1">
            <Youtube :data="sellProduct.youtubeId" />
          </div>
          <img
            v-else
            class="rounded-xl object-contain w-full h-full mb-5"
            :src="activeImage"
            :alt="sellProduct.name"
          />
          <img
            src="@/assets/svg/arrow.svg"
            alt="arrow"
            class="w-6 absolute top-1/2 left-0 -translate-y-1/2 hover:opacity-60"
            @click="changeImageIndex(-1)"
          />
          <img
            src="@/assets/svg/arrow.svg"
            alt="arrow"
            class="w-6 absolute rotate-180 top-1/2 right-0 -translate-y-1/2 hover:opacity-60"
            @click="changeImageIndex(1)"
          />
        </div>
        <div class="grid gap-2" :style="gridRow">
          <div>
            <img
              class="w-full h-full object-cover"
              :src="sellProduct.image"
              :alt="sellProduct.name"
              @click="activeIndex = 0"
            />
          </div>
          <div
            v-if="sellProduct.images"
            v-for="(src, index) in sellProduct.images"
          >
            <img
              :src="src"
              :key="index"
              class="w-full h-full object-cover"
              @click="activeIndex = index + 1"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mb-20">
      <p class="mb-6 text-2xl pb-2 border-b-2 border-primary">問與答</p>
      <ul v-if="messageProduct.length" class="mb-6">
        <li
          v-for="item in messageProduct"
          :key="item._id"
          class="border-2 rounded-lg mb-2 px-4 py-2"
        >
          <div class="w-4/5 whitespace-pre">
            <p>問：</p>
            <p class="ml-2 whitespace-pre-line">{{ item.message }}</p>
          </div>
          <div
            v-if="item.reply"
            class="ml-auto w-4/5 bg-gray-200 rounded-lg p-2 flex justify-end"
          >
            <p>團主答：</p>
            <p class="ml-2 whitespace-pre-line">{{ item.reply || '' }}</p>
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
      <div class="bg-gray-100 rounded-lg p-6">
        <p class="text-xl mb-4">提出問題</p>
        <p class="mb-4">為保障會員交易安全，留言請勿填寫個人資料。</p>
        <div class="bg-white rounded-lg">
          <SendMessage
            class="lg:w-1/2 mx-auto pt-2 pb-12 px-8"
            classText="h-52"
            @message="submitMessageHandler"
            :isLoading="isLoadingMessage"
          />
        </div>
      </div>
    </div>
    <Model>
      <SendMessage
        @message="submitReportHandler"
        class="lg:w-1/2 mx-auto"
        classText="h-40"
      />
    </Model>
    <TheMoreProduct :category="sellProduct.category" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ref, onUnmounted, computed, watch } from 'vue';

import Btn from '@/components/ui/TheBtn.vue';
import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Youtube from '@/components/ui/YouToLink.vue';
import SendMessage from '@/components/ui/SendProductMessage.vue';
import Pagination from '@/components/ui/ThePagination.vue';
import Model from '@/components/ui/TheModel.vue';
import TheMoreProduct from '@/components/front/TheMoreProduct.vue';

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
const { sellProduct } = storeToRefs(product);
const { sumbitMessageHandler, getProductMessageHandler } = message;
const { messageProduct, messagePage } = storeToRefs(message);
const { toggleShow } = storeToRefs(useModelStore());
const { isLoginHandler } = useUserStore();
const { createReporteHandler } = useReportsStore();
getSellProdctHander(route.params.id);
getProductMessageHandler(route.params.id);

watch(
  () => route.params.id,
  (value) => {
    if (value && route.path.includes('/products')) {
      getSellProdctHander(value);
      getProductMessageHandler(value);
    }
  }
);

const isLoadingMessage = ref(false);
const isLoadingAddCart = ref(false);

const quantity = ref(1);

const imagesLength = computed(() => {
  return sellProduct?.value.images ? sellProduct?.value.images.length : 0;
});

const activeIndex = ref(
  sellProduct.value.youtubeId ? imagesLength.value + 1 : 0
);

const activeImage = computed(() => {
  if (activeIndex.value === 0) {
    return sellProduct.value.image;
  } else {
    return sellProduct.value.images[activeIndex.value - 1];
  }
});

const gridRow = computed(() => {
  if (sellProduct?.value.images) {
    return `grid-template-columns: repeat(${
      imagesLength.value + 1
    }, minmax(0, 1fr));`;
  }
});

const changeImageIndex = (index) => {
  const isVedio = sellProduct.value.youtubeId ? true : false;
  const length = isVedio ? imagesLength.value + 1 : imagesLength.value;
  if (index === 1) {
    if (activeIndex.value >= length) {
      activeIndex.value = 0;
    } else {
      activeIndex.value++;
    }
  } else {
    if (activeIndex.value <= 0) {
      activeIndex.value = length;
    } else {
      activeIndex.value--;
    }
  }
};

const changeQuantity = (num) => {
  if (quantity.value + num <= 0) {
    quantity.value = 1;
    return;
  }
  if (quantity.value + num > sellProduct.value.remaining) {
    quantity.value = sellProduct.value.remaining;
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
