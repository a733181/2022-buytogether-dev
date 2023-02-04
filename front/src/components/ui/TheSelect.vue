<template>
  <select
    class="border-2 rounded-lg border-primary py-1 px-2 outline-none"
    v-model="sort"
  >
    <option v-for="(item, index) in props.select" :key="index" :value="item">
      {{ item }}
    </option>
  </select>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits();

const props = defineProps({
  select: {
    type: Array,
    default: [],
  },
  modelValue: {
    type: String,
  },
});

const sort = ref(props.modelValue);

watch(sort, (value) => {
  emit('update:modelValue', value);
});
</script>
