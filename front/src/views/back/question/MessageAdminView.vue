<template>
  <div class="container py-10">
    <Breadcrumbs class="mb-10">
      <p class="text-primary font-bold">留言</p>
    </Breadcrumbs>
    <Select v-model="sortType" :select="sortMessage" class="mb-6" />
    <div class="overflow-auto">
      <table class="w-full table-auto text-center">
        <thead>
          <tr>
            <th class="border-2 p-2">會員ID</th>
            <th class="border-2 p-2">訊息</th>
            <th v-if="sortType !== sortMessage[1]" class="border-2 p-2">
              回覆
            </th>
            <th v-else class="border-2 p-2">回覆</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="message in filterMessage" :key="message._id">
            <td class="border-2 p-2">{{ message.userId }}</td>
            <td class="border-2 p-2">{{ message.message }}</td>
            <td v-if="sortType !== sortMessage[1]" class="border-2 p-2">
              <Btn text="回覆" @click="showReply(message._id)" />
            </td>
            <td v-else class="border-2 p-2">{{ message.reply }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Model>
      <SendMessage @message="submitHandler" />
    </Model>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Select from '@/components/ui/TheSelect.vue';
import Btn from '@/components/ui/TheBtn.vue';
import Model from '@/components/ui/TheModel.vue';
import SendMessage from '@/components/ui/SendProductMessage.vue';

import { useContactStore } from '@/stores/contact';
import { useCategoryStore } from '@/stores/category';
import { useModelStore } from '@/stores/model';

const contact = useContactStore();
const { getAdminContactHandler, replayContactHandler } = contact;
const { contact: messages } = storeToRefs(contact);
const { sortMessage } = useCategoryStore();
const { toggleShow } = storeToRefs(useModelStore());
getAdminContactHandler();

const sortType = ref(sortMessage[0]);
const messageId = ref('');

const filterMessage = computed(() => {
  if (sortType.value === sortMessage[0]) {
    return messages.value.list.filter((item) => item.reply === '');
  }

  if (sortType.value === sortMessage[1]) {
    return messages.value.list.filter((item) => item.reply !== '');
  }
});

const showReply = (id) => {
  messageId.value = id;
  toggleShow.value = !toggleShow.value;
};

const submitHandler = (message) => {
  const newMessage = {
    reply: message.message,
    id: messageId.value,
  };

  replayContactHandler(newMessage);
  toggleShow.value = !toggleShow.value;
};
</script>
