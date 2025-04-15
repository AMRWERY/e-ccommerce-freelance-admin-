import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const useEmployeesStore = defineStore("employees", {
  state: () => ({
    employees: [],
    paginatedEmployees: [],
    currentPage: 1,
    employeesPerPage: 8,
    recentEmployees: [],
    searchEmployeesByEmail: "",
  }),

  actions: {
    fetchEmployees() {
      const employeesQuery = query(
        collection(db, "users"),
        where("role", "==", "employee")
      );
      return getDocs(employeesQuery)
        .then((querySnapshot) => {
          this.employees = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          this.employees = this.employees.filter(
            (user) => user.email !== "admin@commerce.com"
          );
          this.updatePagination();
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
        });
    },

    updatePagination() {
      this.paginatedEmployees = this.employees.slice(
        (this.currentPage - 1) * this.employeesPerPage,
        this.currentPage * this.employeesPerPage
      );
    },

    deleteEmployees(userId) {
      const docRef = doc(db, "users", userId);
      return deleteDoc(docRef)
        .then(() => {
          this.employees = this.employees.filter((user) => user.id !== userId);
          this.updatePagination();
        })
        .catch((error) => {
          console.error("Error deleting employees:", error);
        });
    },

    blockEmployees(userId) {
      const userRef = doc(db, "users", userId);
      return updateDoc(userRef, { isBlocked: true })
        .then(() => {
          const userIndex = this.employees.findIndex(
            (user) => user.id === userId
          );
          if (userIndex > -1) {
            this.employees[userIndex].isBlocked = true;
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

    toggleBlockEmployees(userId) {
      const userIndex = this.employees.findIndex((user) => user.id === userId);
      if (userIndex > -1) {
        const user = this.employees[userIndex];
        const newStatus = !user.isBlocked;
        const userRef = doc(db, "users", userId);
        return updateDoc(userRef, { isBlocked: newStatus })
          .then(() => {
            this.employees[userIndex].isBlocked = newStatus;
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
      const start = (this.currentPage - 1) * this.employeesPerPage;
      const end = this.currentPage * this.employeesPerPage;
      this.paginatedEmployees = this.filteredEmployees.slice(start, end);
      if (this.paginatedEmployees.length === 0 && this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },

    setSearchTerm(term) {
      this.searchEmployeesByEmail = term.toLowerCase();
      this.currentPage = 1;
      this.updatePagination();
    },
  },

  getters: {
    totalPages() {
      return Math.ceil(this.filteredEmployees.length / this.employeesPerPage);
    },

    totalCustomers() {
      return this.employees.length;
    },

    filteredEmployees: (state) => {
      if (!state.searchEmployeesByEmail) return state.employees;
      return state.employees.filter((product) => {
        const email = product.email?.toLowerCase() || "";
        return email.includes(state.searchEmployeesByEmail);
      });
    },
  },
});
