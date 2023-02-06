<template>
  <table class="w-full lg:w-1/2 lg:mx-auto">
    <thead>
      <tr>
        <th class="border-2 p-2">代號</th>
        <th class="border-2 p-2">帳戶</th>
        <th class="border-2 p-2">設定</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <td class="border-2 p-2 text-center">
          {{ item.bankName }}
        </td>
        <td class="border-2 p-2 text-center">
          {{ item.bankNumber }}
        </td>
        <td class="border-2 p-2">
          <div
            class="flex gap-4 items-center justify-center flex-col lg:flex-row"
          >
            <img
              src="@/assets/svg/edit.svg"
              class="w-6 hover:opacity-60"
              @click="editBankHandler(item._id)"
            />
            <img
              src="@/assets/svg/delete.svg"
              class="w-6 hover:opacity-60"
              @click="deleteBankHandler(item._id)"
            />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useBankStore } from '@/stores/bank';

const bank = useBankStore();
const { editBankHandler, deleteBankHandler } = bank;

const porps = defineProps({
  data: {
    type: Object,
  },
});
</script>
