<template>
  <div class="container py-10">
    <Breadcrumbs class="mb-10">
      <span>訂單管理</span>
      <span>&ensp;/&ensp;{{ activeTab }}</span>
    </Breadcrumbs>
    <div class="flex gap-8 mb-10">
      <Tab
        tab="購買"
        class="w-1/3"
        :active="activeTab"
        @click="activeTab = '購買'"
      />
      <Tab
        tab="銷售"
        class="w-1/3"
        :active="activeTab"
        @click="activeTab = '銷售'"
      />
      <Tab
        tab="圖表"
        class="w-1/3"
        :active="activeTab"
        @click="activeTab = '圖表'"
      />
    </div>
    <BuyOrder v-if="activeTab === '購買'" />
    <SellOrder v-if="activeTab === '銷售'" />
    <ChartOrder v-if="activeTab === '圖表'" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import Tab from '@/components/ui/TheTab.vue';
import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import BuyOrder from '@/components/back/BuyOrder.vue';
import SellOrder from '@/components/back/SellOrder.vue';
import ChartOrder from '@/components/back/ChartOrder.vue';

import { useOrderStore } from '@/stores/orders';

const order = useOrderStore();
const { getMemberBuyOrderHandler, getMemberSellOrderHandler } = order;

getMemberBuyOrderHandler();
getMemberSellOrderHandler();

const activeTab = ref('購買');
</script>
