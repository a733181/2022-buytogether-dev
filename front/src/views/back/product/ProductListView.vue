<template>
  <div class="container py-20">
    <div class="flex items-center justify-between mb-10">
      <Breadcrumbs>
        <p>商品管理</p>
      </Breadcrumbs>
      <Btn text="新增商品" @click="addProductHandler" />
    </div>
    <Select v-model="sortType" :select="sortMemberProduct" class="mb-8" />
    <div class="overflow-auto">
      <table class="w-full table-auto">
        <thead>
          <tr>
            <th class="border-2 p-2">主圖</th>
            <th class="border-2 p-2">名稱</th>
            <th class="border-2 p-2">價格</th>
            <th class="border-2 p-2">分類</th>
            <th class="border-2 p-2">上下架</th>
            <th class="border-2 p-2">銷量</th>
            <th class="border-2 p-2">剩餘數量</th>
            <th class="border-2 p-2">設定</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filterData" :key="item._id">
            <td class="border-2 p-2">
              <img
                :src="item.image"
                :alt="item.name"
                class="w-32 h-24 rounded-lg mx-auto object-cover"
              />
            </td>
            <td class="border-2 p-2 text-center">{{ item.name }}</td>
            <td class="border-2 p-2 text-center">{{ item.price }}</td>
            <td class="border-2 p-2 text-center">{{ item.category }}</td>
            <td
              class="border-2 p-2 text-center"
              :class="{ 'text-red-400': !item.isSell }"
            >
              {{ item.isSell ? '上架' : '下架' }}
            </td>
            <td class="border-2 p-2 text-center">{{ item.sales }}</td>
            <td class="border-2 p-2 text-center">
              {{ item.maxNumber - item.sales }}
            </td>
            <td class="border-2 p-2">
              <div
                class="flex gap-4 items-center justify-center flex-col lg:flex-row"
              >
                <img
                  v-if="item.status !== 2"
                  src="@/assets/svg/edit.svg"
                  class="w-6 hover:opacity-60"
                  @click="editProductHandler(item._id)"
                />
                <img
                  src="@/assets/svg/delete.svg"
                  class="w-6 hover:opacity-60"
                  @click="deleteProductHandler(item._id)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Select from '@/components/ui/TheSelect.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useProductsStore } from '@/stores/products';
import { useCategoryStore } from '@/stores/category';

const products = useProductsStore();
const {
  getAllProductHandler,
  addProductHandler,
  editProductHandler,
  deleteProductHandler,
} = products;
const { listProduct } = storeToRefs(products);
const { sortMemberProduct } = useCategoryStore();

const sortType = ref(sortMemberProduct[0]);

getAllProductHandler();

const filterData = computed(() => {
  if (sortType.value === sortMemberProduct[0]) {
    return listProduct.value;
  }

  if (sortType.value === sortMemberProduct[1]) {
    return listProduct.value.filter((item) => item.isSell && item.status !== 2);
  }
  if (sortType.value === sortMemberProduct[2]) {
    return listProduct.value.filter(
      (item) => item.maxNumber - item.sales === 0 && item.status !== 2
    );
  }

  if (sortType.value === sortMemberProduct[3]) {
    return listProduct.value.filter(
      (item) => !item.isSell && item.status !== 2
    );
  }

  if (sortType.value === sortMemberProduct[4]) {
    return listProduct.value.filter((item) => item.status === 2);
  }
});
</script>
