<template>
  <div class="relative">
    <div :class="lableClass">
      <input
        :type="props.type"
        :class="[
          inputClass,
          { 'cursor-not-allowed bg-slate-200': props.disabled },
        ]"
        v-model.trim="proxy"
        :name="props.name"
        :id="props.id"
        :disabled="props.disabled"
        @click="toggleShowSelectHandler"
      />
      <label :class="titleClass" :for="props.id">
        <!-- <span
          v-if="props.select !== undefined && filterSelect.length === 0"
          class="text-red-400"
          >沒有</span
        > -->
        {{ props.title }}
      </label>
    </div>
    <p v-if="props.error" class="text-red-400">
      {{ props.title }}{{ props.errorText }}
    </p>

    <ul v-if="isShowSelect && filterSelect.length > 0" class="select">
      <li
        class="select-item"
        v-for="(item, index) in filterSelect"
        :key="index"
        @click="selectDataHandler(item)"
      >
        {{ item }}
      </li>
    </ul>
    <img
      v-if="filterSelect.length > 0 && proxy.length > 0"
      src="@/assets/svg/close.svg"
      alt="close"
      class="select-close"
      @click="clearInputHandler"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
const emit = defineEmits();
const props = defineProps({
  select: {
    type: Array,
  },
  title: {
    type: String,
  },
  type: {
    type: String,
    default: 'text',
  },
  error: {
    type: Boolean,
    default: false,
  },
  errorText: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [Number, String, Boolean],
  },
  name: {
    type: String,
  },
  id: {
    type: String,
  },
  disabled: {
    type: Boolean,
  },
  value: {
    type: String,
  },
});

const type = props.type;

const proxy = ref(props.modelValue || props.value || '');
const isShowSelect = ref(false);

const filterSelect = computed(() => {
  if (!props.select) return [];
  return props.select.filter((item) => item.includes(proxy.value));
});

const selectDataHandler = (item) => {
  proxy.value = item;
  isShowSelect.value = false;
};

const toggleShowSelectHandler = () => {
  isShowSelect.value = !isShowSelect.value;
};

const clearInputHandler = () => {
  proxy.value = '';
};

const lableClass = computed(() => {
  if (['text', 'password', 'email'].includes(type)) {
    return 'lable-text';
  }
  if (type === 'checkbox') {
    return 'lable-checkbox';
  }
  return '';
});

const inputClass = computed(() => {
  if (['text', 'password', 'email'].includes(type) & props.error) {
    return ['input-text', 'input-text-error'];
  }
  if (['text', 'password', 'email'].includes(type)) {
    return 'input-text';
  }
  if (type === 'checkbox') {
    return 'input-checkbox';
  }
  return '';
});

const titleClass = computed(() => {
  if (['text', 'password', 'email'].includes(type) && proxy.value) {
    return ['input-text-title-active', 'input-text-title'];
  }
  if (['text', 'password', 'email'].includes(type)) {
    return 'input-text-title';
  }
  if (type === 'checkbox') {
    return 'input-checkbox-title';
  }
  return '';
});

watch(proxy, (value) => {
  emit('update:modelValue', value);
});

watch(props, (value) => {
  if (value.modelValue !== false && value.modelValue !== proxy.value) {
    proxy.value = value.modelValue;
  }
  if (value.value && value.value !== proxy.value) {
    proxy.value = value.value;
  }
});
</script>

<style scoped>
.lable-text {
  @apply relative mt-10;
}
.input-text {
  @apply border-2 border-gray-500 w-full py-2 px-2 rounded-md outline-none;
}
.input-text-title {
  @apply absolute top-1/2 -translate-y-1/2 left-2 ease-in duration-200 text-xl;
}

.input-text:focus + .input-text-title {
  @apply -top-4 left-0 text-primary text-lg;
}
.input-text-title-active {
  @apply -top-4 left-0 text-primary text-lg;
}
.input-text:focus {
  @apply border-primary;
}
.input-text-error {
  @apply border-red-400;
}
.select {
  @apply border-t-2 border-x-2 absolute bg-white z-[1] max-h-[150px] overflow-auto w-full;
}

.select-item {
  @apply border-b-2 py-2 px-4;
}
.select-close {
  @apply absolute top-[5px] right-2 w-5;
}

.lable-checkbox {
  @apply flex mt-6 items-center;
}
.input-checkbox {
  @apply appearance-none border-2 w-6 h-6 checked:bg-primary rounded-md;
}
.input-checkbox-title {
  @apply -order-1 mr-3;
}
</style>
