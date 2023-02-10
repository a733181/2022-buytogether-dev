<template>
  <header class="bg-primary py-3 text-white">
    <nav class="container">
      <ul class="flex gap-8 items-center flex-wrap justify-center flex-col">
        <li>
          <img
            :src="user.users.image"
            :alt="user.users.name"
            class="rounded-full w-14 h-14 object-cover"
          />
        </li>
        <li>
          <RouterLink to="/" class="px-3 py-2 rounded-lg hover:opacity-60"
            >回首頁</RouterLink
          >
        </li>
        <li v-if="!user.isAdmin">
          <RouterLink
            to="/member/orderlist"
            class="px-3 py-2 rounded-lg hover:opacity-60 block"
            :class="activeClass('/member/orderlist')"
            >訂單管理</RouterLink
          >
        </li>
        <li v-if="user.isAdmin">
          <RouterLink
            to="/member/orderalllist"
            class="px-3 py-2 rounded-lg hover:opacity-60 block"
            :class="activeClass('/member/orderalllist')"
            >訂單管理</RouterLink
          >
        </li>
        <li v-if="!user.isAdmin">
          <RouterLink
            to="/member/productlist"
            class="px-3 py-2 rounded-lg hover:opacity-60 block"
            :class="activeClass('/member/productlist')"
            >商品管理</RouterLink
          >
        </li>
        <li v-if="user.isAdmin">
          <RouterLink
            to="/member/productalllist"
            class="px-3 py-2 rounded-lg hover:opacity-60 block"
            :class="activeClass('/member/productalllist')"
            >商品管理</RouterLink
          >
        </li>
        <li v-if="user.isAdmin">
          <RouterLink
            to="/member/aboutmessage"
            class="px-3 py-2 rounded-lg hover:opacity-60 block"
            :class="activeClass('/member/aboutmessage')"
            >留言</RouterLink
          >
        </li>
        <li v-if="!user.isAdmin" class="relative">
          <RouterLink
            to="/member/qanda"
            class="px-3 py-2 rounded-lg hover:opacity-60 block"
            :class="activeClass('/member/qanda')"
            >問與答</RouterLink
          >
          <p
            class="absolute -top-4 -right-2 bg-gray-600 rounded-full px-2"
            v-if="messageAllProduct.length"
          >
            {{ messageAllProduct.length }}
          </p>
        </li>
        <li v-if="!user.isAdmin">
          <RouterLink
            to="/member/ship"
            class="rounded-lg hover:opacity-60 block py-3 px-2 -mt-3"
            :class="activeClass('/member/ship')"
            >帳戶</RouterLink
          >
        </li>
        <li v-if="user.isAdmin">
          <RouterLink
            to="/member/shipadmin"
            class="rounded-lg hover:opacity-60 block py-3 px-2 -mt-3"
            :class="activeClass('/member/shipadmin')"
            >會員</RouterLink
          >
        </li>
        <li>
          <p
            class="py-3 px-2 -mt-3 rounded-lg hover:text-gray-500 hover:bg-white cursor-pointer"
            @click="logoutHandler"
          >
            登出
          </p>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/stores/users';
import { useMessageStore } from '@/stores/messages';

const route = useRoute();

const user = useUserStore();
const { logoutHandler } = user;
const { messageAllProduct } = storeToRefs(useMessageStore());

const activeClass = (active) => {
  return route.path === active ? 'text-gray-500 bg-white' : null;
};
</script>
