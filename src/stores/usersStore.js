import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [],
    paginatedUsers: [],
    currentPage: 1,
    usersPerPage: 8,
    recentUsers: [],
    searchUserByEmail: "",
  }),

  actions: {
    fetchUsers() {
      const usersQuery = query(
        collection(db, "users"),
        where("role", "==", "user")
      );
      return getDocs(usersQuery)
        .then((querySnapshot) => {
          this.users = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          // console.log('all users:', this.users)
          this.users = this.users.filter(
            (user) => user.email !== "admin@commerce.com"
          );
          this.updatePagination();
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },

    updatePagination() {
      this.paginatedUsers = this.users.slice(
        (this.currentPage - 1) * this.usersPerPage,
        this.currentPage * this.usersPerPage
      );
    },

    deleteUser(userId) {
      const docRef = doc(db, "users", userId);
      return deleteDoc(docRef)
        .then(() => {
          this.users = this.users.filter((user) => user.id !== userId);
          this.updatePagination();
          // console.log(`User with ID ${userId} deleted successfully.`);
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    },

    blockUser(userId) {
      const userRef = doc(db, "users", userId);
      return updateDoc(userRef, { isBlocked: true })
        .then(() => {
          const userIndex = this.users.findIndex((user) => user.id === userId);
          if (userIndex > -1) {
            this.users[userIndex].isBlocked = true;
          } else {
            console.warn(
              "User not found in local store while blocking:",
              userId
            );
          }
        })
        .catch((error) => {
          console.error("Failed to block user:", error);
        });
    },

    toggleBlockUser(userId) {
      const userIndex = this.users.findIndex((user) => user.id === userId);
      if (userIndex > -1) {
        const user = this.users[userIndex];
        const newStatus = !user.isBlocked;
        const userRef = doc(db, "users", userId);
        return updateDoc(userRef, { isBlocked: newStatus })
          .then(() => {
            this.users[userIndex].isBlocked = newStatus;
          })
          .catch((error) => {
            console.error("Failed to toggle block status for user:", error);
          });
      } else {
        console.warn("User not found in local store:", userId);
        return Promise.resolve();
      }
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
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

    async fetchRecentUsers() {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        this.recentUsers = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            // Skip admin users
            if (data.email === "admin@ship.com" || data.role === "admin")
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
  },

  getters: {
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.usersPerPage);
    },

    totalCustomers() {
      return this.users.length;
    },

    filteredUsers: (state) => {
      if (!state.searchUserByEmail) return state.users;
      return state.users.filter((product) => {
        const email = product.email?.toLowerCase() || "";
        return email.includes(state.searchUserByEmail);
      });
    },
  },
});
