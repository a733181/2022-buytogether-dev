<template>
  <div class="container pt-44 lg:pt-32 pb-10">
    <div class="mb-10">
      <Breadcrumbs>
        <span class="text-primary font-bold">精選團購</span>
        <span v-if="breadSearch">&ensp;/&ensp;{{ breadSearch }}</span>
      </Breadcrumbs>
    </div>
    <div class="flex mb-6 gap-7 items-center justify-between">
      <Select v-model="filter" :select="sortProduct" class="w-32 h-[44px]" />

      <form @submit.prevent="submitHandler" class="flex gap-5 items-center">
        <Input v-model="searchKey" class="-mt-10" />
        <Btn type="submit" className="btn-gray" text="搜尋" />
      </form>
    </div>

    <div class="flex">
      <div class="flex gap-5 flex-col mr-10 lg:w-32">
        <Tab
          tab="全部"
          :active="activeTab"
          @click="changeCategoryHandler('全部')"
        />
        <Tab
          v-for="(item, index) in productCategory"
          :tab="item"
          :key="index"
          :active="activeTab"
          @click="changeCategoryHandler(item)"
        />
      </div>
      <div class="flex-1">
        <div
          v-if="filterData.length"
          class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10"
        >
          <Card
            v-for="item in filterData"
            :key="item._id"
            :data="item"
            class="w-full"
          />
        </div>
        <p v-if="!filterData.length" class="text-3xl">找不到商品</p>
        <div class="w-min mx-auto">
          <Pagination
            v-if="productPage.total > 1"
            :total="productPage.total"
            :current="productPage.current"
            @current="changePageHandler"
          />
        </div>
      </div>
    </div>
    <Loaded :loaded="isLoad" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed, onUnmounted } from 'vue';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Tab from '@/components/ui/TheTab.vue';
import Select from '@/components/ui/TheSelect.vue';
import Card from '@/components/ui/TheCard.vue';
import Input from '@/components/ui/TheInput.vue';
import Pagination from '@/components/ui/ThePagination.vue';
import Btn from '@/components/ui/TheBtn.vue';
import Loaded from '@/components/ui/TheLoaded.vue';

import { useCategoryStore } from '@/stores/category';
import { useProductsStore } from '@/stores/products';

const products = useProductsStore();
const { productCategory, sortProduct } = useCategoryStore();
const { getAllSellProdcutHandler } = products;
const { allSellProduct, productPage } = storeToRefs(products);

const activeTab = ref('全部');
const breadSearch = ref('');
const filter = ref(sortProduct[0]);
const searchKey = ref('');
const isLoad = ref(true);

(async () => {
  await getAllSellProdcutHandler();
  isLoad.value = false;
})();

const filterData = computed(() => {
  if (filter.value === sortProduct[0]) {
    return allSellProduct.value;
  }
  const copydata = JSON.parse(JSON.stringify(allSellProduct.value));

  if (filter.value === sortProduct[1] || filter.value === sortProduct[2]) {
    return copydata.sort((itemA, itemB) => {
      if (filter.value === sortProduct[1]) {
        return itemA.price < itemB.price ? 1 : -1;
      }
      if (filter.value === sortProduct[2]) {
        return itemA.price < itemB.price ? -1 : 1;
      }
    });
  }
  if (filter.value === sortProduct[3] || filter.value === sortProduct[4]) {
    return copydata.sort((itemA, itemB) => {
      const sellNumberA = itemA.maxNumber - itemA.remaining;
      const sellNumberB = itemB.maxNumber - itemB.remaining;
      if (filter.value === sortProduct[3]) {
        return sellNumberA < sellNumberB ? 1 : -1;
      }
      if (filter.value === sortProduct[4]) {
        return sellNumberA < sellNumberB ? -1 : 1;
      }
    });
  }
});

const submitHandler = () => {
  if (searchKey.value) {
    getAllSellProdcutHandler({ key: searchKey.value });
    breadSearch.value = searchKey.value;
    searchKey.value = '';
  } else {
    cancelSearchHandler();
  }
};

const changeCategoryHandler = (tab) => {
  activeTab.value = tab;
  getAllSellProdcutHandler({ category: activeTab.value });
};

const cancelSearchHandler = () => {
  getAllSellProdcutHandler();
  breadSearch.value = '';
};

const changePageHandler = (page) => {
  productPage.value.current = page;
  getAllSellProdcutHandler({ category: activeTab.value });
};

onUnmounted(() => {
  productPage.value.current = 1;
});
</script>
