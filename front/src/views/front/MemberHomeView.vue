<template>
  <div class="container pt-44 lg:pt-32 pb-10">
    <Breadcrumbs class="mb-10">
      <div class="flex">
        <RouterLink to="/" class="text-primary font-bold hover:opacity-60"
          >精選商品</RouterLink
        >
        <span>&ensp;/&ensp;{{ memberHomeProduct?.member?.name || '' }}</span>
        <span v-if="breadSearch">&ensp;/&ensp;{{ breadSearch }}</span>
      </div>
    </Breadcrumbs>
    <div class="flex flex-row items-center gap-4 mb-10">
      <img
        :src="memberHomeProduct?.member.image || ''"
        :alt="memberHomeProduct?.member.name || ''"
        class="w-16 h-16 rounded-full object-cover"
      />
      <p class="text-xl">{{ memberHomeProduct?.member?.name || '' }}</p>
      <Btn
        v-if="users._id !== memberHomeProduct.member._id"
        text="悄悄話"
        @click="
          addChatUserHandler({
            toUserId: memberHomeProduct.member._id,
            name: memberHomeProduct.member.name,
            image: memberHomeProduct.member.image,
          })
        "
      />
      <div v-if="memberHomeProduct?.member?._id !== users._id" class="ml-auto">
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
    <div class="flex mb-6 gap-7 items-center justify-between">
      <Select v-model="filter" :select="sortProduct" class="w-32 h-[44px]" />

      <div class="-mt-12 relative ml-auto">
        <form @submit.prevent="submitHandler" class="flex gap-5 items-center">
          <Input v-model="searchKey" class="-mt-10" />
          <Btn type="submit" className="btn-gray" text="搜尋" />
        </form>
      </div>
    </div>
    <div class="flex">
      <div class="flex gap-5 flex-col mr-10 lg:w-32">
        <Tab
          tab="全部"
          :active="activeTab"
          @click="changeCategoryHandler('全部')"
        />
        <Tab
          v-for="(item, index) in productCategory"
          :tab="item"
          :key="index"
          :active="activeTab"
          @click="changeCategoryHandler(item)"
        />
      </div>
      <div class="flex-1">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          <Card v-for="item in filterData" :key="item._id" :data="item" />
        </div>
        <div class="w-min mx-auto">
          <Pagination
            v-if="productPage.total > 1"
            :total="productPage.total"
            :current="productPage.current"
            @current="changePageHandler"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { ref, computed, onUnmounted } from 'vue';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Select from '@/components/ui/TheSelect.vue';
import Tab from '@/components/ui/TheTab.vue';
import Card from '@/components/ui/TheCard.vue';
import Btn from '@/components/ui/TheBtn.vue';
import Input from '@/components/ui/TheInput.vue';
import Pagination from '@/components/ui/ThePagination.vue';

import { useCategoryStore } from '@/stores/category';
import { useProductsStore } from '@/stores/products';
import { useUserStore } from '@/stores/users';
import { useChats } from '@/stores/chats';

const route = useRoute();
const product = useProductsStore();
const user = useUserStore();
const { productCategory, sortProduct } = useCategoryStore();
const { getMemberSellProductHandler } = product;
const { memberHomeProduct, productPage } = storeToRefs(product);
const { clickListHandler } = user;
const { users, isMember } = storeToRefs(user);
const { addChatUserHandler } = useChats();

getMemberSellProductHandler({ userId: route.params.id });

const activeTab = ref('全部');
const filter = ref(sortProduct[0]);
const breadSearch = ref('');
const searchKey = ref('');

const filterData = computed(() => {
  if (filter.value === sortProduct[0]) {
    return memberHomeProduct.value.data;
  }
  const copydata = JSON.parse(JSON.stringify(memberHomeProduct.value.data));

  if (filter.value === sortProduct[1] || filter.value === sortProduct[2]) {
    return copydata.sort((itemA, itemB) => {
      if (filter.value === sortProduct[1]) {
        return itemA.price < itemB.price ? 1 : -1;
      }
      if (filter.value === sortProduct[2]) {
        return itemA.price < itemB.price ? -1 : 1;
      }
    });
  }
  if (filter.value === sortProduct[3] || filter.value === sortProduct[4]) {
    return copydata.sort((itemA, itemB) => {
      if (filter.value === sortProduct[3]) {
        return itemA.remaining < itemB.remaining ? 1 : -1;
      }
      if (filter.value === sortProduct[4]) {
        return itemA.remaining < itemB.remaining ? -1 : 1;
      }
    });
  }
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

const changeCategoryHandler = (tab) => {
  activeTab.value = tab;
  getMemberSellProductHandler({
    userId: route.params.id,
    category: activeTab.value,
  });
};

const changePageHandler = (page) => {
  productPage.value.current = page;
  getMemberSellProductHandler({
    userId: route.params.id,
    category: activeTab.value,
  });
};

const submitHandler = () => {
  getMemberSellProductHandler({
    userId: route.params.id,
    key: searchKey.value,
  });
  breadSearch.value = searchKey.value;
  searchKey.value = '';
};

const cancelSearchHandler = () => {
  breadSearch.value = '';
  getMemberSellProductHandler({
    userId: route.params.id,
    category: activeTab.value,
  });
};

onUnmounted(() => {
  productPage.value.current = 1;
});
</script>
