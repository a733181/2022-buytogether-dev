<template>
  <div class="container py-10">
    <Breadcrumbs class="mb-10">
      <div class="flex">
        <RouterLink to="/member/productlist" class="hover:scale-105"
          >商品管理</RouterLink
        >
        <p>
          {{
            editProduct._id ? '&ensp;/&ensp;修改商品' : '&ensp;/&ensp;新增商品'
          }}
        </p>
      </div>
    </Breadcrumbs>
    <form class="lg:w-1/2 mx-auto" @submit.prevent="submitHandler">
      <UploadImage
        v-model="form.image"
        title="商品主圖"
        :error="error.image.error"
        :errorText="error.image.value"
        @click="error.image.error = false"
        id="main-image"
      />
      <Input
        v-model="form.name"
        title="商品名稱"
        :error="error.name.error"
        :errorText="error.name.value"
        @click="error.name.error = false"
      />
      <Input
        v-model="form.price"
        title="價格"
        :error="error.price.error"
        :errorText="error.price.value"
        @click="error.price.error = false"
      />
      <Input
        v-model="form.maxNumber"
        title="全部數量"
        :error="error.maxNumber.error"
        :errorText="error.maxNumber.value"
        @click="error.maxNumber.error = false"
        :disabled="!!editProduct.maxNumber"
      />
      <p class="text-red-400">＊全部數量無法修改，請謹慎填寫</p>
      <Textarea
        v-model="form.description"
        title="商品描述"
        :error="error.description.error"
        :errorText="error.description.value"
        @click="error.description.error = false"
      />
      <Input
        v-model="form.bank"
        title="收款帳戶"
        :select="bankNewList"
        :error="error.bank.error"
        :errorText="error.bank.value"
        @click="error.bank.error = false"
      />
      <Input
        v-model="form.category"
        title="商品分類"
        :select="productCategory"
        :error="error.category.error"
        :errorText="error.category.value"
        @click="error.category.error = false"
      />
      <p>＊點選商品分類，選擇商品分類</p>
      <Input
        v-model="form.youtubeVideoLink"
        title="Youtube影片連結"
        :error="error.youtubeVideoLink.error"
        :errorText="error.youtubeVideoLink.value"
        @click="error.youtubeVideoLink.error = false"
      />
      <p class="mt-8">＊最多可上傳 9張圖片</p>
      <div class="mt-2 flex">
        <Btn
          v-if="!form.images.length || form.images.length < 9"
          text="新增圖片"
          class="w-1/4"
          @click="
            form.images.push({
              image: '',
            })
          "
        />
        <Btn
          v-if="form.images.length >= 1"
          text="刪除一筆"
          className="btn-outline"
          class="w-1/4 ml-auto"
          @click="form.images.pop()"
        />
      </div>
      <div class="flex flex-wrap mt-10">
        <div
          v-for="(img, index) in form.images"
          :key="index"
          class="w-[30%] mt-4 ml-4"
        >
          <UploadImage
            v-model="form.images[index].image"
            :id="`content-${index}`"
          />
        </div>
      </div>
      <Input title="上架" type="checkbox" v-model="form.isSell" id="isSell" />
      <div class="flex justify-between mt-8">
        <Btn
          text="取消"
          className="btn-outline"
          class="w-1/3"
          @click="cancelProductHandler"
        />
        <Btn
          type="sumbit"
          text="確定"
          class="w-1/3"
          :disabled="isLoading"
          :loading="isLoading"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import validator from 'validator';
import { isVideo, getVideoId } from 'is-youtube-url';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Input from '@/components/ui/TheInput.vue';
import Btn from '@/components/ui/TheBtn.vue';
import UploadImage from '@/components/ui/UploadImage.vue';
import Textarea from '@/components/ui/TheTextarea.vue';

import { useCategoryStore } from '@/stores/category';
import { useBankStore } from '@/stores/bank';
import { useProductsStore } from '@/stores/products';

const category = useCategoryStore();
const { productCategory } = category;
const { listBank } = storeToRefs(useBankStore());
const products = useProductsStore();
const { sumbitProductHandler, cancelProductHandler } = products;
const { editProduct } = storeToRefs(products);

const isLoading = ref(false);

const error = reactive({
  image: {
    error: false,
    value: '',
  },
  name: {
    error: false,
    value: '',
  },
  price: {
    error: false,
    value: '',
  },
  maxNumber: {
    error: false,
    value: '',
  },
  description: {
    error: false,
    value: '',
  },
  bank: {
    error: false,
    value: '',
  },
  category: {
    error: false,
    value: '',
  },
  youtubeVideoLink: {
    error: false,
    value: '',
  },
});

const bankNewList = computed(() => {
  if (!listBank.value) {
    return [];
  }

  return listBank.value.map((item) => `${item.bankName} - ${item.bankNumber}`);
});

const editBank = computed(() => {
  const index = listBank.value.findIndex(
    (item) => item._id === editProduct.value.bankId
  );

  if (index === -1) {
    return '';
  } else {
    return `${listBank.value[index].bankName} - ${listBank.value[index].bankNumber}`;
  }
});

const images = computed(() => {
  if (!editProduct.value.images) return [];
  return editProduct.value.images.map((item) => {
    return {
      image: item,
    };
  });
});

const form = reactive({
  _id: editProduct.value._id || '',
  name: editProduct.value.name || '',
  price: editProduct.value.price.toString() || '',
  maxNumber: editProduct.value.maxNumber.toString() || '',
  description: editProduct.value.description || '',
  image: editProduct.value.image || '',
  images: [...images.value],
  bank: editBank.value,
  isSell: editProduct.value.isSell || false,
  category: editProduct.value.category || '',
  youtubeVideoLink: editProduct.value.youtubeId
    ? `https://www.youtube.com/watch?v=${editProduct.value.youtubeId}`
    : '',
});

const validatorFormHandler = () => {
  if (form.image === null || form.image === '') {
    error.image.value = '為必填';
    error.image.error = true;
    return true;
  }
  if (validator.isEmpty(form.name)) {
    error.name.value = '為必填';
    error.name.error = true;
    return true;
  }
  if (validator.isEmpty(form.price)) {
    error.price.value = '為必填';
    error.price.error = true;
    return true;
  }
  if (validator.isEmpty(form.maxNumber)) {
    error.maxNumber.value = '為必填';
    error.maxNumber.error = true;
    return true;
  }
  if (validator.isEmpty(form.description)) {
    error.description.value = '為必填';
    error.description.error = true;
    return true;
  }
  if (validator.isEmpty(form.bank)) {
    error.bank.value = '為必填';
    error.bank.error = true;
    return true;
  }
  if (validator.isEmpty(form.category)) {
    error.category.value = '為必填';
    error.category.error = true;
    return true;
  }
  if (!validator.isNumeric(form.price)) {
    error.price.value = '不是數字';
    error.price.error = true;
    return true;
  }
  if (!validator.isNumeric(form.maxNumber)) {
    error.maxNumber.value = '不是數字';
    error.maxNumber.error = true;
    return true;
  }
  const isBank = listBank.value.some((item) => {
    const bank = form.bank.split('-');
    return (
      item.bankName === bank[0].trim() &&
      item.bankNumber.toString() === bank[1].trim()
    );
  });
  if (!isBank) {
    error.bank.value = '格式錯誤';
    error.bank.error = true;
    return true;
  }
  const isCategory = productCategory.some((item) => item === form.category);
  if (!isCategory) {
    error.category.value = '格式錯誤';
    error.category.error = true;
    return true;
  }

  if (form.youtubeVideoLink !== '') {
    if (!isVideo(form.youtubeVideoLink)) {
      error.youtubeVideoLink.value = '網址錯誤';
      error.youtubeVideoLink.error = true;
      return true;
    }
  }

  return false;
};

const submitHandler = async () => {
  if (validatorFormHandler()) return;
  isLoading.value = true;
  const bankIndex = listBank.value.findIndex((item) => {
    const bank = form.bank.split('-');
    return (
      item.bankName === bank[0].trim() &&
      item.bankNumber.toString() === bank[1].trim()
    );
  });

  const fd = new FormData();
  fd.append('_id', form._id);
  fd.append('name', form.name);
  fd.append('price', form.price);
  fd.append('maxNumber', form.maxNumber);
  fd.append('description', form.description);
  fd.append('image', form.image);
  fd.append('bankId', listBank.value[bankIndex]._id);
  fd.append('isSell', form.isSell);
  fd.append('category', form.category);

  const youtubeId = getVideoId(form.youtubeVideoLink);
  if (youtubeId) {
    fd.append('youtubeId', youtubeId);
  }

  if (form.images.length >= 1) {
    form.images.forEach((item) => {
      fd.append('images', item.image);
    });
  }
  await sumbitProductHandler(fd);

  isLoading.value = false;
};
</script>
