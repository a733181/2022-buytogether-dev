<template>
  <div>
    <div v-if="!sellFatorite.length" class="text-2xl flex gap-8 justify-center">
      <h2>沒有收藏商品</h2>
      <RouterLink to="/" class="text-primary">前往首頁</RouterLink>
    </div>
    <div v-if="sellFatorite.length" class="flex">
      <div class="flex gap-5 flex-col mr-10 w-32">
        <Tab tab="全部" :active="activeTab" @click="activeTab = '全部'" />
        <Tab
          v-for="(item, index) in productCategory"
          :tab="item"
          :key="index"
          :active="activeTab"
          @click="activeTab = item"
        />
      </div>
      <div class="flex-1">
        <div class="grid lg:grid-cols-3 gap-5 mb-10">
          <Card v-for="item in filterProduct" :key="item._id" :data="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

import Tab from '@/components/ui/TheTab.vue';
import Card from '@/components/ui/TheCard.vue';

import { useCategoryStore } from '@/stores/category';
import { useProductsStore } from '@/stores/products';
const products = useProductsStore();
const category = useCategoryStore();
const { productCategory } = category;
const { sellFatorite } = storeToRefs(products);

const activeTab = ref('全部');

const filterProduct = computed(() => {
  if (!sellFatorite.value) return [];
  if (activeTab.value === '全部') {
    return sellFatorite.value;
  }
  return sellFatorite.value.filter((item) => item.category === activeTab.value);
});
</script>
