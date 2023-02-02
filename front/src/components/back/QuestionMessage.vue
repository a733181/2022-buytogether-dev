<template>
  <table class="w-full table-auto">
    <thead>
      <tr>
        <th class="border-2 p-2">商品圖片</th>
        <th class="border-2 p-2">商品名稱</th>
        <th class="border-2 p-2">商品問題</th>
        <th class="border-2 p-2">回覆</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in messageAllProduct" :key="item._id">
        <td class="border-2 p-2">
          <img
            :src="item.prodcutId.image"
            :alt="item.prodcutId.name"
            class="w-32 h-24 rounded-lg mx-auto object-cover"
          />
        </td>
        <td class="border-2 p-2 text-center">
          <p>{{ item.prodcutId.name }}</p>
        </td>
        <td class="border-2 p-2 text-center">
          <p>{{ item.message }}</p>
        </td>
        <td class="border-2 p-2 text-center">
          <Btn text="回覆" @click="showReply(item._id)" />
        </td>
      </tr>
    </tbody>
  </table>
  <Model>
    <SendMessage @message="submitHandler" />
  </Model>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import Model from '@/components/ui/TheModel.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useMessageStore } from '@/stores/messages';
import { useModelStore } from '@/stores/model';

const message = useMessageStore();
const { getAllMemberProductMessageHanlder, replayMessageHandler } = message;
const { messageAllProduct } = storeToRefs(message);
const { toggleShow } = storeToRefs(useModelStore());

getAllMemberProductMessageHanlder();

const messageId = ref('');

const showReply = (id) => {
  messageId.value = id;
  toggleShow.value = !toggleShow.value;
};

const submitHandler = (message) => {
  toggleShow.value = !toggleShow.value;
  const newMessage = {
    reply: message.message,
    id: messageId.value,
  };
  replayMessageHandler(newMessage);
};
</script>
