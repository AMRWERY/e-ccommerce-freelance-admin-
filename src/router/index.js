import { createRouter, createWebHistory } from "vue-router";
import i18n from "@/plugins/i18n";
import home from "../views/home.vue";
import mainLayout from "@/components/layouts-components/main-layout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
        {
          path: "/products",
          name: "products",
          component: () => import("../views/products/index.vue"),
          meta: {
            title: "meta.products",
            requiresAuth: true,
            allowedRoles: ["admin", "market_owner"],
          },
        },
        {
          path: "/add-product",
          name: "add-product",
          component: () => import("../views/products/add-product.vue"),
          meta: {
            title: "meta.add_product",
            requiresAuth: true,
            allowedRoles: ["admin", "market_owner"],
          },
        },
        {
          path: "/edit-product/:id",
          name: "edit-product",
          component: () => import("../views/products/edit-product.vue"),
          meta: {
            title: "meta.edit_product",
            requiresAuth: true,
            allowedRoles: ["admin", "market_owner"],
          },
        },
        {
          path: "/categories",
          name: "categories",
          component: () => import("../views/categories.vue"),
          meta: {
            title: "meta.categories",
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
        next("/products");
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
