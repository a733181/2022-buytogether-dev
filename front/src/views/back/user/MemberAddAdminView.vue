<template>
  <div class="container py-10">
    <div class="flex justify-between items-center mb-8">
      <Breadcrumbs>
        <div class="flex">
          <RouterLink to="/member/shipadmin" class="hover:scale-105"
            >會員</RouterLink
          >
          <p>&ensp;/&ensp;新增會員</p>
        </div>
      </Breadcrumbs>
    </div>
    <Member type="admin" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import Member from '@/components/form/TheMember.vue';
import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';

import { useUserStore } from '@/stores/users';

const user = useUserStore();
const { isLogin } = storeToRefs(user);
isLogin.value = false;
</script>
