<template>
  <div class="container pt-44 lg:pt-32 pb-10">
    <Breadcrumbs class="mb-10">
      <p>購物車&ensp;/&ensp;付款</p>
    </Breadcrumbs>

    <table class="w-full">
      <thead>
        <tr>
          <th class="border-2 p-2">圖片</th>
          <th class="border-2 p-2">名稱</th>
          <th class="border-2 p-2">數量</th>
          <th class="border-2 p-2">單價</th>
          <th class="border-2 p-2">小計</th>
          <th class="border-2 p-2">收款帳戶</th>
          <th class="border-2 p-2">付款</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in orderPaid.list" :key="item.productId._id">
          <td class="border-2 p-2">
            <img
              :src="item.productId.image"
              :alt="item.productId.name"
              class="w-1/2 mx-auto h-32 object-cover rounded-lg"
            />
          </td>
          <td class="border-2 p-2 text-center">
            <p>{{ item.productId.name }}</p>
          </td>
          <td class="border-2 p-2">
            <div class="flex justify-center items-center gap-3 lg:gap-6">
              <p>{{ item.quantity }}</p>
            </div>
          </td>
          <td class="border-2 p-2 text-center">{{ item.productId.price }}</td>
          <td class="border-2 p-2 text-center">
            {{ item.quantity * item.productId.price }}
          </td>
          <td class="border-2 p-2 text-center">
            <p>{{ item.productId.bankId.bankName }}</p>
            <p>{{ item.productId.bankId.bankNumber }}</p>
          </td>
          <td class="border-2 p-2">
            <Btn
              text="付款"
              class="w-full mt-6"
              :disabled="item.productId?.paid"
              :loading="isLoading"
              :class="{ 'disabled: opacity-50': item.productId.paid }"
              @click="
                clickBtnpaidOrderHandler({
                  orderId: orderPaid._id,
                  productId: item.productId._id,
                })
              "
            />
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td class="text-center p-4">
            <p>總計</p>
          </td>
          <td class="text-center p-4">
            <p>{{ sumTotal }}</p>
          </td>
        </tr>
        <tr>
          <td colspan="7">
            <div class="flex justify-end">
              <div>
                <p>
                  付款帳戶：<span class="ml-2">{{ bank }}</span>
                </p>
                <p>
                  收件地址：<span class="ml-2"> {{ address }}</span>
                </p>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="5"></td>
          <td colspan="2">
            <Btn
              text="全部付款"
              class="w-full mt-6"
              :loading="isAllLoading"
              @click="
                clickBtnAllpaidOrderHandler({
                  orderId: orderPaid._id,
                  productId: '',
                })
              "
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useOrderStore } from '@/stores/orders';
import { useBankStore } from '@/stores/bank';
import { useAddressStore } from '@/stores/address';

const isLoading = ref(false);
const isAllLoading = ref(false);

const router = useRouter();

const order = useOrderStore();
const { orderPaid } = storeToRefs(order);
const { paidOrderHandler } = order;
const { listBank } = storeToRefs(useBankStore());
const { listAddress } = storeToRefs(useAddressStore());

if (!orderPaid.value._id) router.push('/');

const sumTotal = computed(() => {
  return orderPaid.value.list.reduce(
    (total, current) => total + current.productId.price * current.quantity,
    0
  );
});

const bank = computed(() => {
  if (!orderPaid.value.bankId) return '';
  const filter = listBank.value.filter(
    (item) => item._id === orderPaid.value.bankId
  );
  return `${filter[0].bankName} - ${filter[0].bankNumber}`;
});

const address = computed(() => {
  if (!orderPaid.value.addressId) return '';
  const filter = listAddress.value.filter(
    (item) => item._id === orderPaid.value.addressId
  );

  return `${filter[0].code} ${filter[0].city} ${filter[0].districts} ${filter[0].street}`;
});

const clickBtnpaidOrderHandler = async (id) => {
  isLoading.value = true;
  await paidOrderHandler(id);
  isLoading.value = false;
};

const clickBtnAllpaidOrderHandler = async (id) => {
  isAllLoading.value = true;
  await paidOrderHandler(id);
  isAllLoading.value = false;
};
</script>
