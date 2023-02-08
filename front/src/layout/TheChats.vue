<template>
  <div
    v-if="showChat"
    class="fixed right-0 bottom-0 bg-white min-h-[500px] border-2 w-[300px]"
  >
    <ul class="h-[calc(500px-44px)] overflow-auto">
      <li>
        <p>To：{{ chats.toUserName }}</p>
      </li>
      <li v-for="message in chats.messages" :key="message._id">
        {{ message.message }}
      </li>
    </ul>
    <form @submit.prevent="sendMessageHandler" class="flex items-center">
      <Input class="-mt-10 flex-1" v-model="chats.message" />
      <Btn type="submit" text="送出" />
    </form>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import Input from '@/components/ui/TheInput.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useChats } from '@/stores/chats';

const chat = useChats();
const { showChat, chats } = storeToRefs(chat);
const { getMessageHandler, sendMessageHandler } = chat;
getMessageHandler();
</script>
