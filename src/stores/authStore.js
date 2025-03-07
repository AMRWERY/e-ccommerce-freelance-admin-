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
import { doc, setDoc, getDoc } from "firebase/firestore";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    error: null,
    role: null,
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
          const saveUserData = {
            uid: userData.uid,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            loginType: userData.loginType,
          };
          localStorage.setItem("user", JSON.stringify(saveUserData));
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
  },

  getters: {
    isAuthenticated: (state) => !!state.user,

    userRole: (state) => state.user?.role || "user",
  },
});
