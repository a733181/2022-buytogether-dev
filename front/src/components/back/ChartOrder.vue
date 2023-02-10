<template>
  <Select v-model="selectActive" :select="select" class="mb-6" />
  <p v-if="!categoryQuantity.length" class="text-center text-2xl">沒有資料</p>
  <div v-else>
    <div class="flex gap-2 items-center">
      <p>年份：</p>
      <Select v-model="yearsActive" :select="years" />
    </div>
    <Bar id="chart" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import { storeToRefs } from 'pinia';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

import Select from '@/components/ui/TheSelect.vue';

import { useOrderStore } from '@/stores/orders';
import { useCategoryStore } from '@/stores/category';
const order = useOrderStore();
const { orderSell, orderBuy } = storeToRefs(order);
const category = useCategoryStore();
const { productCategory } = category;

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const select = ['購買圖表', '銷售圖表'];
const selectActive = ref(select[0]);
const years = ref(['全部']);
const yearsActive = ref('全部');
const chartData = ref();

const categoryQuantity = computed(() => {
  const orderAll = [];
  const newData = [];
  if (selectActive.value === '購買圖表') {
    orderBuy.value.forEach((prod) => {
      const orderYears = new Date(prod.createDate).getFullYear();
      const yearsIndex = years.value.findIndex((item) => item === orderYears);
      if (yearsIndex === -1) {
        years.value.push(orderYears);
      }

      prod.products.forEach((item) => {
        orderAll.push({
          paid: item.paid.isPaid,
          category: item.productId.category,
          quantity: item.quantity,
          shippingStatus: item.shippingStatus,
          orderYears,
        });
      });
    });
    productCategory.forEach((category) => {
      orderAll.forEach((item) => {
        const activeYear = yearsActive.value || '全部';
        const isYear =
          activeYear === '全部' ? true : yearsActive.value === item.orderYears;
        if (item.category === category && isYear) {
          const index = newData.findIndex((item) => item.category === category);
          if (index === -1) {
            newData.push({
              category,
              sum: item.quantity,
            });
          } else {
            newData[index].sum += item.quantity;
          }
        }
      });
    });
  } else {
    orderSell.value.forEach((prod) => {
      const orderYears = new Date(prod.createDate).getFullYear();
      const yearsIndex = years.value.findIndex((item) => item === orderYears);
      if (yearsIndex === -1) {
        years.value.push(orderYears);
      }
      prod.products.forEach((item) => {
        orderAll.push({
          paid: item.paid.isPaid,
          category: item.productId.category,
          quantity: item.quantity,
          shippingStatus: item.shippingStatus,
          orderYears,
        });
      });
    });
    productCategory.forEach((category) => {
      orderAll.forEach((item) => {
        const activeYear = yearsActive.value || '全部';
        const isYear =
          activeYear === '全部' ? true : yearsActive.value === item.orderYears;
        if (item.category === category && isYear) {
          const index = newData.findIndex((item) => item.category === category);
          if (index === -1) {
            newData.push({
              category,
              sum: item.quantity,
            });
          } else {
            newData[index].sum += item.quantity;
          }
        }
      });
    });
  }

  return newData;
});

const randerChart = () => {
  chartData.value = {
    labels: categoryQuantity.value.map((item) => item.category),
    datasets: [
      {
        label: selectActive.value,
        backgroundColor: '#f87979',
        data: categoryQuantity.value.map((item) => item.sum),
      },
    ],
  };
};
randerChart();
const chartOptions = ref({ responsive: true });

watch(categoryQuantity, () => {
  randerChart();
});

watch(yearsActive, () => {
  randerChart();
});
</script>
