<template>
  <div class="container pt-44 lg:pt-32 pb-10">
    <Breadcrumbs>
      <p class="text-primary font-bold">
        {{ isLogin ? '登入' : '註冊' }}
      </p>
    </Breadcrumbs>

    <Member />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import Member from '@/components/form/TheMember.vue';
import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';

import { useUserStore } from '@/stores/users';

const user = useUserStore();
const { isLogin } = storeToRefs(user);
</script>
