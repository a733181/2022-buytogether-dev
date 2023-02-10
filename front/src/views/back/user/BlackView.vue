<template>
  <div class="container py-10">
    <Breadcrumbs class="mb-10">
      <div class="flex">
        <RouterLink to="/member/ship" class="hover:scale-105">帳戶</RouterLink>
        <p>&ensp;/&ensp;黑名單</p>
      </div>
    </Breadcrumbs>
    <div v-if="!blackList.length" class="text-2xl flex gap-8 justify-center">
      <h1>沒有黑名單</h1>
    </div>
    <ul v-else v-for="item in blackList" :key="item._id">
      <li class="flex items-center gap-4">
        <img
          :src="item.image"
          :alt="item.name"
          class="w-16 h-16 rounded-full object-cover"
        />
        <p>{{ item.name }}</p>
        <Btn
          text="取消黑名單"
          @click="unBlack(item._id)"
          class="ml-auto"
          className="btn-outline"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useUserStore } from '@/stores/users';

const user = useUserStore();
const { getBlackListHanlder, clickListHandler } = user;
const { blackList } = storeToRefs(user);
getBlackListHanlder();

const unBlack = async (id) => {
  await clickListHandler({ id, type: 'black' });
  await getBlackListHanlder();
};
</script>
