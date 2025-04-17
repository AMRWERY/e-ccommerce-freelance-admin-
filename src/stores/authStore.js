import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
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

    async registerUser(email, password, firstName, lastName, role = "user") {
      if (!["admin", "employee", "user"].includes(role)) {
        throw new Error("Invalid role specified");
      }
      // Only allow admins to create other admins/employees
      if (this.role !== "admin" && role !== "user") {
        throw new Error("Unauthorized role assignment");
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const userData = {
          uid: user.uid,
          email: user.email,
          firstName: firstName,
          lastName: lastName,
          role: role,
          loginType: "email",
          createdAt: new Date(),
        };
        await setDoc(doc(db, "users", user.uid), userData);
        localStorage.setItem("user", JSON.stringify(userData));
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
              // permissions: userData.permissions,
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

    async loginWithGoogle() {
      try {
        await setPersistence(auth, browserLocalPersistence);
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        this.user = user;
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        let userData;
        if (!userDoc.exists()) {
          userData = {
            uid: user.uid,
            email: user.email,
            firstName: user.displayName?.split(" ")[0] || "FirstName",
            lastName: user.displayName?.split(" ")[1] || "LastName",
            role: "user",
            loginType: "google",
            createdAt: new Date(),
          };
          await setDoc(userDocRef, userData);
        } else {
          userData = userDoc.data();
        }
        const sessionUserData = {
          uid: userData.uid,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          loginType: userData.loginType,
        };
        localStorage.setItem("user", JSON.stringify(sessionUserData));
        this.role = userData.role || "user";
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

    setupUserListener(uid) {
      const userRef = doc(db, "users", uid);
      this.unsubscribeUser = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          // إضافة console.log للتأكد من وصول التحديثات
          console.log("Updated permissions:", doc.data().permissions);
          this.user = { id: doc.id, ...doc.data() };
        }
      });
    },
    // setupUserListener(uid) {
    //   const userRef = doc(db, 'users', uid);
    //   this.unsubscribeUser = onSnapshot(userRef, (doc) => {
    //     if (doc.exists()) {
    //       this.user = { id: doc.id, ...doc.data() };
    //       // This should log updated permissions immediately
    //       console.log('Updated permissions:', this.user.permissions);
    //     }
    //   });
    // }
  },

  getters: {
    isAuthenticated: (state) => !!state.user,

    userRole: (state) => state.user?.role || "user",
  },
});
