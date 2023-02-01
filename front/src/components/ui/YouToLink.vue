<template>
  <div class="relative overflow-hidden pb-[56.25%]">
    <iframe
      class="absolute top-0 left-0 w-full h-full"
      width="560"
      height="315"
      :src="src"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup>
const props = defineProps({
  data: String,
});

const src = `https://www.youtube.com/embed/${props.data}`;
</script>
