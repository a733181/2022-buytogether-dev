<template>
  <div class="container py-20">
    <Breadcrumbs class="mb-10">
      <p>帳戶</p>
    </Breadcrumbs>
    <div class="flex gap-8 mb-10">
      <Tab
        tab="購買"
        class="w-1/2 text-center"
        :active="activeTab"
        @click="activeTab = '購買'"
      />
      <Tab
        tab="銷售"
        class="w-1/2 text-center"
        :active="activeTab"
        @click="activeTab = '銷售'"
      />
    </div>
    <BuyOrder v-if="activeTab === '購買'" />
    <SellOrder v-if="activeTab === '銷售'" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import Tab from '@/components/ui/TheTab.vue';
import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import BuyOrder from '@/components/back/buyOrder.vue';
import SellOrder from '@/components/back/SellOrder.vue';

import { useOrderStore } from '@/stores/orders';

const order = useOrderStore();
const { getMemberBuyOrderHandler, getMemberSellOrderHandler } = order;

getMemberBuyOrderHandler();
getMemberSellOrderHandler();

const activeTab = ref('購買');
</script>
