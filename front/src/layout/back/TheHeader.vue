<template>
  <header class="bg-primary text-white py-3">
    <div
      class="container flex justify-between items-center flex-col lg:flex-row"
    >
      <RouterLink to="/" class="flex gap-2 items-center">
        <i class="logo"></i>
        <p>團購趣</p>
      </RouterLink>
      <nav>
        <ul class="flex gap-4 py-2 items-center flex-wrap justify-center">
          <li>
            <RouterLink to="/" class="px-3 py-2 rounded-lg">回首頁</RouterLink>
          </li>
          <li>
            <RouterLink
              to="/member/order"
              class="px-3 py-2 rounded-lg"
              :class="activeClass('/member/order')"
              >訂單管理</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/member/productlist"
              class="px-3 py-2 rounded-lg"
              :class="activeClass('/member/productlist')"
              >商品管理</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/member/membership"
              class="px-3 py-2 rounded-lg"
              :class="activeClass('/member/membership')"
              >帳戶</RouterLink
            >
          </li>
          <li>
            <p
              class="rounded-lg px-3 py-2 hover:text-gray-500 hover:bg-white"
              @click="logoutHandler"
            >
              登出
            </p>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/users';

const route = useRoute();

const user = useUserStore();
const { logoutHandler } = user;

const activeClass = (active) => {
  return route.path === active ? 'text-gray-500 bg-white' : null;
};
</script>
