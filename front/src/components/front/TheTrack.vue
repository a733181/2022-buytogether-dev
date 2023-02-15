<template>
  <div v-if="!trackList.length" class="text-2xl flex gap-8 justify-center">
    <h2>沒有追蹤名單</h2>
    <RouterLink to="/" class="text-primary">前往首頁</RouterLink>
  </div>
  <ul v-else v-for="item in trackList" :key="item._id">
    <li class="flex items-center gap-4">
      <img
        :src="item.image"
        :alt="item.name"
        class="w-16 h-16 rounded-full object-cover"
      />
      <p>{{ item.name }}</p>
      <RouterLink :to="`/memberhome/${item._id}`" class="text-primary"
        >前往商品頁</RouterLink
      >
      <Btn text="取消追蹤" @click="unTrack(item._id)" class="ml-auto" />
    </li>
  </ul>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import Btn from '@/components/ui/TheBtn.vue';

import { useUserStore } from '@/stores/users';

const user = useUserStore();
const { clickListHandler, getTrackListHandler } = user;
const { trackList } = storeToRefs(user);

const unTrack = async (id) => {
  await clickListHandler({ id });
  await getTrackListHandler();
};
</script>
