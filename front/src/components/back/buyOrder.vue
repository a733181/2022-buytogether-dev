<template>
  <div class="overflow-auto">
    <table class="mt-10 w-full table-auto">
      <thead>
        <tr>
          <th class="border-2 p-2">訂單編號</th>
          <th class="border-2 p-2">商品名稱</th>
          <th class="border-2 p-2">總量</th>
          <th class="border-2 p-2">總金額</th>
          <th class="border-2 p-2">是否付款</th>
          <th class="border-2 p-2">收件地址</th>
          <th class="border-2 p-2">付款帳戶</th>
          <th class="border-2 p-2">商品詳情</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in orderBuy" :key="item._id">
          <td class="border-2 p-2 text-center">{{ item._id }}</td>
          <td class="border-2 p-2 text-center">
            <p v-for="prod in item.products">{{ prod.productId.name }}</p>
          </td>
          <td class="border-2 p-2 text-center">
            {{ countyNum(item.products) }}
          </td>
          <td class="border-2 p-2 text-center">
            {{ countyPrice(item.products) }}
          </td>
          <td class="border-2 p-2 text-center">
            <p v-if="truePaid(item.products)">
              {{ truePaid(item.products) }} 筆已付款
            </p>
            <p v-if="falsePaid(item.products)" class="text-red-400">
              {{ falsePaid(item.products) }} 筆未付款
            </p>
          </td>
          <td class="border-2 p-2">
            <p>{{ item.addressId.name }}</p>
            <p class="">
              {{ item.addressId.code }}
              {{ item.addressId.city }} {{ item.addressId.districts }}
              {{ item.addressId.street }}
            </p>
            <p>
              {{ item.addressId.phone }}
            </p>
          </td>
          <td class="border-2 p-2">
            <p>{{ item.bankId.bankName }}</p>
            <p>{{ item.bankId.bankNumber }}</p>
          </td>
          <td class="border-2 p-2">
            <img
              src="@/assets/svg/eye-solid.svg"
              class="w-6 hover:opacity-60 mx-auto"
              @click="viewOrder(item)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <Model>
      <div>
        <p class="mb-4">
          訂單編號：
          <span>{{ showProduct.list._id }}</span>
        </p>
        <p class="mb-4">
          是否付款：
          <span v-if="truePaid(showProduct.list.products)"
            >{{ truePaid(showProduct.list.products) }}筆已付款</span
          >
          <span
            v-if="falsePaid(showProduct.list.products)"
            class="ml-10 text-red-400"
            >{{ falsePaid(showProduct.list.products) }}筆未付款</span
          >
        </p>
        <p class="mb-">收件地址：</p>
        <p>
          姓名：
          <span>{{ showProduct.list.addressId.name }}</span>
        </p>
        <p>
          地址：
          <span>
            {{ showProduct.list.addressId.code }}
            {{ showProduct.list.addressId.city }}
            {{ showProduct.list.addressId.districts }}
            {{ showProduct.list.addressId.street }}
          </span>
        </p>
        <p>
          電話：
          <span>{{ showProduct.list.addressId.phone }}</span>
        </p>

        <p class="mt-4">
          付款帳戶：
          <span
            >{{ showProduct.list.bankId.bankName }}
            {{ showProduct.list.bankId.bankNumber }}</span
          >
        </p>
        <div
          v-for="item in showProduct.list.products"
          :key="item._id"
          class="flex flex-col lg:flex-row gap-6 mb-10 items-center lg:justify-center mt-8"
        >
          <img
            :src="item.productId.image"
            class="rounded-lg w-56 h-36 lg:w-80 lg:h-56 object-cover"
          />
          <div>
            <p>{{ item.productId.name }}</p>
            <p>
              商品數量：
              <span>{{ item.quantity }}</span>
            </p>
            <p>
              商品價格：
              <span>{{ item.productId.price }}</span>
            </p>
            <Btn
              text="付款"
              class="w-full mt-6"
              :disabled="item.paid.isPaid"
              :class="{ 'disabled: opacity-50': item.paid.isPaid }"
              @click="
                paidHandler({
                  orderId: showProduct.list._id,
                  productId: item.productId._id,
                })
              "
            />
          </div>
        </div>
      </div>
    </Model>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';

import Model from '@/components/ui/TheModel.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useOrderStore } from '@/stores/orders';
import { useModelStore } from '@/stores/model';

const order = useOrderStore();
const { orderBuy, showProduct } = storeToRefs(order);
const { paidHandler } = order;
const { toggleShow } = storeToRefs(useModelStore());
const countyNum = (data) =>
  data.reduce((total, current) => total + current.quantity, 0);

const countyPrice = (data) => {
  const allPrice = data.map((item) => item.quantity * item.productId.price);
  return allPrice.reduce((total, current) => total + current, 0);
};

const truePaid = (data) => {
  return data.reduce((total, current) => {
    if (current.paid.isPaid) {
      total++;
    }
    return total;
  }, 0);
};
const falsePaid = (data) => {
  return data.reduce((total, current) => {
    if (!current.paid.isPaid) {
      total++;
    }
    return total;
  }, 0);
};

const viewOrder = (data) => {
  toggleShow.value = true;
  showProduct.value.list = data;
};

watch(
  () => toggleShow.value,
  (value) => {
    if (!value) {
      showProduct.value.list = {};
    }
  }
);
</script>
