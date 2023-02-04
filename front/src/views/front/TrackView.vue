<template>
  <div class="container py-20">
    <div class="flex gap-8 mb-10">
      <Tab
        tab="收藏"
        class="w-1/2"
        :active="activeTab"
        @click="activeTab = '收藏'"
      />
      <Tab
        tab="追蹤名單"
        class="w-1/2"
        :active="activeTab"
        @click="activeTab = '追蹤'"
      />
    </div>
    <Breadcrumbs class="mb-10">
      <p>{{ activeTab }}</p>
    </Breadcrumbs>
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
