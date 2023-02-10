<template>
  <div class="min-h-[calc(100vh-56px)]">
    <Header />
    <RouterView v-slot="{ Component }">
      <transition name="router" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<script setup>
import Header from '@/layout/front/TheHeader.vue';
</script>

<style scoped>
.router-enter-from,
.router-leave-to {
  opacity: 0;
}
.router-enter-active {
  transition: opacity 150ms ease-out;
}
.router-leave-active {
  transition: opacity 150ms ease-in;
}
.router-enter-to,
.router-leave-from {
  opacity: 1;
}
</style>
