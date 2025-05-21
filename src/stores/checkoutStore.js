import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase";

export const useCheckoutStore = defineStore("checkout", {
  state: () => ({
    orders: [],
    paginatedOrders: [],
    currentPage: 1,
    ordersPerPage: 6,
    deliveryDetails: {
      name: "",
      email: "",
      country: "",
      city: "",
      phoneNumber: "",
    },
    // paymentDetails: {
    //   fullNameOnCard: "",
    //   cardNumber: "",
    //   cardExpiration: "",
    //   cvv: "",
    // },
    totalCheckouts: 0,
    status: [],
    recentOrders: [],
    totalRevenue: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    monthlyRevenue: 0,
  }),

  actions: {
    fetchStatus() {
      getDocs(collection(db, "order-status"))
        .then((querySnapshot) => {
          const fetchedStatuses = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const statusOrder = {
            "Order Placed": 1,
            Processing: 2,
            Shipped: 3,
            "Out for Delivery": 4,
            Delivered: 5,
          };
          this.status = fetchedStatuses.sort((a, b) => {
            const orderA = statusOrder[a.status] ?? Infinity;
            const orderB = statusOrder[b.status] ?? Infinity;
            return orderA - orderB;
          });
          this.updatePagination();
        })
        .catch((e) => {
          console.error("Error fetching orders: ", e);
        });
    },

    fetchOrders() {
      getDocs(query(collection(db, "checkout")))
        .then((querySnapshot) => {
          this.orders = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.updatePagination();
          // console.log(this.orders)
          return this.fetchTotalCheckouts();
        })
        .catch((e) => {
          console.error("Error fetching orders: ", e);
        });
    },

    updatePagination() {
      this.paginatedOrders = this.orders.slice(
        (this.currentPage - 1) * this.ordersPerPage,
        this.currentPage * this.ordersPerPage
      );
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePagination();
      }
    },

    async updateOrderStatus(orderId, newStatus) {
      try {
        const docRef = doc(db, "checkout", orderId);
        // Get the status object to check if it's "Shipped"
        const statusObj = this.status.find(s => s.id === newStatus);
        const updateData = { statusId: newStatus }; 
        // If status is "Shipped", calculate and add estimated delivery date
        if (statusObj?.status === "Shipped") {
          // Calculate estimated delivery date (3-5 days from now)
          const today = new Date();
          const estimatedDate = new Date(today);
          estimatedDate.setDate(today.getDate() + 5); // Set to 5 days from now
          updateData.estimatedDelivery = estimatedDate.toISOString();
        }
        await updateDoc(docRef, updateData);    
        // Update local state
        const orderIndex = this.orders.findIndex((o) => o.id === orderId);
        if (orderIndex !== -1) {
          this.orders[orderIndex] = {
            ...this.orders[orderIndex],
            ...updateData
          };
          this.paginatedOrders = [...this.orders]; // Force reactivity
        }
        return { success: true, message: "Status updated successfully" };
      } catch (error) {
        console.error("Update error:", error);
        return { success: false, message: error.message };
      }
    },

    fetchTotalCheckouts() {
      getDocs(collection(db, "checkout"))
        .then((querySnapshot) => {
          this.totalCheckouts = querySnapshot.size;
        })
        .catch((e) => {
          console.error("Error fetching total checkouts: ", e);
        });
    },

    async deleteOrder(orderId) {
      if (!orderId) {
        return { success: false, message: "No order ID provided" };
      }
      try {
        const docRef = doc(db, "checkout", orderId);
        await deleteDoc(docRef);
        this.orders = this.orders.filter((order) => order.id !== orderId);
        this.updatePagination();
        return { success: true, message: "Order deleted successfully" };
      } catch (error) {
        console.error("Error removing order:", error);
        return { success: false, message: error.message };
      }
    },

    async fetchRecentOrders() {
      try {
        const ordersRef = collection(db, "checkout");
        const q = query(ordersRef, orderBy("date", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        this.recentOrders = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            orderNumber: data.orderId || doc.id,
            createdAt: data.date || data.createdAt || new Date().toISOString(),
            ...data,
          };
        });
      } catch (error) {
        console.error("Error fetching recent orders:", error);
        this.recentOrders = [];
      }
    },

    async fetchRevenueMetrics() {
      try {
        const ordersRef = collection(db, "checkout");
        const querySnapshot = await getDocs(ordersRef);
        let totalRevenue = 0;
        let orderCount = 0;
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        let monthlyRevenue = 0;
        let lastMonthRevenue = 0;
        querySnapshot.forEach((doc) => {
          const order = doc.data();
          const orderTotal = order.cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          totalRevenue += orderTotal;
          orderCount++;
          const orderDate = new Date(order.date);
          if (orderDate >= firstDayOfMonth) {
            monthlyRevenue += orderTotal;
          }
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const firstDayOfLastMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
          );
          if (orderDate >= firstDayOfLastMonth && orderDate < lastMonth) {
            lastMonthRevenue += orderTotal;
          }
        });
        this.totalRevenue = totalRevenue;
        this.averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
        this.monthlyRevenue = monthlyRevenue;
        if (lastMonthRevenue > 0) {
          this.revenueGrowth =
            ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        } else {
          this.revenueGrowth = 0;
        }
      } catch (error) {
        console.error("Error fetching revenue metrics:", error);
      }
    },
  },

  getters: {
    getTotalCheckouts(state) {
      return state.totalCheckouts;
    },

    totalPages() {
      return Math.ceil(this.orders.length / this.ordersPerPage);
    },
  },
});
