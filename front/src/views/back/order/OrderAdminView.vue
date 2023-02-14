<template>
  <div class="container py-10">
    <Breadcrumbs class="mb-10">
      <span class="text-primary font-bold">訂單管理</span>
    </Breadcrumbs>
    <adminOrder />
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import adminOrder from '@/components/back/adminOrder.vue';

import { useOrderStore } from '@/stores/orders';

const order = useOrderStore();
const { getAdminOrder } = order;
getAdminOrder();
</script>
