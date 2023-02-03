<template>
  <div class="container py-20">
    <div class="flex justify-center items-center gap-5 flex-wrap mb-10">
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
    <div class="flex items-center mb-10 justify-between">
      <Breadcrumbs>
        <p>商城</p>
      </Breadcrumbs>
      <div class="-mt-12 relative">
        <form @submit.prevent="submitHandler">
          <Input
            v-model="searchKey"
            :error="error.error"
            :errorText="error.value"
            @click="error.error = false"
          />
          <button
            type="sumbit"
            class="hover:opacity-50 absolute bottom-2 right-2"
            :class="{ 'bottom-8': error.error }"
          >
            <img src="@/assets/svg/search.svg" class="w-6 h-full" />
          </button>
        </form>
      </div>
    </div>
    <div class="grid lg:grid-cols-4 gap-5 mb-10">
      <Card v-for="item in allSellProduct" :key="item._id" :data="item" />
    </div>
    <!-- <Pagination /> -->
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed, reactive } from 'vue';
import validator from 'validator';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Tab from '@/components/ui/TheTab.vue';
import Card from '@/components/ui/TheCard.vue';
import Input from '@/components/ui/TheInput.vue';
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

const changeCategoryHandler = (tab) => {
  activeTab.value = tab;
  getAllSellProdcutHandler({ category: activeTab.value });
};

const error = reactive({
  error: false,
  value: '',
});

const searchKey = ref('');

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
  activeTab.value = '全部';
  getAllSellProdcutHandler({ key: searchKey.value });
};
</script>
