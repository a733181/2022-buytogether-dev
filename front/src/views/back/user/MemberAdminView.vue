<template>
  <div class="container py-10">
    <div class="flex justify-between items-center mb-8">
      <Breadcrumbs>
        <p>會員</p>
      </Breadcrumbs>
      <RouterLink to="/member/memberadminadd">
        <Btn text="新增會員" />
      </RouterLink>
    </div>
    <div class="overflow-auto mb-10">
      <table class="w-full table-auto text-center">
        <thead>
          <tr>
            <th class="border-2 p-2">名稱</th>
            <th class="border-2 p-2">Email</th>
            <th class="border-2 p-2">手機號碼</th>
            <th class="border-2 p-2">修改</th>
            <th class="border-2 p-2">預設帳戶</th>
            <th class="border-2 p-2">全部帳戶</th>
            <th class="border-2 p-2">預設地址</th>
            <th class="border-2 p-2">全部地址</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userAdmin.list" :key="user._id">
            <td class="border-2 p-2">
              <div class="flex flex-col lg:flex-row">
                <img
                  :src="user.image"
                  class="w-8 h-8 lg:mr-3 lg:ml-2 rounded-full object-cover"
                />
                <p>{{ user.name }}</p>
              </div>
            </td>
            <td class="border-2 p-2">{{ user.email }}</td>
            <td class="border-2 p-2">{{ user.phone }}</td>
            <td class="border-2 p-2">
              <img
                src="@/assets/svg/edit.svg"
                class="w-6 hover:opacity-60 mx-auto"
                @click="editUserHandler(user)"
              />
            </td>
            <td class="border-b-2 p-2">
              <p class="text-start whitespace-pre">
                {{ defaultBank(user._id) }}
              </p>
            </td>
            <td class="border-b-2 p-2">
              <img
                src="@/assets/svg/eye-solid.svg"
                class="w-6 hover:opacity-60 mx-auto"
                @click="adminViewUserBankListHanlder(user._id)"
              />
            </td>
            <td class="border-l-2 border-b-2 p-2 text-start whitespace-pre">
              <p class="text-start whitespace-pre">
                {{ defaultAddress(user._id) }}
              </p>
            </td>
            <td class="border-r-2 border-b-2 p-2">
              <img
                src="@/assets/svg/eye-solid.svg"
                class="w-6 hover:opacity-60 mx-auto"
                @click="adminViewUserAddressListHanlder(user._id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useUserStore } from '@/stores/users';
import { useBankStore } from '@/stores/bank';
import { useAddressStore } from '@/stores/address';

const router = useRouter();
const user = useUserStore();
const { userAdmin } = storeToRefs(user);
const bank = useBankStore();
const { adminViewUserBankListHanlder } = bank;
const { banksAdmin } = storeToRefs(bank);
const address = useAddressStore();
const { adminViewUserAddressListHanlder } = address;
const { addressAdmin } = storeToRefs(address);

const defaultBank = (userId) => {
  const bankList = banksAdmin.value.list.filter(
    (item) => item.userId === userId
  );

  const index = bankList.findIndex((item) => item.preset);
  if (index === -1 && bankList.length === 0) {
    return '';
  } else if (index === -1) {
    return `${bankList[0].bankName}\r\n${bankList[0].bankNumber}`;
  } else {
    return `${bankList[index].bankName}\r\n${bankList[index].bankNumber}`;
  }
};

const defaultAddress = (userId) => {
  const addressList = addressAdmin.value.list.filter(
    (item) => item.userId === userId
  );

  const index = addressList.findIndex((item) => item.preset);

  if (index === -1 && addressList.length === 0) {
    return '';
  } else if (index === -1) {
    return `${addressList[0].code} ${addressList[0].city} ${addressList[0].districts}\r\n${addressList[0].street}`;
  } else {
    return `${addressList[index].code} ${addressList[index].city} ${addressList[index].districts}\r\n${addressList[index].street}`;
  }
};

const editUserHandler = (user) => {
  userAdmin.value.edit = user;
  banksAdmin.value.edit = banksAdmin.value.list.filter(
    (item) => item.userId === user._id
  );
  addressAdmin.value.edit = addressAdmin.value.list.filter(
    (item) => item.userId === user._id
  );
  router.push('/member/shipadmininfo');
};
</script>

<style scoped></style>
