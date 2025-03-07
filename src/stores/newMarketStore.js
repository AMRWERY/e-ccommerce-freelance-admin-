import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export const useNewMarketStore = defineStore("new-markets", {
  state: () => ({
    marketName: "",
    imageFile: null,
    description: "",
    username: "",
    email: "",
    password: "",
    loading: false,
    error: null,
  }),

  actions: {
    async registerMarket() {
      this.loading = true;
      this.error = null;
      try {
        const randomNumber = Math.floor(Math.random() * 1000) + 1;
        const marketId = `market_${randomNumber}`;
        const marketData = {
          name: this.marketName,
          description: this.description,
          marketId,
          createdAt: new Date(),
        };
        const marketDocRef = await addDoc(
          collection(db, "new-markets"),
          marketData
        );
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;
        const userData = {
          uid: user.uid,
          username: this.username,
          email: this.email,
          marketId,
          role: "market_owner",
          createdAt: new Date(),
        };
        await setDoc(doc(db, "users", user.uid), userData);
        const storageData = {
          marketData: {
            ...marketData,
            createdAt: marketData.createdAt.toISOString(),
          },
          userData: {
            ...userData,
            createdAt: userData.createdAt.toISOString(),
          },
        };
        localStorage.setItem("new-market", JSON.stringify(storageData));
        return { marketId, marketDocId: marketDocRef.id, userId: user.uid };
      } catch (err) {
        // console.error(err);
        this.error = err.message || "An error occurred";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    marketFormData: (state) => ({
      marketName: state.marketName,
      imageFile: state.imageFile,
      description: state.description,
      username: state.username,
      email: state.email,
      password: state.password,
    }),
  },
});
