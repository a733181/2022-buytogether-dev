<template>
  <div class="container py-20">
    <Breadcrumbs class="mb-10">
      <div class="flex">
        <RouterLink to="/products" class="hover:scale-105">商城</RouterLink>
        <span>&ensp;/&ensp;{{ memberHomeProduct?.member?.name || '' }}</span>
        <span v-if="breadSearch">&ensp;/&ensp;{{ breadSearch }}</span>
      </div>
    </Breadcrumbs>
    <div class="flex flex-row items-center gap-4 mb-10">
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
    <div class="flex items-center mb-6 gap-7">
      <Select v-model="filter" :select="sortProduct" />
      <Tab
        v-if="!!breadSearch"
        tab="取消搜尋"
        class="mb-2"
        @click="cancelSearchHandler"
      />
      <div class="-mt-12 relative ml-auto">
        <form @submit.prevent="submitHandler">
          <Input
            v-model="searchKey"
            :error="error.error"
            :errorText="error.value"
            @click="error.error = false"
          />
          <button
            type="sumbit"
            class="hover:opacity-50 absolute bottom-[0.6rem] right-2"
            :class="{ 'bottom-[2.1rem]': error.error }"
          >
            <img src="@/assets/svg/search.svg" class="w-6 h-full" />
          </button>
        </form>
      </div>
    </div>
    <div class="flex">
      <div v-if="!breadSearch" class="flex gap-5 flex-col mr-10">
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
        <div class="grid lg:grid-cols-3 gap-5 mb-10">
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
import { ref, computed, reactive, onUnmounted } from 'vue';
import validator from 'validator';

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

const route = useRoute();
const product = useProductsStore();
const user = useUserStore();
const { productCategory, sortProduct } = useCategoryStore();
const { getMemberSellProductHandler } = product;
const { memberHomeProduct, productPage } = storeToRefs(product);
const { clickListHandler } = user;
const { users, isMember } = storeToRefs(user);

getMemberSellProductHandler({ userId: route.params.id });

const activeTab = ref('全部');
const filter = ref(sortProduct[0]);
const breadSearch = ref('');
const searchKey = ref('');
const error = reactive({
  error: false,
  value: '',
});

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

const validatorFormHandler = () => {
  if (validator.isEmpty(searchKey.value)) {
    error.value = '搜尋為必填';
    error.error = true;
    return true;
  }

  return false;
};

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
  if (validatorFormHandler()) return;
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
