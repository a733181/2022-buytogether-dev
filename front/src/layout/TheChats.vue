<template>
  <div
    v-if="showList || showChat"
    class="fixed right-0 bottom-0 bg-white min-h-[500px] border-2 w-[300px]"
  >
    <div v-if="showList && !showChat">
      <div class="p-2">
        <img
          src="@/assets/svg/close.svg"
          @click="showList = false"
          class="w-6 ml-auto mb-1"
        />
      </div>
      <p v-if="!chatUserList.length" class="p-2">沒有紀錄</p>
      <ul v-if="chatUserList.length">
        <li
          v-for="user in chatUserList"
          :key="user._id"
          class="p-2 flex gap-1 bg-slate-200"
          @click="
            addChatUserHandler({
              toUserId: user.userId,
              name: user.name,
              image: user.image,
            })
          "
        >
          <img
            :src="user.image"
            :alt="user.name"
            class="w-6 h-6 rounded-full object-cover"
          />
          <p>{{ user.name }}</p>
        </li>
      </ul>
    </div>
    <div v-if="showChat" class="h-[calc(500px-44px)]">
      <div class="flex items-center justify-between p-2">
        <div class="flex gap-3">
          <img
            :src="toUser.image"
            :alt="toUser.name"
            class="w-6 object-cover rounded-full"
          />
          <p>{{ toUser.name }}</p>
        </div>
        <img
          src="@/assets/svg/close.svg"
          @click="closeChatHandler"
          class="w-6"
        />
      </div>
      <div class="overflow-y-auto h-[calc(100%-56px)]">
        <div ref="scrollRef">
          <p
            v-for="(message, index) in messages"
            :key="index"
            class="p-2 mb-2 w-3/4"
            :class="{
              'text-end bg-gray-300 ml-auto rounded-lg': !message.fromSelf,
            }"
          >
            {{ message.message }}
          </p>
        </div>
      </div>
      <form @submit.prevent="submitHandler" class="flex items-center">
        <Input class="-mt-10 flex-1" v-model="message" />
        <Btn type="submit" text="送出" />
      </form>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { watch, ref } from 'vue';

import Input from '@/components/ui/TheInput.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useChats } from '@/stores/chats';
const chat = useChats();
const { sendChatHandler, addChatUserHandler } = chat;
const { showChat, showList, message, messages, toUser, chatUserList } =
  storeToRefs(chat);
const scrollRef = ref(null);

const closeChatHandler = () => {
  showChat.value = false;
  showList.value = false;
};

watch(scrollRef, (value) => {
  if (value) {
    scrollRef.value.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
});

const submitHandler = async () => {
  const scroll = await sendChatHandler();
  if (scroll) {
    scrollRef.value.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
};
</script>
