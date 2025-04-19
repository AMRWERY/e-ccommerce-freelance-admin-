import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";

export const useUsersStore = defineStore("users", {
  state: () => ({
    // Original users management state
    users: [],
    paginatedUsers: [],
    currentPage: 1,
    usersPerPage: 8,
    recentUsers: [],
    searchUserByEmail: "",

    // Dashboard state
    employees: [],
    activeUsers: [],
    employeesLoading: true,
    usersLoading: true,
    orders: [], // Cache orders to avoid multiple fetches
  }),

  actions: {
    // Original users management actions
    async fetchUsers() {
      try {
        const usersQuery = query(
          collection(db, "users"),
          where("role", "==", "user")
        );
        const querySnapshot = await getDocs(usersQuery);
        this.users = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        this.users = this.users.filter(
          (user) => user.email !== "admin@commerce.com"
        );
        this.updatePagination();
      } catch (error) {
        console.error("Error fetching users:", error);
        this.users = [];
        this.updatePagination();
      }
    },

    updatePagination() {
      const start = (this.currentPage - 1) * this.usersPerPage;
      const end = this.currentPage * this.usersPerPage;
      this.paginatedUsers = this.filteredUsers.slice(start, end);
      if (this.paginatedUsers.length === 0 && this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },

    async deleteUser(userId) {
      try {
        const docRef = doc(db, "users", userId);
        await deleteDoc(docRef);
        this.users = this.users.filter((user) => user.id !== userId);
        this.updatePagination();
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },

    async toggleBlockUser(userId) {
      try {
        const userIndex = this.users.findIndex((user) => user.id === userId);
        if (userIndex > -1) {
          const user = this.users[userIndex];
          const newStatus = !user.isBlocked;
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, { isBlocked: newStatus });
          this.users[userIndex].isBlocked = newStatus;
        }
      } catch (error) {
        console.error("Failed to toggle block status for user:", error);
        throw error;
      }
    },

    async fetchRecentUsers() {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        this.recentUsers = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            if (data.email === "admin@commerce.com" || data.role === "admin")
              return null;
            const fullName =
              `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
              "Unknown User";
            let userDate;
            if (data.createdAt?.toDate) {
              userDate = data.createdAt.toDate();
            } else if (data.createdAt) {
              userDate = new Date(data.createdAt);
            } else {
              userDate = new Date();
            }
            return {
              id: doc.id,
              name: fullName,
              firstName: data.firstName,
              lastName: data.lastName,
              createdAt: userDate,
              email: data.email,
              ...data,
            };
          })
          .filter((user) => user !== null)
          .slice(0, 5);
      } catch (error) {
        console.error("Error fetching recent users:", error);
        this.recentUsers = [];
      }
    },

    setSearchTerm(term) {
      this.searchUserByEmail = term.toLowerCase();
      this.currentPage = 1;
      this.updatePagination();
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePagination();
      }
    },

    // Dashboard actions
    formatEmployeeData(doc) {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate
        ? data.createdAt.toDate()
        : new Date(data.createdAt);

      return {
        id: doc.id,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        createdAt: createdAt.toLocaleDateString("en-US", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }),
        bgColor: "bg-blue-500",
      };
    },

    calculateUserStats(user, orders) {
      const userOrders = orders.filter(
        (order) => order.deliveryDetails?.email === user.email
      );
      const totalSpent = userOrders.reduce((total, order) => {
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

      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        totalOrders: userOrders.length,
        totalSpent: totalSpent,
        bgColor: "bg-purple-500",
      };
    },

    async fetchOrders() {
      const ordersSnapshot = await getDocs(collection(db, "checkout"));
      this.orders = ordersSnapshot.docs.map((doc) => doc.data());
    },

    async fetchEmployees() {
      this.employeesLoading = true;
      try {
        const employeesQuery = query(
          collection(db, "users"),
          where("role", "==", "employee")
        );
        const snapshot = await getDocs(employeesQuery);
        this.employees = snapshot.docs.map((doc) =>
          this.formatEmployeeData(doc)
        );
      } catch (error) {
        console.error("Error fetching employees:", error);
        this.employees = [];
      } finally {
        this.employeesLoading = false;
      }
    },

    async fetchDashboardUsers() {
      this.usersLoading = true;
      try {
        const usersQuery = query(
          collection(db, "users"),
          where("role", "==", "user")
        );
        const usersSnapshot = await getDocs(usersQuery);
        const users = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (this.orders.length === 0) {
          await this.fetchOrders();
        }

        this.activeUsers = users.map((user) =>
          this.calculateUserStats(user, this.orders)
        );
      } catch (error) {
        console.error("Error fetching dashboard users:", error);
        this.activeUsers = [];
      } finally {
        this.usersLoading = false;
      }
    },

    // Reset store state
    resetState() {
      this.users = [];
      this.paginatedUsers = [];
      this.currentPage = 1;
      this.employees = [];
      this.activeUsers = [];
      this.orders = [];
      this.employeesLoading = true;
      this.usersLoading = true;
      this.searchUserByEmail = "";
    },
  },

  getters: {
    // Original users management getters
    totalPages: (state) => {
      return Math.ceil(state.filteredUsers.length / state.usersPerPage);
    },

    totalCustomers: (state) => {
      return state.users.length;
    },

    filteredUsers: (state) => {
      if (!state.searchUserByEmail) return state.users;
      return state.users.filter((user) => {
        const email = user.email?.toLowerCase() || "";
        return email.includes(state.searchUserByEmail);
      });
    },

    // Dashboard getters
    topEmployees: (state) => {
      return state.employees
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    },

    topUsers: (state) => {
      return state.activeUsers
        .sort((a, b) => b.totalOrders - a.totalOrders)
        .slice(0, 5);
    },
  },
});
