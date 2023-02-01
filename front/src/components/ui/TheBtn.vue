<template>
  <button
    :type="props.status"
    :class="props.className"
    :disabled="props.disabled"
  >
    {{ text }}
  </button>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    default: 'button',
  },
  text: {
    type: String,
    default: '',
  },
  className: {
    type: String,
    default: 'btn',
  },
});
</script>

<style scoped>
.btn {
  @apply border-2 text-white rounded-lg py-2 px-3 bg-primary  border-primary;
}
.btn:hover {
  @apply bg-white text-primary;
}

.btn-outline {
  @apply border-2 text-primary rounded-lg py-2 px-3;
}
.btn-outline:hover {
  @apply border-gray-600;
}
</style>
