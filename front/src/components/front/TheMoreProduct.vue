<template>
  <p class="mb-6 text-2xl pb-2 border-b-2 border-primary">更多商品</p>
  <swiper
    v-if="sellMoreProduct.length"
    :loop="true"
    :spaceBetween="30"
    :autoHeight="true"
    :breakpoints="swiperOptions"
    class="mb-10"
  >
    <swiper-slide v-for="item in sellMoreProduct" :key="item._id">
      <Card :data="item" class="h-full" />
    </swiper-slide>
  </swiper>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

import Card from '@/components/ui/TheCard.vue';

import { useProductsStore } from '@/stores/products';

const props = defineProps({
  category: {
    type: String,
  },
});

const product = useProductsStore();
const { getMoreSellProductsHandler } = product;
const { sellMoreProduct } = storeToRefs(product);

onMounted(() => {
  if (props) getMoreSellProductsHandler(props.category);
});

const swiperOptions = {
  1024: {
    slidesPerView: 4,
  },
  600: {
    slidesPerView: 2,
  },
};
</script>

<style scoped>
.swiper {
  width: 100%;
  height: 100%;
}
.swiper-slide {
  height: 100%;
}
</style>
