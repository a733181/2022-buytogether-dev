<template>
  <div class="container flex space-x-2 items-center justify-center">
    <i class="pagination-left"></i>
    <div class="pagination-page">1</div>
    <i class="pagination-right"></i>
  </div>
</template>

<style scoped>
.pagination-left::before {
  content: url('data:image/svg+xml,<svg fill="gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z"/></svg>');
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.pagination-right::before {
  content: url('data:image/svg+xml,<svg fill="gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" ><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>');
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}
.pagination-left:hover,
.pagination-right:hover {
  filter: brightness(0) saturate(100%) invert(14%) sepia(91%) saturate(2834%)
    hue-rotate(195deg) brightness(91%) contrast(88%);
}

.pagination-page {
  @apply border-2 px-3 py-1 border-gray-400;
}
.pagination-page:hover {
  @apply bg-primary text-white;
}
</style>
