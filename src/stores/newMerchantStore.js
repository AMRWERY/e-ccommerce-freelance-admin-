import { auth, db, storage } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDocs } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export const useNewMerchantStore = defineStore("new-merchants", {
  state: () => ({
    marketName: "",
    imageFile: null,
    description: "",
    username: "",
    email: "",
    password: "",
    loading: false,
    error: null,
    merchants: [],
    paginatedMerchants: [],
    currentPage: 1,
    merchantsPerPage: 10,
  }),

  actions: {
    async registerMarket() {
      this.loading = true;
      this.error = null;
      try {
        let imageUrl = null;
        if (this.imageFile) {
          const fileRef = storageRef(
            storage,
            `market-images/${Date.now()}_${this.imageFile.name}`
          );
          await uploadBytes(fileRef, this.imageFile);
          imageUrl = await getDownloadURL(fileRef);
        }
        const randomNumber = Math.floor(Math.random() * 1000) + 1;
        const marketId = `market_${randomNumber}`;
        const marketData = {
          name: this.marketName,
          description: this.description,
          marketId,
          imageUrl,
          username: this.username,
          createdAt: new Date(),
        };
        const marketDocRef = await addDoc(
          collection(db, "new-merchants"),
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

    async fetchAllMerchants() {
      this.loading = true;
      this.error = null;
      try {
        const merchantsCollection = collection(db, "new-merchants");
        const merchantsSnapshot = await getDocs(merchantsCollection);
        this.merchants = merchantsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        this.updatePagination();
      } catch (err) {
        this.error = err.message || "Failed to fetch merchants";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    updatePagination() {
      this.paginatedMerchants = this.merchants.slice(
        (this.currentPage - 1) * this.merchantsPerPage,
        this.currentPage * this.merchantsPerPage
      );
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePagination();
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

    totalPages() {
      return Math.ceil(this.merchants.length / this.merchantsPerPage);
    },
  },
});
