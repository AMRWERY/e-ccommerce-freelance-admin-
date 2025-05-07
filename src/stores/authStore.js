import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    error: null,
    role: null,
    listeners: [],
  }),

  actions: {
    async init() {
      await setPersistence(auth, browserLocalPersistence);
      const user = auth.currentUser;
      if (user) {
        await this.fetchUserData(user.uid);
        // this.user = user;
      }
    },

    cleanupListeners() {
      this.listeners.forEach((unsubscribe) => unsubscribe());
      this.listeners = [];
    },

    isAdmin() {
      return this.role === "admin";
    },

    isEmployee() {
      return this.role === "employee";
    },

    isUser() {
      return this.role === "user";
    },

    async fetchUserData(uid) {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.user = { ...userData };
          this.role = userData.role || "user";
          // console.log('user data:', userData)
        } else {
          throw new Error("User data not found");
        }
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },

    async registerUser(
      email,
      password,
      firstName,
      lastName,
      role = "employee"
    ) {
      if (!["admin", "employee", "user"].includes(role)) {
        throw new Error("Invalid role specified");
      }
      // Only allow admins to create other admins/employees
      if (this.role !== "admin" && role !== "employee") {
        throw new Error("Unauthorized role assignment");
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const rolesRef = collection(db, "roles");
        const q = query(rolesRef, where("name", "==", role));
        const snap = await getDocs(q);
        const roleDoc = snap.docs[0];
        const roleData = roleDoc.data();
        const user = userCredential.user;
        const userData = {
          uid: user.uid,
          email: user.email,
          firstName: firstName,
          lastName: lastName,
          role: role,
          loginType: "email",
          createdAt: new Date(),
          roledId: roleDoc.id,
          permissions: roleData.permissions,
        };
        await setDoc(doc(db, "users", user.uid), userData);
        this.role = role;
        await this.fetchUserData(user.uid);
        this.error = null;
        return user;
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },

    async loginUser(email, password) {
      try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        this.user = user;
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.role = userData?.role || "user";
          // Handle admin permissions
          if (userData.role === "admin") {
            const rolesRef = collection(db, "roles");
            const q = query(rolesRef, where("name", "==", "admin"));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const adminRole = querySnapshot.docs[0].data();
              // Update user document with admin permissions
              await updateDoc(userDocRef, {
                permissions: adminRole.permissions,
              });
              // Update userData with permissions for localStorage
              userData.permissions = adminRole.permissions;
            }
          }
          // Handle merchant (market_owner) login differently
          if (userData.role === "market_owner") {
            const merchantsRef = collection(db, "new-merchants");
            const q = query(
              merchantsRef,
              where("marketId", "==", userData.marketId)
            );
            const merchantSnapshot = await getDocs(q);
            if (!merchantSnapshot.empty) {
              const merchantData = merchantSnapshot.docs[0].data();
              // Check merchant status
              if (merchantData.status === "rejected") {
                await this.logoutUser();
                throw new Error(
                  "Your merchant account has been rejected. Please contact support for more information."
                );
              }
              if (merchantData.status === "pending") {
                await this.logoutUser();
                throw new Error(
                  "Your merchant account is pending approval. Please wait for admin approval."
                );
              }
              // Store merchant data in localStorage
              const saveUserData = {
                email: userData.email,
                name: merchantData.name,
                username: merchantData.username,
                role: userData.role,
                uid: userData.uid,
                imageUrl: merchantData.imageUrl || null,
                marketId: userData.marketId,
                marketDocId: userData.marketDocId,
              };
              localStorage.setItem("user", JSON.stringify(saveUserData));
            }
          } else {
            const saveUserData = {
              uid: userData.uid,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: userData.role,
              loginType: userData.loginType,
              permissions: userData.permissions,
            };
            localStorage.setItem("user", JSON.stringify(saveUserData));
          }
        } else {
          this.role = "user";
        }
        await this.fetchUserData(user.uid);
        this.error = null;
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },

    async logoutUser() {
      try {
        this.cleanupListeners();
        await signOut(auth);
        this.user = null;
        this.role = null;
        this.error = null;
        ["user", "new-market"].forEach((key) => {
          localStorage.removeItem(key);
        });
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },

    async changePassword(newPassword) {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      try {
        // Force token refresh to maintain authentication
        await user.getIdToken(true);
        // Update password directly
        await updatePassword(user, newPassword);
        return true;
      } catch (error) {
        console.error("Password change failed:", error);
        throw error;
      }
    },

    setupUserListener(uid) {
      const userRef = doc(db, "users", uid);
      this.unsubscribeUser = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          console.log("Updated permissions:", doc.data().permissions);
          this.user = { id: doc.id, ...doc.data() };
        }
      });
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,

    userRole: (state) => state.user?.role || "user",
  },
});
