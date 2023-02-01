<template>
  <div class="min-h-[calc(100vh-56px)]">
    <Header />
    <RouterView />
  </div>
</template>

<script setup>
import Header from '@/layout/front/TheHeader.vue';
</script>
