<template>
  <div class="overflow-auto">
    <Select v-model="sortType" :select="newSortOrder" />
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
          <th class="border-2 p-2">出貨狀態</th>
          <th class="border-2 p-2">商品詳情</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filterData" :key="item._id">
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
          <td class="border-2 p-2 text-center">
            <p v-if="notShip(item.products)" class="text-red-400">
              {{ notShip(item.products) }} 筆未出貨
            </p>
            <p v-if="shiped(item.products)">
              {{ shiped(item.products) }} 筆已出貨
            </p>
            <p></p>
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
          class="flex flex-col lg:flex-row gap-6 mb-10 mt-8 lg: justify-around"
        >
          <img
            :src="item.productId.image"
            class="rounded-lg w-56 h-36 lg:w-80 lg:h-56 object-cover"
          />
          <div class="mt-2">
            <p>
              商品名稱：
              <span>{{ item.productId.name }}</span>
            </p>
            <p>
              商品數量：
              <span>{{ item.quantity }}</span>
            </p>
            <p>
              商品價格：
              <span>{{ item.productId.price }}</span>
            </p>
          </div>
          <div>
            <div class="mt-2">
              <p>收款帳戶：</p>
              <p>
                {{ item.productId.bankId.bankName }}
              </p>
              <p>{{ item.productId.bankId.bankNumber }}</p>
            </div>
            <p
              v-if="item.paid.isPaid"
              class="mt-2"
              :class="{ 'text-red-400': item.shippingStatus === 0 }"
            >
              {{ item.shippingStatus === 0 ? '未出貨' : '已出貨' }}
            </p>
            <p v-if="item.shippingStatus === 2">已取消</p>
            <Btn
              text="付款"
              class="w-full mt-6"
              :disabled="item.paid.isPaid || item.shippingStatus === 2"
              :class="{
                'disabled: opacity-50':
                  item.paid.isPaid || item.shippingStatus === 2,
              }"
              @click="
                paidOrderHandler({
                  orderId: showProduct.list._id,
                  productId: item.productId._id,
                })
              "
            />
            <Btn
              text="取消訂單"
              class="w-full mt-6"
              className="btn-outline"
              :disabled="item.paid.isPaid || item.shippingStatus === 2"
              :class="{
                'disabled: opacity-50':
                  item.paid.isPaid || item.shippingStatus === 2,
              }"
              @click="
                cancelOrderHandler({
                  orderId: showProduct.list._id,
                  productId: item.productId._id,
                })
              "
            />
            <Btn
              text="出貨"
              class="w-full mt-6"
              :disabled="!item.paid.isPaid || item.shippingStatus === 1"
              :class="{
                'disabled: opacity-50':
                  !item.paid.isPaid || item.shippingStatus === 1,
              }"
              @click="
                shipOrderHandler({
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
import { watch, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

import Model from '@/components/ui/TheModel.vue';
import Btn from '@/components/ui/TheBtn.vue';
import Select from '@/components/ui/TheSelect.vue';

import { useOrderStore } from '@/stores/orders';
import { useModelStore } from '@/stores/model';
import { useCategoryStore } from '@/stores/category';

const order = useOrderStore();
const { orderAdmin, showProduct } = storeToRefs(order);
const { paidOrderHandler, cancelOrderHandler, shipOrderHandler } = order;
const { toggleShow } = storeToRefs(useModelStore());
const { sortOrder } = useCategoryStore();

const newSortOrder = computed(() => {
  return sortOrder.slice(0, 4);
});

const sortType = ref(newSortOrder.value[0]);

const filterData = computed(() => {
  const copydata = JSON.parse(JSON.stringify(orderAdmin.value));
  if (sortType.value === newSortOrder.value[0]) {
    return copydata.filter((item) => {
      item.products = item.products.filter(
        (prod) => !prod.paid.isPaid && prod.shippingStatus !== 2
      );
      return item.products.length > 0;
    });
  }
  if (sortType.value === newSortOrder.value[1]) {
    return copydata.filter((item) => {
      item.products = item.products.filter(
        (prod) => prod.paid.isPaid && prod.shippingStatus === 0
      );
      return item.products.length > 0;
    });
  }
  if (sortType.value === newSortOrder.value[2]) {
    return copydata.filter((item) => {
      item.products = item.products.filter(
        (prod) => prod.paid.isPaid && prod.shippingStatus === 1
      );
      return item.products.length > 0;
    });
  }
  if (sortType.value === newSortOrder.value[3]) {
    return copydata.filter((item) => {
      item.products = item.products.filter((prod) => prod.shippingStatus === 2);
      return item.products.length > 0;
    });
  }
});

const countyNum = (data) =>
  data.reduce((total, current) => total + current.quantity, 0);

const countyPrice = (data) => {
  const allPrice = data.map((item) => item.quantity * item.productId.price);
  return allPrice.reduce((total, current) => total + current, 0);
};

const truePaid = (data) => {
  return data.reduce((total, item) => {
    if (item.paid.isPaid && item.shippingStatus !== 2) {
      total++;
    }
    return total;
  }, 0);
};
const falsePaid = (data) => {
  return data.reduce((total, item) => {
    if (!item.paid.isPaid && item.shippingStatus !== 2) {
      total++;
    }
    return total;
  }, 0);
};

const notShip = (data) => {
  return data.reduce((total, item) => {
    if (item.shippingStatus === 0) {
      total++;
    }
    return total;
  }, 0);
};

const shiped = (data) => {
  return data.reduce((total, item) => {
    if (item.shippingStatus === 1) {
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
