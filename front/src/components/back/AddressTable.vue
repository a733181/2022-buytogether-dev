<template>
  <div class="overflow-auto">
    <table class="w-full table-auto lg:w-1/2 lg:mx-auto">
      <thead>
        <tr>
          <th class="border-2 p-2">郵遞區號</th>
          <th class="border-2 p-2">城市</th>
          <th class="border-2 p-2">區鄉鎮</th>
          <th class="border-2 p-2">街道</th>
          <th class="border-2 p-2">姓名</th>
          <th class="border-2 p-2">電話</th>
          <th class="border-2 p-2">設定</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item._id">
          <td class="border-2 p-2 text-center">
            {{ item.code }}
          </td>
          <td class="border-2 p-2 text-center">
            {{ item.city }}
          </td>
          <td class="border-2 p-2 text-center">
            {{ item.districts }}
          </td>
          <td class="border-2 p-2 text-center">
            {{ item.street }}
          </td>
          <td class="border-2 p-2 text-center">
            {{ item.name }}
          </td>
          <td class="border-2 p-2 text-center">
            {{ item.phone }}
          </td>
          <td class="border-2 p-2">
            <div
              class="flex gap-4 items-center justify-center flex-col lg:flex-row"
            >
              <img
                src="@/assets/svg/edit.svg"
                class="w-6 hover:opacity-60"
                @click="editAddressHandler(item._id)"
              />
              <img
                src="@/assets/svg/delete.svg"
                class="w-6 hover:opacity-60"
                @click="deleteAddressHandler(item._id)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useAddressStore } from '@/stores/address';
const address = useAddressStore();
const { editAddressHandler, deleteAddressHandler } = address;

const props = defineProps({
  data: {
    type: Object,
  },
});
</script>
