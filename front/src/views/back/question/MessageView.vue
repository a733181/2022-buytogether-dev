<template>
  <div class="container py-20">
    <Breadcrumbs class="mb-10">
      <p>團購網回覆</p>
    </Breadcrumbs>

    <div class="overflow-auto">
      <table class="w-full table-auto text-center">
        <thead>
          <tr>
            <th class="border-2 p-2">訊息</th>
            <th class="border-2 p-2">回覆</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="message in messages.list" :key="message._id">
            <td class="border-2 p-2">{{ message.message }}</td>
            <td class="border-2 p-2">{{ message.reply }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';

import { useContactStore } from '@/stores/contact';

const contact = useContactStore();
const { getMemberContactHandler } = contact;
const { contact: messages } = storeToRefs(contact);

getMemberContactHandler();
</script>
