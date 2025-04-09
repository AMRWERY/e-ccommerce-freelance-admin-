import { createRouter, createWebHashHistory } from "vue-router";
import i18n from "@/plugins/i18n";
import home from "../views/home.vue";
import mainLayout from "@/components/layouts-components/main-layout.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: mainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "home",
          component: home,
          meta: {
            title: "meta.home",
            requiresAuth: true,
            allowedRoles: ["admin", "market_owner"],
          },
        },
        //products routes
        {
          path: "/products-stocks",
          name: "products-stocks",
          component: () => import("../views/products-stocks/index.vue"),
          meta: {
            title: "meta.products_stocks",
            requiresAuth: true,
            allowedRoles: ["admin", "market_owner", "employee"],
          },
        },
        //categories routes
        {
          path: "/categories",
          name: "categories",
          component: () => import("../views/categories/index.vue"),
          meta: {
            title: "meta.categories",
            requiresAuth: true,
            allowedRoles: ["admin", "market_owner", "employee"],
          },
        },
        {
          path: "/categories/add",
          name: "add-category",
          component: () => import("../views/categories/category-form.vue"),
          meta: {
            title: "meta.add_category",
            requiresAuth: true,
            allowedRoles: ["admin", "market_owner", "employee"],
          },
        },
        {
          path: "/categories/edit/:id",
          name: "edit-category",
          component: () => import("../views/categories/category-form.vue"),
          meta: {
            title: "meta.edit_category",
            requiresAuth: true,
            allowedRoles: ["admin", "market_owner", "employee"],
          },
          props: true,
        },
        {
          path: "/orders",
          name: "orders",
          component: () => import("../views/orders.vue"),
          meta: {
            title: "meta.orders",
            requiresAuth: true,
            allowedRoles: ["admin", "employee"],
          },
        },
        {
          path: "/users",
          name: "users",
          component: () => import("../views/users.vue"),
          meta: {
            title: "meta.users",
            requiresAuth: true,
            allowedRoles: ["admin"],
          },
        },
        {
          path: "/markets",
          name: "markets",
          component: () => import("../views/markets.vue"),
          meta: {
            title: "meta.markets",
            requiresAuth: true,
            allowedRoles: ["admin"],
          },
        },

        //dropdowm manu routes
        {
          path: "/profile",
          name: "profile",
          component: () => import("../views/profile.vue"),
          meta: {
            title: "meta.profile",
            requiresAuth: true,
            allowedRoles: ["admin", "market_owner", "employee"],
          },
        },
        {
          path: "/earnings",
          name: "earnings",
          component: () => import("../views/earnings.vue"),
          meta: {
            title: "meta.earnings",
            requiresAuth: true,
            allowedRoles: ["admin"],
          },
        },
      ],
    },

    {
      path: "/auth/sign-up",
      name: "sign-up",
      component: () => import("../views/auth/sign-up.vue"),
      meta: {
        title: "meta.sign_up",
        allowedRoles: ["admin"],
      },
    },
    {
      path: "/auth/login",
      name: "login",
      component: () => import("../views/auth/login.vue"),
      meta: {
        title: "meta.login",
      },
    },
    {
      path: "/auth/reset-password",
      name: "reset-password",
      component: () => import("../views/auth/reset-password.vue"),
      meta: {
        title: "meta.reset_password",
      },
    },
    {
      path: "/register-new-market",
      name: "register-new-market",
      component: () => import("../views/register-new-market.vue"),
      meta: {
        title: "meta.register_new_market",
      },
    },

    //error-404
    {
      path: "/:catchAll(.*)",
      name: "error-404",
      component: () => import("../views/error-404.vue"),
      meta: {
        title: "meta.page_not_found",
      },
    },
  ],

  scrollBehavior() {
    return { top: 0, left: 0, behavior: "smooth" };
  },
});

router.afterEach((to) => {
  const titleKey = to.meta.title;
  document.title = i18n.global.t(titleKey);
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  await authStore.init();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next("/auth/login");
      return;
    }
  }
  if (authStore.isAuthenticated) {
    const requiredRoles = to.meta.allowedRoles;
    if (requiredRoles) {
      const storedUser = localStorage.getItem("user");
      let userRole = null;
      if (storedUser) {
        try {
          userRole = JSON.parse(storedUser).role;
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
        }
      }
      if (to.name === "home" && userRole === "market_owner") {
        next("/products-stocks");
        return;
      }
      if (!requiredRoles.includes(userRole)) {
        next("/");
        return;
      }
    }
  }
  if (authStore.isAuthenticated && to.path.startsWith("/auth")) {
    next("/");
    return;
  }
  next();
});

export default router;
