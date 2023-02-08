<template>
  <div class="tab" :class="{ 'tab-active': props.tab === props.active }">
    <p>{{ props.tab }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  tab: {
    type: String,
    default: 'button',
  },
  active: {
    type: String,
  },
});
</script>

<style scoped>
.tab {
  @apply border-2 rounded-lg px-3 py-2 text-center;
}
.tab:hover {
  @apply border-primary;
}
.tab-active {
  @apply bg-primary text-white border-primary;
}
</style>
