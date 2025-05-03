import { createRouter, createWebHashHistory } from "vue-router";
import i18n from "@/plugins/i18n";
import productsStocks from "../views/dashboard/index.vue";
import mainLayout from "@/components/layouts-components/main-layout.vue";
import { usePermissions } from "@/composables/usePermissions";

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
          redirect: (to) => {
            const storedUser = localStorage.getItem("user");
            let userRole = null;
            if (storedUser) {
              try {
                userRole = JSON.parse(storedUser).role;
              } catch (error) {
                console.error(
                  "Error parsing user data from localStorage:",
                  error
                );
              }
            }
            return userRole === "admin" ? "/dashboard" : "/products-stocks";
          },
        },
        //products routes
        {
          path: "/dashboard",
          name: "dashboard",
          component: productsStocks,
          meta: {
            title: "meta.dashboard",
            requiresAuth: true,
            allowedRoles: ["admin"], // Only admin can access dashboard
          },
        },
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
            allowedRoles: ["admin", "employee"],
          },
        },
        {
          path: "/orders",
          name: "orders",
          component: () => import("../views/orders.vue"),
          meta: {
            title: "meta.orders",
            requiresAuth: true,
            allowedRoles: ["admin", "employee", "market_owner"],
          },
        },
        {
          path: "/users",
          name: "users",
          component: () => import("../views/users.vue"),
          meta: {
            title: "meta.users",
            requiresAuth: true,
            allowedRoles: ["admin", "employee"],
          },
        },
        // {
        //   path: "/messages",
        //   name: "messages",
        //   component: () => import("../views/messages.vue"),
        //   meta: {
        //     title: "meta.messages",
        //     requiresAuth: true,
        //     allowedRoles: ["admin", "employee"],
        //   },
        // },
        {
          path: "/new-merchants",
          name: "new-merchants",
          component: () => import("../views/new-merchants.vue"),
          meta: {
            title: "meta.new_merchants",
            requiresAuth: true,
            allowedRoles: ["admin", "employee"],
          },
        },
        {
          path: "/orders-from-merchants",
          name: "orders-from-merchants",
          component: () => import("../views/orders-from-merchants.vue"),
          meta: {
            title: "meta.orders_from_merchants",
            requiresAuth: true,
            allowedRoles: ["admin", "employee"],
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
          path: "/employees",
          name: "employees",
          component: () => import("../views/employees.vue"),
          meta: {
            title: "meta.employees",
            requiresAuth: true,
            allowedRoles: ["admin"],
          },
        },
        {
          path: "/users-ratings",
          name: "users-ratings",
          component: () => import("../views/users-ratings.vue"),
          meta: {
            title: "meta.users_ratings",
            requiresAuth: true,
            allowedRoles: ["admin"],
          },
        },
        {
          path: "/shipping-costs",
          name: "shipping-costs",
          component: () => import("../views/shipping-costs.vue"),
          meta: {
            title: "meta.shipping_costs",
            requiresAuth: true,
            allowedRoles: ["admin"],
          },
        },
        {
          path: "/settings",
          name: "settings",
          component: () => import("../views/settings.vue"),
          meta: {
            title: "meta.settings",
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
      path: "/register-new-merchant",
      name: "register-new-merchant",
      component: () => import("../views/register-new-merchant.vue"),
      meta: {
        title: "meta.register_new_merchant",
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
  const { hasPermission } = usePermissions();
  await authStore.init();

  // Get user role
  const storedUser = localStorage.getItem("user");
  let userRole = null;
  if (storedUser) {
    try {
      userRole = JSON.parse(storedUser).role;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next("/auth/login");
      return;
    }

    // Redirect from dashboard if not admin
    if (to.path === "/dashboard" && userRole !== "admin") {
      next("/products-stocks");
      return;
    }
  }

  if (authStore.isAuthenticated) {
    const requiredRoles = to.meta.allowedRoles;
    if (requiredRoles) {
      // Admin has full access
      if (userRole === "admin") {
        next();
        return;
      }
      // For employee, check permissions
      if (userRole === "employee") {
        // First check if the role is allowed
        if (!requiredRoles.includes("employee")) {
          next("/products-stocks");
          return;
        }
        // Then check specific permissions
        switch (to.name) {
          case "products-stocks":
            if (!hasPermission("products", "view")) {
              next("/products-stocks");
              return;
            }
            break;
          case "categories":
            if (!hasPermission("categories", "view")) {
              next("/products-stocks");
              return;
            }
            break;
          case "orders":
            if (!hasPermission("orders", "view")) {
              next("/products-stocks");
              return;
            }
            break;
          case "users":
            if (!hasPermission("users", "view")) {
              next("/products-stocks");
              return;
            }
            break;
          // case "messages":
          //   if (!hasPermission("messages", "view")) {
          //     next("/");
          //     return;
          //   }
          //   break;
          case "new-merchants":
            if (!hasPermission("new-merchants", "view")) {
              next("/products-stocks");
              return;
            }
            break;
          case "orders-from-merchants":
            if (!hasPermission("orders-from-merchants", "view")) {
              next("/products-stocks");
              return;
            }
            break;
          // Add other cases as needed
        }
      }
      // For market_owner
      if (
        userRole === "market_owner" &&
        !requiredRoles.includes("market_owner")
      ) {
        next("/products-stocks");
        return;
      }
      // For other roles, just check if role is allowed
      if (requiredRoles.includes(userRole)) {
        next();
        return;
      }
      next("/products-stocks");
      return;
    }
  }

  if (authStore.isAuthenticated && to.path.startsWith("/auth")) {
    next("/");
    return;
  }
  next();
});

export default router;
