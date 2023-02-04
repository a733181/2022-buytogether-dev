<template>
  <header class="bg-primary text-white py-3">
    <div
      class="container flex justify-between items-center relative flex-col lg:flex-row"
    >
      <RouterLink to="/" class="flex gap-2 items-center">
        <i class="logo"></i>
        <p class="mb-2">團購趣</p>
      </RouterLink>
      <nav>
        <ul class="flex gap-4 py-4 items-center justify-center">
          <li>
            <RouterLink
              to="/about"
              class="px-3 py-2 rounded-lg"
              :class="activeClass('/about')"
              >關於我</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/products"
              class="px-3 py-2 rounded-lg"
              :class="activeClass('/products')"
              >商城</RouterLink
            >
          </li>
          <li v-if="user.isMember">
            <RouterLink
              to="/tracklist"
              class="px-3 py-2 rounded-lg"
              :class="activeClass('/tracklist')"
              >收藏/追蹤</RouterLink
            >
          </li>
          <li v-if="!user.isMember">
            <RouterLink
              to="/membership"
              class="px-3 py-2 rounded-lg"
              :class="activeClass('/membership')"
              >登入</RouterLink
            >
          </li>
          <li v-else>
            <RouterLink to="/member/order" class="px-3 py-2 rounded-lg"
              >會員中心</RouterLink
            >
          </li>
        </ul>
        <RouterLink
          to="/cart"
          class="absolute right-6 -bottom-16 hover:opacity-50"
        >
          <p
            v-if="cart.length"
            class="absolute -top-3 left-[59%] -translate-x-1/2 font-bold text-primary"
          >
            {{ cart.length }}
          </p>
          <img
            v-else
            src="@/assets/svg/cart-plus.svg"
            class="w-4 absolute -top-2 right-2 animate-bounce"
          />
          <img src="@/assets/svg/cart.svg" class="w-10" />
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/stores/users';
import { useCartStore } from '@/stores/carts';

const route = useRoute();

const user = useUserStore();
const carts = useCartStore();
const { cart } = storeToRefs(carts);

const activeClass = (active) => {
  return route.path === active ? 'text-gray-500 bg-white' : null;
};
</script>
