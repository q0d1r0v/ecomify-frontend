// imports
import { createRouter, createWebHistory } from "vue-router";

// layouts
import AuthLayout from "../layouts/auth.vue";
import AdminLayout from "../layouts/admin.vue";
import DefaultLayout from "../layouts/default.vue";
import NotFoundLayout from "../layouts/not-found-layout.vue";

// pages
import LoginPage from "../pages/auth/login.vue";
import DashboardPage from "../pages/admin/dashboard.vue";
import IndexPage from "../pages/index.vue";
import BannersPage from "../pages/admin/banners.vue";
import CategoriesPage from "../pages/admin/categories.vue";
import ProductsPage from "../pages/admin/products.vue";
import OrdersPage from "../pages/admin/orders.vue";
import UsersPage from "../pages/admin/users.vue";
import ShowProductsPage from "../pages/products.vue";
import ProductPage from "../pages/product.vue";
import NotFoundPage from "../pages/not-found-page.vue";

// export router
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/auth/",
      component: AuthLayout,
      children: [
        {
          path: "login",
          component: LoginPage,
          meta: {
            title: "Kirish",
          },
        },
      ],
    },
    {
      path: "/admin/",
      component: AdminLayout,
      children: [
        {
          path: "dashboard",
          component: DashboardPage,
          meta: {
            title: "Dashboard",
            auth: true,
          },
        },
        {
          path: "banners",
          component: BannersPage,
          meta: {
            title: "Bannerlar",
            auth: true,
          },
        },
        {
          path: "categories",
          component: CategoriesPage,
          meta: {
            title: "Kategoriyalar",
            auth: true,
          },
        },
        {
          path: "products",
          component: ProductsPage,
          meta: {
            title: "Tovarlar",
            auth: true,
          },
        },
        {
          path: "orders",
          component: OrdersPage,
          meta: {
            title: "Buyurtmalar",
            auth: true,
          },
        },
        {
          path: "users",
          component: UsersPage,
          meta: {
            title: "Foydalanuvchilar(admin)",
            auth: true,
          },
        },
      ],
    },
    {
      path: "/",
      component: DefaultLayout,
      children: [
        {
          path: "/",
          component: IndexPage,
          meta: {
            title: "Bosh sahifa",
          },
        },
        {
          path: "/products",
          component: ShowProductsPage,
          meta: {
            title: "Tovarlar",
          },
        },
        {
          path: "/product",
          component: ProductPage,
          meta: {
            title: "Tovar",
          },
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFoundLayout,
      children: [
        {
          path: "/:pathMatch(.*)*",
          component: NotFoundPage,
          meta: {
            title: "404",
          },
        },
      ],
    },
  ],
});

// auth middlewares
router.beforeEach((to, from, next) => {
  if (to.meta.auth == true && !localStorage.getItem("access_token")) {
    next("/");
  }
  next();
});
