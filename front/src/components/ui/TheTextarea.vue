<template>
  <div class="lable-text">
    <textarea
      class="textarea-text"
      v-model.trim="proxy"
      :class="props.textName"
    ></textarea>
    <label
      class="textarea-text-title"
      :class="{ 'textarea-text-title-active': proxy }"
      >{{ props.title }}</label
    >
    <p v-if="props.error" class="text-red-400">
      {{ props.title }}{{ props.errorText }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const emit = defineEmits();
const props = defineProps({
  title: {
    type: String,
  },
  modelValue: {
    type: String,
  },
  error: {
    type: Boolean,
    default: false,
  },
  errorText: {
    type: String,
    default: '',
  },
  textName: {
    type: String,
  },
});

const proxy = ref(props.modelValue);

watch(proxy, (value) => {
  emit('update:modelValue', value);
});

watch(props, (value) => {
  if (value.modelValue !== proxy) {
    proxy.value = value.modelValue;
  }
});
</script>

<style scoped>
.lable-text {
  @apply relative mt-10;
}
.textarea-text {
  @apply border-2 border-gray-500 w-full py-2 px-2 rounded-md outline-none;
}

.textarea-text-title {
  @apply absolute top-2 left-2 ease-in duration-200 text-xl;
}

.textarea-text:focus + .textarea-text-title {
  @apply -top-6 left-0 text-primary text-lg;
}
.textarea-text-title-active {
  @apply -top-6 left-0 text-primary text-lg;
}
</style>
