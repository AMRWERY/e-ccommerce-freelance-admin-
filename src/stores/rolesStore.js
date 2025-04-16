import { db } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const useRolesStore = defineStore("roles", {
  state: () => ({
    roles: [],
    defaultPermissions: {
      dashboard: { view: true },
      products: { view: false, add: false, edit: false, delete: false },
      orders: { view: false, cancel: false },
      users: { view: false, edit: false },
      settings: { view: false },
    },
  }),

  actions: {
    async fetchRoles() {
      const querySnapshot = await getDocs(collection(db, "roles"));
      this.roles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //   console.log('all roles:', this.roles)
    },

    async createRole(roleData) {
      const docRef = doc(collection(db, "roles"));
      await setDoc(docRef, {
        name: roleData.name,
        permissions: roleData.permissions || this.defaultPermissions,
      });
      await this.fetchRoles();
    },

    async updateRole(roledId, updates) {
      const docRef = doc(db, "roles", roledId);
      await updateDoc(docRef, updates);
      await this.fetchRoles();
    },

    async deleteRole(roledId) {
      const docRef = doc(db, "roles", roledId);
      await deleteDoc(docRef);
      await this.fetchRoles();
    },

    getRolePermissions(roledId) {
      const role = this.roles.find((r) => r.id === roledId);
      return role?.permissions || {};
    },
  },

  getters: {
    roleOptions: (state) =>
      state.roles.map((role) => ({
        value: role.id,
        label: role.name,
      })),
  },
});
