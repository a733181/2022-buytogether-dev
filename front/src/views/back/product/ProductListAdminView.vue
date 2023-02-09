<template>
  <div class="container py-20">
    <Breadcrumbs class="mb-10">
      <p>商品管理</p>
    </Breadcrumbs>
    <Select v-model="sortType" :select="sortMemberProduct" class="mb-8" />
    <div class="overflow-auto">
      <table class="w-full table-auto">
        <thead>
          <tr>
            <th class="border-2 p-2">會員ID</th>
            <th class="border-2 p-2">主圖</th>
            <th class="border-2 p-2">名稱</th>
            <th class="border-2 p-2">價格</th>
            <th class="border-2 p-2">分類</th>
            <th class="border-2 p-2">上下架</th>
            <th class="border-2 p-2">銷量</th>
            <th class="border-2 p-2">剩餘數量</th>
            <th class="border-2 p-2">檢舉</th>
            <th class="border-2 p-2">設定</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filterData" :key="item._id">
            <td class="border-2 p-2 text-center">
              {{ item.userId?._id }}
            </td>
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
            <td class="border-2 p-2 text-center">
              <p
                :class="{
                  'text-primary cursor-pointer hover:opacity-60':
                    showReportsHanlder(item._id).length > 0,
                }"
                @click="clickShowModelHandler(item._id)"
              >
                {{ showReportsHanlder(item._id).length }}
              </p>
            </td>
            <td class="border-2 p-2">
              <div
                class="flex gap-4 items-center justify-center flex-col lg:flex-row"
              >
                <img
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
    <Model>
      <Btn
        text="下架商品"
        class="mr-5"
        @click="reportsProductHandler(2)"
        :disabled="productStatus === 2"
        :class="{ 'disabled: opacity-50': productStatus === 2 }"
      />
      <Btn
        text="上架商品"
        @click="reportsProductHandler(0)"
        :disabled="productStatus !== 2"
        :class="{ 'disabled: opacity-50': productStatus !== 2 }"
      />
      <div class="overflow-auto">
        <table class="mt-10 w-full table-auto text-center">
          <thead>
            <tr>
              <td class="border-2 p-2">檢舉者會員ID</td>
              <td class="border-2 p-2">訊息</td>
              <td class="border-2 p-2">建立日期</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in showReportsList" :key="item._id">
              <td class="border-2 p-2">{{ item.userId }}</td>
              <td class="border-2 p-2">{{ item.message }}</td>
              <td class="border-2 p-2">
                {{ new Date(item.createDate).toLocaleDateString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Model>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Select from '@/components/ui/TheSelect.vue';
import Model from '@/components/ui/TheModel.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useProductsStore } from '@/stores/products';
import { useCategoryStore } from '@/stores/category';
import { useReportsStore } from '@/stores/reports';
import { useModelStore } from '@/stores/model';

const products = useProductsStore();
const {
  getAdminProductHandler,
  deleteProductHandler,
  editProductHandler,
  changeStatusProductHandler,
} = products;
const { sortMemberProduct } = useCategoryStore();
const reports = useReportsStore();
const { reports: reportsList } = storeToRefs(reports);
const { toggleShow } = storeToRefs(useModelStore());
getAdminProductHandler();
const { listProduct } = storeToRefs(products);

const sortType = ref(sortMemberProduct[0]);
const showReportsList = ref([]);
const productStatus = ref();

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

const showReportsHanlder = (productId) => {
  return reportsList.value.filter((item) => item.productId === productId);
};

const clickShowModelHandler = (productId) => {
  const showData = showReportsHanlder(productId);
  if (showData.length === 0) return;
  toggleShow.value = true;
  showReportsList.value = showData;
  const index = listProduct.value.findIndex((item) => item._id === productId);
  productStatus.value = listProduct.value[index].status;
};

const reportsProductHandler = (number) => {
  changeStatusProductHandler({
    id: showReportsList.value[0].productId,
    status: number,
  });
  toggleShow.value = false;
};
</script>
