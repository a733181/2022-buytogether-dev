<template>
  <div class="container py-20">
    <Breadcrumbs class="mb-10">
      <p>購物車</p>
    </Breadcrumbs>
    <div v-if="!cart.length" class="text-2xl flex gap-8 justify-center">
      <h1>購物車內沒有商品</h1>
      <RouterLink to="/products" class="text-primary">前往商城</RouterLink>
    </div>
    <form @submit.prevent="submitHandler">
      <table v-if="cart.length" class="w-full">
        <thead>
          <tr>
            <th class="border-2 p-2">圖片</th>
            <th class="border-2 p-2">名稱</th>
            <th class="border-2 p-2">數量</th>
            <th class="border-2 p-2">單價</th>
            <th class="border-2 p-2">小計</th>
            <th class="border-2 p-2">刪除</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.list">
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
                <img
                  src="@/assets/svg/minus.svg"
                  class="w-5 hover:opacity-60"
                  @click="
                    changeNumber({ id: item.productId._id, quantity: -1 })
                  "
                />
                <p>{{ item.quantity }}</p>
                <img
                  src="@/assets/svg/plus.svg"
                  class="w-5 hover:opacity-60"
                  @click="changeNumber({ id: item.productId._id })"
                />
              </div>
            </td>
            <td class="border-2 p-2 text-center">{{ item.productId.price }}</td>
            <td class="border-2 p-2 text-center">
              {{ item.quantity * item.productId.price }}
            </td>
            <td class="border-2 p-2">
              <img
                src="@/assets/svg/delete.svg"
                class="w-6 hover:opacity-60 mx-auto"
                @click="
                  changeNumber({ id: item.productId._id, type: 'delete' })
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
            <td colspan="6">
              <div class="flex justify-end items-center">
                <div class="w-1/2">
                  <Input
                    v-model="form.bank"
                    title="付款帳戶"
                    :select="bankNewList"
                    :error="error.bank.error"
                    :errorText="error.bank.value"
                    @click="error.bank.error = false"
                  />
                  <p>
                    點選付款帳戶，選擇帳戶<span class="ml-2 text-red-400"
                      >(若無帳戶請先新增帳戶)</span
                    >
                  </p>
                </div>
                <RouterLink to="/member/bankinfo">
                  <Btn text="新增" class="mt-4 ml-10" className="btn-outline" />
                </RouterLink>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="6">
              <div class="flex justify-end">
                <div class="w-1/2">
                  <Input
                    v-model="form.address"
                    title="收件地址"
                    :select="addressNewList"
                    :error="error.address.error"
                    :errorText="error.address.value"
                    @click="error.address.error = false"
                  />
                  <p>
                    點選收件地址，選擇地址<span class="ml-2 text-red-400"
                      >(若無地址請先新增地址)</span
                    >
                  </p>
                </div>
                <RouterLink to="/member/addressinfo">
                  <Btn
                    text="新增"
                    class="mt-10 ml-10"
                    className="btn-outline"
                  />
                </RouterLink>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="4"></td>
            <td colspan="2">
              <Btn
                text="確定"
                class="w-full mt-6"
                @click="submitHandler"
                :disabled="isLoading"
                :loading="isLoading"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import validator from 'validator';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Btn from '@/components/ui/TheBtn.vue';
import Input from '@/components/ui/TheInput.vue';

import { useCartStore } from '@/stores/carts';
import { useOrderStore } from '@/stores/orders';
import { useBankStore } from '@/stores/bank';
import { useAddressStore } from '@/stores/address';

const carts = useCartStore();
const { getCartList, clickAddCartHandler, deleteCartHandler } = carts;
const { cart } = storeToRefs(carts);
const { checkoutHandler } = useOrderStore();
const { listBank } = storeToRefs(useBankStore());
const { listAddress } = storeToRefs(useAddressStore());
getCartList();

const isLoading = ref(false);

const error = reactive({
  address: {
    error: false,
    value: '',
  },
  bank: {
    error: false,
    value: '',
  },
});

const form = reactive({ address: '', bank: '' });

const changeNumber = async ({ id, quantity, type }) => {
  if (type !== 'delete') {
    await clickAddCartHandler({ id, quantity });
  } else {
    await deleteCartHandler({ id });
  }
  await getCartList();
};

const sumTotal = computed(() => {
  return cart.value.list.reduce(
    (total, current) => total + current.productId.price * current.quantity,
    0
  );
});

const bankNewList = computed(() => {
  if (!listBank.value) return [];

  return listBank.value.map((item) => `${item.bankName} - ${item.bankNumber}`);
});

const addressNewList = computed(() => {
  if (!listAddress.value) return [];

  return listAddress.value.map(
    (item) => `${item.code} ${item.city} ${item.districts} ${item.street}`
  );
});

const validatorFormHandler = () => {
  if (validator.isEmpty(form.bank)) {
    error.bank.value = '為必填';
    error.bank.error = true;
    return true;
  }
  if (validator.isEmpty(form.address)) {
    error.address.value = '為必填';
    error.address.error = true;
    return true;
  }

  const isBank = listBank.value.some((item) => {
    const bank = form.bank.split('-');
    return (
      item.bankName === bank[0].trim() &&
      item.bankNumber.toString() === bank[1].trim()
    );
  });
  if (!isBank) {
    error.bank.value = '格式錯誤';
    error.bank.error = true;
    return true;
  }

  const isAddress = listAddress.value.some((item) => {
    const address = form.address.split(' ');
    return (
      item.code.toString() === address[0] &&
      item.city === address[1] &&
      item.districts === address[2] &&
      item.street.toString() === address[3]
    );
  });

  if (!isAddress) {
    error.address.value = '格式錯誤';
    error.address.error = true;
    return true;
  }

  return false;
};

const submitHandler = async () => {
  if (validatorFormHandler()) return;
  isLoading.value = true;
  const bankIndex = listBank.value.findIndex((item) => {
    const bank = form.bank.split('-');
    return (
      item.bankName === bank[0].trim() &&
      item.bankNumber.toString() === bank[1].trim()
    );
  });

  const addressIndex = listAddress.value.findIndex((item) => {
    const address = form.address.split(' ');
    return (
      item.code.toString() === address[0] &&
      item.city === address[1] &&
      item.districts === address[2] &&
      item.street.toString() === address[3]
    );
  });

  const newForm = {
    addressId: listAddress.value[addressIndex]._id,
    bankId: listBank.value[bankIndex]._id,
  };

  await checkoutHandler(newForm);
  isLoading.value = false;
};
</script>
