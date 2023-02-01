<template>
  <div class="container py-20">
    <div class="flex justify-center items-center gap-5 flex-wrap mb-10">
      <Tab tab="全部" :active="activeTab" @click="activeTab = '全部'" />
      <Tab
        v-for="(item, index) in productCategory"
        :tab="item"
        :key="index"
        :active="activeTab"
        @click="activeTab = item"
      />
    </div>
    <Breadcrumbs class="mb-10">
      <p>商城</p>
    </Breadcrumbs>
    <div class="grid lg:grid-cols-4 gap-5 mb-10">
      <Card v-for="item in filterProduct" :key="item._id" :data="item" />
    </div>
    <Pagination />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Tab from '@/components/ui/TheTab.vue';
import Card from '@/components/ui/TheCard.vue';
import Pagination from '@/components/ui/ThePagination.vue';

import { useCategoryStore } from '@/stores/category';
import { useProductsStore } from '@/stores/products';

const products = useProductsStore();
const category = useCategoryStore();
const { productCategory } = category;
const { getAllSellProdcutHandler } = products;
const { allSellProduct } = storeToRefs(products);

getAllSellProdcutHandler();

const activeTab = ref('全部');

const filterProduct = computed(() => {
  if (activeTab.value === '全部') {
    return allSellProduct.value;
  } else {
    return allSellProduct.value.filter(
      (item) => item.category === activeTab.value
    );
  }
});
</script>
