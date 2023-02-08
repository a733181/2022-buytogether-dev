<template>
  <RouterView />
  <Chat />
  <Footer />
</template>

<script setup>
import Footer from '@/layout/TheFooter.vue';
import Chat from './layout/TheChats.vue';
</script>
