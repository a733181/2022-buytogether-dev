<template>
  <div class="container py-10">
    <Breadcrumbs class="mb-10" v-if="editAddress.type !== 'admin'">
      <div class="flex">
        <RouterLink
          to="/member/ship"
          class="text-primary font-bold hover:scale-105"
          >帳戶</RouterLink
        >
        <p>&ensp;/&ensp;</p>
        <RouterLink to="/member/addresslist" class="hover:scale-105"
          >地址列表</RouterLink
        >
        <p>
          {{
            !editAddress._id ? '&ensp;/&ensp;新增地址' : '&ensp;/&ensp;修改地址'
          }}
        </p>
      </div>
    </Breadcrumbs>
    <Breadcrumbs class="mb-10" v-else>
      <div class="flex">
        <RouterLink to="/member/shipadmin" class="hover:scale-105"
          >會員</RouterLink
        >
        <p>&ensp;/&ensp;</p>
        <RouterLink to="/member/adminaddress" class="hover:scale-105"
          >地址列表</RouterLink
        >
        <p>
          {{
            !editAddress._id ? '&ensp;/&ensp;新增地址' : '&ensp;/&ensp;修改地址'
          }}
        </p>
      </div>
    </Breadcrumbs>
    <form @submit.prevent="submitHandler">
      <Input title="郵遞區號" :disabled="true" :value="code" />
      <Input
        title="城市"
        v-model="form.city"
        :error="error.city.error"
        :errorText="error.city.value"
        @click="error.city.error = false"
        :select="city"
      />
      <p>請點選城市，選擇城市</p>
      <Input
        title="區鄉鎮"
        v-model="form.districts"
        :error="error.districts.error"
        :errorText="error.districts.value"
        @click="error.districts.error = false"
        :select="districts"
      />
      <p>請點選區鄉鎮，選擇區鄉鎮</p>
      <Input
        title="街道"
        v-model="form.street"
        :error="error.street.error"
        :errorText="error.street.value"
        @click="error.street.error = false"
      />
      <Input
        v-if="editAddress.type === 'user'"
        title="同帳號姓名"
        type="checkbox"
        v-model="accountName"
      />
      <Input
        title="姓名"
        v-model="form.name"
        :error="error.name.error"
        :errorText="error.name.value"
        @click="error.name.error = false"
      />
      <Input
        v-if="editAddress.type === 'user'"
        title="同帳號電話"
        type="checkbox"
        v-model="accountPhone"
      />
      <Input
        title="電話"
        v-model="form.phone"
        :error="error.phone.error"
        :errorText="error.phone.value"
        @click="error.phone.error = false"
      />
      <Input
        title="預設"
        type="checkbox"
        v-model="form.preset"
        id="addressPreset"
      />
      <div class="flex justify-between mt-8">
        <Btn
          text="取消"
          className="btn-outline"
          class="w-1/3"
          @click="cancelAddressHandler"
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
import validator from 'validator';
import { ref, reactive, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

import Breadcrumbs from '@/components/ui/TheBreadcrumbs.vue';
import Input from '@/components/ui/TheInput.vue';
import Btn from '@/components/ui/TheBtn.vue';

import { useCategoryStore } from '@/stores/category';
import { useUserStore } from '@/stores/users';
import { useAddressStore } from '@/stores/address';

const category = useCategoryStore();
const { districtsList } = category;
const user = useUserStore();
const { users } = storeToRefs(user);
const address = useAddressStore();
const { sumbitAddressHandler, cancelAddressHandler } = address;
const { editAddress } = storeToRefs(address);

const accountPhone = ref(editAddress.value?.phone === users.value.phone);
const accountName = ref(editAddress.value?.name === users.value.name);

const isLoading = ref(false);

const form = reactive({
  _id: editAddress.value._id || '',
  userId: editAddress.value.userId || null,
  city: editAddress.value.city || '',
  districts: editAddress.value.districts || '',
  street: editAddress.value.street || '',
  name: editAddress.value.name || '',
  phone: editAddress.value.phone || '',
  preset: editAddress.value.preset,
});

const error = reactive({
  city: {
    error: false,
    value: '',
  },
  districts: {
    error: false,
    value: '',
  },
  street: {
    error: false,
    value: '',
  },
  name: {
    error: false,
    value: '',
  },
  phone: {
    error: false,
    value: '',
  },
});

const code = computed(() => {
  if (form.districts && form.districts.length > 2) {
    const codeNumber = districtsList
      .filter((item) => item.name === form.city)[0]
      .districts.filter((item) => item.name === form.districts)[0].zip;
    return codeNumber;
  }
  return '';
});

const city = computed(() => {
  return districtsList.map((item) => item.name);
});

const districts = computed(() => {
  if (form.city !== '') {
    return districtsList
      .filter((item) => item.name === form.city)[0]
      .districts.map((item) => item.name);
  }
  return [];
});

watch(accountPhone, (value) => {
  if (value) {
    form.phone = users.value.phone;
  } else {
    form.phone = '';
  }
});
watch(accountName, (value) => {
  if (value) {
    form.name = users.value.name || '';
  } else {
    form.name = '';
  }
});

const validatorFormHandler = () => {
  if (validator.isEmpty(form.city)) {
    error.city.value = '為必填';
    error.city.error = true;
    return true;
  }
  if (validator.isEmpty(form.districts)) {
    error.districts.value = '為必填';
    error.districts.error = true;
    return true;
  }
  if (validator.isEmpty(form.street)) {
    error.street.value = '為必填';
    error.street.error = true;
    return true;
  }
  if (validator.isEmpty(form.phone)) {
    error.phone.value = '為必填';
    error.phone.error = true;
    return true;
  }
  if (validator.isEmpty(form.name)) {
    error.name.value = '為必填';
    error.name.error = true;
    return true;
  }
  if (!validator.isMobilePhone(form.phone, ['zh-TW'])) {
    error.phone.value = '格式錯誤';
    error.phone.error = true;
    return true;
  }

  if (!city.value.some((item) => item === form.city)) {
    error.city.value = '格式錯誤';
    error.city.error = true;
    return true;
  }

  if (!districts.value.some((item) => item === form.districts)) {
    error.districts.value = '格式錯誤';
    error.districts.error = true;
    return true;
  }

  return false;
};

const submitHandler = async () => {
  if (validatorFormHandler()) return;

  isLoading.value = true;
  form.code = Number(code.value);
  await sumbitAddressHandler(form);
  isLoading.value = false;
};
</script>
