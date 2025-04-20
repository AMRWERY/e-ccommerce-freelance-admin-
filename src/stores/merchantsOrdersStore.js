import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";

export const useMerchantsOrdersStore = defineStore("merchantsOrders", {
  state: () => ({
    orders: [],
    paginatedOrders: [],
    currentPage: 1,
    ordersPerPage: 8,
    loading: false,
    error: null,
    merchantId: null,
    isAdmin: false,
  }),

  actions: {
    // Get merchant ID from email
    async getMerchantId(email) {
      try {
        if (!email) throw new Error("Email is required");

        console.log("Getting merchant ID for email:", email);

        // First try to get from localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          console.log("Found user in localStorage:", user);
          if (user.email === email && user.uid) {
            console.log("Setting merchantId from localStorage:", user.uid);
            this.merchantId = user.uid;
            return this.merchantId;
          }
        }
        // If not found in localStorage, try new-merchants collection
        // console.log("Checking new-merchants collection");
        const merchantsQuery = query(
          collection(db, "new-merchants"),
          where("email", "==", email)
        );
        const merchantSnapshot = await getDocs(merchantsQuery);
        if (!merchantSnapshot.empty) {
          const merchantData = merchantSnapshot.docs[0].data();
          console.log("Found merchant in new-merchants:", merchantData);
          this.merchantId = merchantData.userId || merchantData.uid;
          // console.log(
          //   "Setting merchantId from new-merchants:",
          //   this.merchantId
          // );
          return this.merchantId;
        }
        // If still not found, try users collection
        // console.log("Checking users collection");
        const usersQuery = query(
          collection(db, "users"),
          where("email", "==", email)
        );
        const userSnapshot = await getDocs(usersQuery);
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          // console.log("Found user in users collection:", userData);
          this.merchantId = userData.uid;
          // console.log("Setting merchantId from users:", this.merchantId);
          return this.merchantId;
        }
        throw new Error("Merchant not found");
      } catch (error) {
        console.error("Error getting merchant ID:", error);
        this.error = error.message;
        throw error;
      }
    },

    // Create a new merchant order
    async createMerchantOrder(orderData) {
      try {
        this.loading = true;
        if (!this.merchantId && !orderData.merchantId) {
          throw new Error("Merchant ID is required");
        }
        // Use existing merchantId or the one from orderData
        const merchantId = this.merchantId || orderData.merchantId;
        const orderRef = collection(db, "merchants-orders");
        const newOrder = {
          ...orderData,
          merchantId,
          status: "pending",
          createdAt: new Date(),
          orderId: `MO-${Date.now()}`,
        };
        const docRef = await addDoc(orderRef, newOrder);
        // Only fetch orders if we're on the orders page
        if (window.location.pathname.includes("orders")) {
          await this.fetchMerchantOrders();
        }
        return {
          success: true,
          message: "Order created successfully",
          orderId: docRef.id,
        };
      } catch (error) {
        console.error("Error creating merchant order:", error);
        this.error = error.message;
        return {
          success: false,
          message: error.message,
          error: error,
        };
      } finally {
        this.loading = false;
      }
    },

    // Initialize store based on user role
    async initializeStore(userRole) {
      try {
        this.loading = true;
        if (!userRole) {
          throw new Error("User role information is required");
        }
        this.isAdmin = userRole.role === "admin";
        if (userRole.role === "market_owner") {
          if (!userRole.email) {
            throw new Error("Email is required for market owner");
          }
          // If we have uid in userRole, use it directly
          if (userRole.uid) {
            this.merchantId = userRole.uid;
          } else {
            // Fallback to email lookup
            await this.getMerchantId(userRole.email);
          }
          if (!this.merchantId) {
            throw new Error(
              "Could not find merchant ID for the provided email"
            );
          }
          await this.fetchMerchantOrders();
          return true;
        } else if (userRole.role === "admin") {
          await this.fetchAllMerchantOrders();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error initializing store:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch all merchant orders (admin only)
    async fetchAllMerchantOrders() {
      try {
        this.loading = true;
        const ordersQuery = query(
          collection(db, "merchants-orders"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(ordersQuery);
        this.orders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.updatePagination();
      } catch (error) {
        console.error("Error fetching all merchant orders:", error);
        this.error = error.message;
        this.orders = [];
      } finally {
        this.loading = false;
      }
    },

    // Fetch orders for a specific merchant
    async fetchMerchantOrders() {
      try {
        this.loading = true;
        if (!this.merchantId && !this.isAdmin) {
          throw new Error("No merchant ID provided");
        }
        let ordersQuery;
        if (this.isAdmin) {
          ordersQuery = query(
            collection(db, "merchants-orders"),
            orderBy("createdAt", "desc")
          );
        } else {
          // For market owners, first check if index exists
          try {
            ordersQuery = query(
              collection(db, "merchants-orders"),
              where("merchantId", "==", this.merchantId),
              orderBy("createdAt", "desc")
            );
          } catch (indexError) {
            console.error(
              "Index error, falling back to basic query:",
              indexError
            );
            // Fallback to basic query without ordering
            ordersQuery = query(
              collection(db, "merchants-orders"),
              where("merchantId", "==", this.merchantId)
            );
          }
        }
        const querySnapshot = await getDocs(ordersQuery);
        // Transform and sort the data
        let ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        // If we had to use the fallback query, sort manually
        if (!ordersQuery.toString().includes("orderBy")) {
          ordersData.sort((a, b) => b.createdAt - a.createdAt);
        }
        this.orders = ordersData;
        this.updatePagination();
      } catch (error) {
        console.error("Error fetching merchant orders:", error);
        this.error = error.message;
        this.orders = [];
      } finally {
        this.loading = false;
      }
    },

    // Update order status
    async updateOrderStatus(orderId, status) {
      try {
        this.loading = true;
        const orderRef = doc(db, "merchants-orders", orderId);
        await updateDoc(orderRef, { status });
        // Update local state
        const orderIndex = this.orders.findIndex(
          (order) => order.id === orderId
        );
        if (orderIndex !== -1) {
          this.orders[orderIndex].status = status;
        }
        return { success: true, message: "Order status updated successfully" };
      } catch (error) {
        // console.error("Error updating order status:", error);
        this.error = error.message;
        return { success: false, message: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Delete an order
    async deleteOrder(orderId) {
      try {
        this.loading = true;
        await deleteDoc(doc(db, "merchants-orders", orderId));
        this.orders = this.orders.filter((order) => order.id !== orderId);
        this.updatePagination();
        return { success: true, message: "Order deleted successfully" };
      } catch (error) {
        console.error("Error deleting order:", error);
        this.error = error.message;
        return { success: false, message: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Update pagination
    updatePagination() {
      const start = (this.currentPage - 1) * this.ordersPerPage;
      const end = start + this.ordersPerPage;
      this.paginatedOrders = this.orders.slice(start, end);
    },

    // Change page
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePagination();
      }
    },

    // Reset store state
    resetState() {
      this.orders = [];
      this.paginatedOrders = [];
      this.currentPage = 1;
      this.loading = false;
      this.error = null;
      this.merchantId = null;
      this.isAdmin = false;
    },
  },

  getters: {
    // Get total pages for pagination
    totalPages: (state) => {
      return Math.ceil(state.orders.length / state.ordersPerPage);
    },

    // Get total orders for a merchant
    totalOrders: (state) => {
      return state.orders.length;
    },

    // Get completed orders
    completedOrders: (state) => {
      return state.orders.filter((order) => order.status === "completed")
        .length;
    },

    // Get pending orders
    pendingOrders: (state) => {
      return state.orders.filter((order) => order.status === "pending").length;
    },

    // Calculate total earnings
    totalEarnings: (state) => {
      return state.orders.reduce((total, order) => {
        if (order.cart && Array.isArray(order.cart)) {
          return (
            total +
            order.cart.reduce((orderTotal, item) => {
              return (
                orderTotal +
                parseFloat(item.discountedPrice || 0) * (item.quantity || 1)
              );
            }, 0)
          );
        }
        return total;
      }, 0);
    },
  },
});
