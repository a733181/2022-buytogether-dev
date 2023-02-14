<template>
  <div class="container py-10">
    <Breadcrumbs class="mb-10">
      <span class="text-primary font-bold">訂單管理</span>
      <span>&ensp;/&ensp;{{ activeTab }}</span>
    </Breadcrumbs>
    <div class="flex gap-8 mb-10 border-b-2 border-primary">
      <p
        class="text-lg py-3 px-8"
        :class="{ 'bg-primary text-white rounded-t-lg': activeTab === '購買' }"
        @click="activeTab = '購買'"
      >
        購買
      </p>
      <p
        class="text-lg py-3 px-8"
        :class="{ 'bg-primary text-white rounded-t-lg': activeTab === '銷售' }"
        @click="activeTab = '銷售'"
      >
        銷售
      </p>
      <p
        class="text-lg py-3 px-8"
        :class="{ 'bg-primary text-white rounded-t-lg': activeTab === '圖表' }"
        @click="activeTab = '圖表'"
      >
        圖表
      </p>
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
