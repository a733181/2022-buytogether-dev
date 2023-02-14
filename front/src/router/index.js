import { createRouter, createWebHashHistory } from 'vue-router';
import FrontLayout from '@/layout/front/FrontView.vue';
import FrontHome from '@/views/front/HomeView.vue';
import { useUserStore } from '@/stores/users';
import { useSwalStore } from '@/stores/swal';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: FrontLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: FrontHome,
          meta: {
            title: '團購趣',
            member: false,
            admin: false,
          },
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/front/AboutView.vue'),
          meta: {
            title: '團購趣 | 關於我',
            member: false,
            admin: false,
          },
        },
        {
          path: 'product:/:id',
          name: 'product',
          component: () => import('@/views/front/ProductView.vue'),
          meta: {
            title: '團購趣 | 商品',
            member: false,
            admin: false,
          },
        },
        {
          path: 'membership',
          name: 'membership',
          component: () => import('@/views/front/MembershipView.vue'),
          meta: {
            title: '團購趣 | 登入/註冊',
            member: false,
            admin: false,
          },
        },
        {
          path: 'memberhome:/:id',
          name: 'member-home',
          component: () => import('@/views/front/MemberHomeView.vue'),
          meta: {
            title: '團購趣 | 圖主主頁',
            member: false,
            admin: false,
          },
        },
        {
          path: 'tracklist',
          name: 'tracklist',
          component: () => import('@/views/front/TrackView.vue'),
          meta: {
            title: '團購趣 | 追蹤名單',
            member: true,
            admin: false,
          },
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/views/front/CartView.vue'),
          meta: {
            title: '團購趣 | 購物車',
            member: true,
            admin: false,
          },
        },
        {
          path: 'paid',
          name: 'paid',
          component: () => import('@/views/front/PaidView.vue'),
          meta: {
            title: '團購趣 | 購物車',
            member: true,
            admin: false,
          },
        },
      ],
    },
    {
      path: '/member',
      redirect: '/member/order',
      component: () => import('@/layout/back/BackView.vue'),
      children: [
        {
          path: 'orderlist',
          name: 'member-orderlist',
          component: () => import('@/views/back/order/OrderView.vue'),
          meta: {
            title: '團購趣 | 訂單管理',
            member: true,
            admin: false,
          },
        },
        {
          path: 'productlist',
          name: 'member-productlist',
          component: () => import('@/views/back/product/ProductListView.vue'),
          meta: {
            title: '團購趣 | 商品管理',
            member: true,
            admin: false,
          },
        },
        {
          path: 'product',
          name: 'member-product',
          component: () => import('@/views/back/product/ProductView.vue'),
          meta: {
            title: '團購趣 | 新增商品',
            member: true,
            admin: false,
          },
        },
        {
          path: 'ship',
          name: 'member-membership',
          component: () => import('@/views/back/user/MemberView.vue'),
          meta: {
            title: '團購趣 | 會員設定',
            member: true,
            admin: false,
          },
        },
        {
          path: 'banklist',
          name: 'member-banklist',
          component: () => import('@/views/back/bank/BankListView.vue'),
          meta: {
            title: '團購趣 | 帳戶設定',
            member: true,
            admin: false,
          },
        },
        {
          path: 'bankinfo',
          name: 'member-bankinfo',
          component: () => import('@/views/back/bank/BankInfoView.vue'),
          meta: {
            title: '團購趣 | 帳戶資訊',
            member: true,
            admin: false,
          },
        },
        {
          path: 'nameinfo',
          name: 'member-nameinfo',
          component: () => import('@/views/back/user/NameInfoView.vue'),
          meta: {
            title: '團購趣 | 姓名',
            member: true,
            admin: false,
          },
        },
        {
          path: 'emailinfo',
          name: 'member-emailinfo',
          component: () => import('@/views/back/user/EmailInfoView.vue'),
          meta: {
            title: '團購趣 | Email',
            member: true,
            admin: false,
          },
        },
        {
          path: 'addresslist',
          name: 'member-addresslist',
          component: () => import('@/views/back/address/AddressListView.vue'),
          meta: {
            title: '團購趣 | 地址列表',
            member: true,
            admin: false,
          },
        },
        {
          path: 'addressInfo',
          name: 'member-addressinfo',
          component: () => import('@/views/back/address/AddressInfoView.vue'),
          meta: {
            title: '團購趣 | 地址設定',
            member: true,
            admin: false,
          },
        },
        {
          path: 'blacklist',
          name: 'blacklist',
          component: () => import('@/views/back/user/BlackView.vue'),
          meta: {
            title: '團購趣 | 黑名單',
            member: true,
            admin: false,
          },
        },
        {
          path: 'qanda',
          name: 'qanda',
          component: () => import('@/views/back/question/QAandA.vue'),
          meta: {
            title: '團購趣 | 問與答',
            member: true,
            admin: false,
          },
        },
        {
          path: 'message',
          name: 'message',
          component: () => import('@/views/back/question/MessageView.vue'),
          meta: {
            title: '團購趣 | 回覆',
            member: true,
            admin: false,
          },
        },
        {
          path: 'orderalllist',
          name: 'member-orderalllist',
          component: () => import('@/views/back/order/OrderAdminView.vue'),
          meta: {
            title: '團購趣 | 所有訂單管理',
            member: true,
            admin: true,
          },
        },
        {
          path: 'productalllist',
          name: 'member-productalllist',
          component: () =>
            import('@/views/back/product/ProductListAdminView.vue'),
          meta: {
            title: '團購趣 | 所有商品管理',
            member: true,
            admin: true,
          },
        },
        {
          path: 'shipadmin',
          name: 'member-admin',
          component: () => import('@/views/back/user/MemberAdminView.vue'),
          meta: {
            title: '團購趣 | 所有會員',
            member: true,
            admin: true,
          },
        },
        {
          path: 'shipadmininfo',
          name: 'member-admininfo',
          component: () => import('@/views/back/user/MemberAdminInfoView.vue'),
          meta: {
            title: '團購趣 | 會員編輯',
            member: true,
            admin: true,
          },
        },
        {
          path: 'adminbank',
          name: 'member-adminbank',
          component: () => import('@/views/back/bank/BankListAdminView.vue'),
          meta: {
            title: '團購趣 | 會員帳戶',
            member: true,
            admin: true,
          },
        },
        {
          path: 'adminaddress',
          name: 'member-adminaddress',
          component: () =>
            import('@/views/back/address/AddressListAdminView.vue'),
          meta: {
            title: '團購趣 | 會員地址',
            member: true,
            admin: true,
          },
        },
        {
          path: 'memberadminadd',
          name: 'member-add',
          component: () => import('@/views/back/user/MemberAddAdminView.vue'),
          meta: {
            title: '團購趣 | 新增會員',
            member: true,
            admin: true,
          },
        },
        {
          path: 'memberproductinfo',
          name: 'member-productinfo',
          component: () => import('@/views/back/product/ProductAdminView.vue'),
          meta: {
            title: '團購趣 | 商品',
            member: true,
            admin: true,
          },
        },
        {
          path: 'aboutmessage',
          name: 'member-aboutmessage',
          component: () => import('@/views/back/question/MessageAdminView.vue'),
          meta: {
            title: '團購趣 | 商品',
            member: true,
            admin: true,
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'all',
      redirect: '/',
      meta: {
        member: false,
        admin: false,
      },
    },
  ],
});

router.afterEach((to, from) => {
  document.title = to.meta.title;
  window.scrollTo(0, 0);
});

router.beforeEach(async (to, from, next) => {
  const user = useUserStore();
  const swal = useSwalStore();
  if (user.isMember && to.path === '/membership') {
    next('/');
  } else if (to.meta.member && !user.isMember) {
    swal.swalError('請先登入');
    next('/membership');
  } else if (to.meta.admin && !user.isAdmin) {
    next('/');
  } else {
    next();
  }
});

export default router;
