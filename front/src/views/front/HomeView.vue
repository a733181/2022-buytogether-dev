<template>
  <div class="container py-20">
    <div class="mb-10">
      <Breadcrumbs>
        <span>首頁</span>
        <span v-if="breadSearch">&ensp;/&ensp;{{ breadSearch }}</span>
      </Breadcrumbs>
    </div>
    <div class="flex items-center mb-6 gap-7">
      <Select v-model="filter" :select="sortProduct" />
      <Tab
        v-if="!!breadSearch"
        tab="取消搜尋"
        class="mb-2"
        @click="cancelSearchHandler"
      />
      <div class="-mt-12 relative ml-auto">
        <form @submit.prevent="submitHandler">
          <Input
            v-model="searchKey"
            :error="error.error"
            :errorText="error.value"
            @click="error.error = false"
          />
          <button
            type="sumbit"
            class="hover:opacity-50 absolute bottom-[0.6rem] right-2"
            :class="{ 'bottom-[2.1rem]': error.error }"
          >
            <img src="@/assets/svg/search.svg" class="w-6 h-full" />
          </button>
        </form>
      </div>
    </div>

    <div class="flex">
      <div v-if="!breadSearch" class="flex gap-5 flex-col mr-10">
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
        <div class="grid lg:grid-cols-3 gap-5 mb-10">
          <Card
            v-for="item in filterData"
            :key="item._id"
            :data="item"
            class="w-full"
          />
        </div>
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
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, reactive, computed, onUnmounted } from 'vue';
import validator from 'validator';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Tab from '@/components/ui/TheTab.vue';
import Select from '@/components/ui/TheSelect.vue';
import Card from '@/components/ui/TheCard.vue';
import Input from '@/components/ui/TheInput.vue';
import Pagination from '@/components/ui/ThePagination.vue';

import { useCategoryStore } from '@/stores/category';
import { useProductsStore } from '@/stores/products';

const products = useProductsStore();
const { productCategory, sortProduct } = useCategoryStore();
const { getAllSellProdcutHandler } = products;
const { allSellProduct, productPage } = storeToRefs(products);

getAllSellProdcutHandler();

const activeTab = ref('全部');
const breadSearch = ref('');
const filter = ref(sortProduct[0]);
const searchKey = ref('');
const error = reactive({
  error: false,
  value: '',
});

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
      if (filter.value === sortProduct[3]) {
        return itemA.remaining < itemB.remaining ? 1 : -1;
      }
      if (filter.value === sortProduct[4]) {
        return itemA.remaining < itemB.remaining ? -1 : 1;
      }
    });
  }
});

const validatorFormHandler = () => {
  if (validator.isEmpty(searchKey.value)) {
    error.value = '搜尋為必填';
    error.error = true;
    return true;
  }

  return false;
};

const submitHandler = () => {
  if (validatorFormHandler()) return;
  getAllSellProdcutHandler({ key: searchKey.value });
  breadSearch.value = searchKey.value;
  searchKey.value = '';
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
