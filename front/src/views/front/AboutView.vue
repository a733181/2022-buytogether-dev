<template>
  <div class="container pt-32 pb-10">
    <Breadcrumbs class="mb-10">
      <p>關於我</p>
    </Breadcrumbs>
    <div class="flex flex-col lg:flex-row gap-9 items-center mb-10">
      <div class="lg:w-1/2">
        <img src="@/assets/imgs/office.jpg" class="w-full rounded-md" />
      </div>
      <div class="lg:w-1/2">
        <p>
          團購活動和運作方式能夠自由選擇，可以根據自己的需求和喜好自由選擇參加團購或不參加。
        </p>
      </div>
    </div>
    <div class="flex flex-col lg:flex-row gap-9 lg:items-center mb-20">
      <div class="lg:w-1/2 lg:order-1">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.6976274599183!2d121.41730370103961!3d25.044333583888797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a7bec9ad74b1%3A0xa639904a89f26435!2z5Yue5YuV6YOo5Yue5YuV5Yqb55m85bGV572y5YyX5Z-65a6c6Iqx6YeR6aas5YiG572y5rOw5bGx6IG35qWt6KiT57e05aC0!5e0!3m2!1szh-TW!2stw!4v1673937313632!5m2!1szh-TW!2stw"
          style="border: 0"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="w-full h-full lg:h-[450px] rounded-md"
        ></iframe>
      </div>
      <div class="lg:w-1/2">
        <p>電話：023139806</p>
        <p class="mt-5">地址： 243新北市泰山區貴子里致遠新村55之1號</p>
      </div>
    </div>
    <h2 class="text-4xl">聯絡我們</h2>
    <SendMessage @message="submitHandler" :isLoading="isLoading" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import SendMessage from '@/components/ui/SendProductMessage.vue';

import { useContactStore } from '@/stores/contact';

const contact = useContactStore();
const { sumbitContactHandler } = contact;

const isLoading = ref(false);

const submitHandler = async (form) => {
  isLoading.value = false;
  await sumbitContactHandler(form);
  isLoading.value = true;
};
</script>
