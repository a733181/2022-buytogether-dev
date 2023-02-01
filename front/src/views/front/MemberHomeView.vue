<template>
  <div class="container py-20">
    <Breadcrumbs class="mb-10">
      <div class="flex">
        <RouterLink to="/products" class="hover:scale-105">商城</RouterLink>
        <p>&ensp;/&ensp;{{ memberHomeProduct?.member?.name || '' }}</p>
      </div>
    </Breadcrumbs>
    <div class="flex flex-row items-center gap-4">
      <img
        :src="memberHomeProduct?.member?.image || ''"
        :alt="memberHomeProduct?.member?.name || ''"
        class="w-16 h-16 rounded-full object-cover"
      />
      <p class="flex-1 text-xl">{{ memberHomeProduct?.member?.name || '' }}</p>
      <div v-if="memberHomeProduct?.member?._id !== users._id">
        <Btn
          v-if="showBlackBtn"
          :text="blackBtnText"
          className="btn-outline"
          class="mr-4"
          @click="
            clickListHandler({
              id: memberHomeProduct.member._id,
              type: 'black',
            })
          "
        />
        <Btn
          v-if="showTrackBtn"
          :text="trackBtnText"
          @click="clickListHandler({ id: memberHomeProduct.member._id })"
        />
      </div>
    </div>
    <div class="flex justify-center items-center gap-5 flex-wrap my-10">
      <Tab tab="全部" :active="activeTab" @click="activeTab = '全部'" />
      <Tab
        v-for="(item, index) in productCategory"
        :tab="item"
        :key="index"
        :active="activeTab"
        @click="activeTab = item"
      />
    </div>
    <div class="grid lg:grid-cols-4 gap-5 mb-10">
      <Card v-for="item in filterProduct" :key="item._id" :data="item" />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { ref, computed } from 'vue';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Tab from '@/components/ui/TheTab.vue';
import Card from '@/components/ui/TheCard.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useCategoryStore } from '@/stores/category';
import { useProductsStore } from '@/stores/products';
import { useUserStore } from '@/stores/users';

const route = useRoute();

const product = useProductsStore();
const category = useCategoryStore();
const user = useUserStore();
const { productCategory } = category;
const { getMemberSellProductHandler } = product;
const { memberHomeProduct } = storeToRefs(product);
const { clickListHandler } = user;
const { users, isMember } = storeToRefs(user);

getMemberSellProductHandler(route.params.id);

const activeTab = ref('全部');

const filterProduct = computed(() => {
  if (!memberHomeProduct.value) return [];
  if (activeTab.value === '全部') {
    return memberHomeProduct.value.data;
  }
  return memberHomeProduct.value.data.filter(
    (item) => item.category === activeTab.value
  );
});

const indexTrack = computed(() => {
  return users.value.track.findIndex(
    (item) => item === memberHomeProduct.value.member._id
  );
});

const indexBlack = computed(() => {
  return users.value.black.findIndex(
    (item) => item === memberHomeProduct.value.member._id
  );
});

const trackBtnText = computed(() => {
  if (!isMember.value) return '加入追蹤';
  return indexTrack.value === -1 ? '加入追蹤' : '取消追蹤';
});

const blackBtnText = computed(() => {
  if (!isMember.value) return '加入黑名單';
  return indexBlack.value === -1 ? '加入黑名單' : '取消黑名單';
});

const showTrackBtn = computed(() => {
  if (!isMember.value) return true;
  return !(blackBtnText.value === '取消黑名單');
});

const showBlackBtn = computed(() => {
  if (!isMember.value) return true;
  return !(trackBtnText.value === '取消追蹤');
});
</script>
