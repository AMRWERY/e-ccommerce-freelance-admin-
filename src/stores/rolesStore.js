import { db } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

export const useRolesStore = defineStore("roles", {
  state: () => ({
    roles: [],
    defaultPermissions: {
      dashboard: { view: true },
      products: { view: false, add: false, edit: false, delete: false },
      orders: { view: false, cancel: false },
      users: { view: false, edit: false },
    },
  }),

  actions: {
    async fetchRoles() {
      const querySnapshot = await getDocs(collection(db, "roles"));
      this.roles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log('all roles:', this.roles)
    },

    async createRole(roleData) {
      const docRef = doc(collection(db, "roles"));
      await setDoc(docRef, {
        name: roleData.name,
        permissions: roleData.permissions || this.defaultPermissions,
      });
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

    async updateRoleAndSyncUsers(roledId, updates) {
      try {
        // 1. Update the role document
        const roleRef = doc(db, "roles", roledId);
        await updateDoc(roleRef, updates);
        // 2. Get all users with this role
        const usersQuery = query(
          collection(db, "users"),
          where("roledId", "==", roledId)
        );
        const querySnapshot = await getDocs(usersQuery);
        // 3. Batch update users
        const batch = writeBatch(db);
        const MAX_BATCH_SIZE = 500;
        let operationCount = 0;
        for (const userDoc of querySnapshot.docs) {
          if (operationCount === MAX_BATCH_SIZE) {
            await batch.commit();
            batch = writeBatch(db);
            operationCount = 0;
          }
          const userRef = doc(db, "users", userDoc.id);
          batch.update(userRef, { permissions: updates.permissions });
          operationCount++;
        }
        if (operationCount > 0) await batch.commit();
        return {
          success: true,
          affectedUsers: querySnapshot.size,
        };
      } catch (error) {
        console.error("Update failed:", error);
        throw error;
      }
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
