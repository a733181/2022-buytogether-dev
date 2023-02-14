<template>
  <div class="container pt-44 lg:pt-32 pb-10">
    <Breadcrumbs class="mb-10 text-primary font-bold hover:opacity-60">
      <p>收藏/追蹤</p>
    </Breadcrumbs>
    <div class="flex mb-10 border-b-2 border-primary">
      <p
        class="text-lg py-3 px-8"
        @click="activeTab = '收藏'"
        :class="{ 'bg-primary text-white rounded-t-lg': activeTab === '收藏' }"
      >
        收藏
      </p>
      <p
        class="text-lg py-3 px-8"
        @click="activeTab = '追蹤'"
        :class="{ 'bg-primary text-white rounded-t-lg': activeTab === '追蹤' }"
      >
        追蹤
      </p>
    </div>
    <Collect v-if="activeTab === '收藏'" />
    <Track v-if="activeTab === '追蹤'" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import Tab from '@/components/ui/TheTab.vue';
import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Track from '@/components/front/TheTrack.vue';
import Collect from '@/components/front/TheCollect.vue';

import { useUserStore } from '@/stores/users';
import { useProductsStore } from '@/stores/products';

const user = useUserStore();
const { getTrackListHandler } = user;
const { getFatoriteHandler } = useProductsStore();
getTrackListHandler();
getFatoriteHandler();

const activeTab = ref('收藏');
</script>

<Tab tab="收藏" class="w-1/2" :active="activeTab" @click="activeTab = '收藏'" />
<Tab tab="追蹤" class="w-1/2" :active="activeTab" @click="activeTab = '追蹤'" />
