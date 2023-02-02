<template>
  <div class="w-min">
    <div class="flex space-x-2 items-center mr-9">
      <img
        src="@/assets/svg/arrow.svg"
        alt=""
        class="w-4 h-full hover:opacity-40"
        @click="prevPageHandler"
      />
      <div
        v-for="(page, index) in total"
        :key="index"
        class="pagination-page"
        @click="clickPageHandler(page)"
        :class="{ 'bg-slate-500 text-white': props.current === page }"
      >
        {{ page }}
      </div>
      <img
        src="@/assets/svg/arrow.svg"
        alt=""
        class="w-4 h-full rotate-180 hover:opacity-40"
        @click="nextPageHandler"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  total: {
    type: Number,
  },
  current: {
    type: Number,
    default: 1,
  },
});
const emit = defineEmits(['current']);

const clickPageHandler = (page) => {
  emit('current', page);
};

const prevPageHandler = () => {
  if (props.current - 1 <= 1) {
    emit('current', 1);
  } else {
    emit('current', props.current - 1);
  }
};

const nextPageHandler = () => {
  if (props.current + 1 >= props.total) {
    emit('current', props.total);
  } else {
    emit('current', props.current + 1);
  }
};
</script>

<style scoped>
.pagination-page {
  @apply border-2 px-3 py-1 border-gray-400;
}
.pagination-page:hover {
  @apply bg-primary text-white;
}
</style>
