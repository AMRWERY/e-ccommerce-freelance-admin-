import { auth, db, storage } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
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
    acceptLoading: false,
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
          status: "pending",
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
          status: "pending",
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

    async acceptMerchant(merchantId) {
      this.acceptLoading = true;
      try {
        const merchantRef = doc(db, "new-merchants", merchantId);
        const merchantDoc = await getDoc(merchantRef);
        if (!merchantDoc.exists()) {
          throw new Error("Merchant not found");
        }
        const merchantData = merchantDoc.data();
        await updateDoc(merchantRef, {
          status: "approved",
          approvedAt: new Date(),
        });
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const userDoc = usersSnapshot.docs.find(
          (doc) => doc.data().marketId === merchantData.marketId
        );
        if (userDoc) {
          await updateDoc(doc(db, "users", userDoc.id), {
            status: "approved",
            approvedAt: new Date(),
          });
        }
        const merchantIndex = this.merchants.findIndex(
          (m) => m.id === merchantId
        );
        if (merchantIndex !== -1) {
          this.merchants[merchantIndex].status = "approved";
          this.merchants[merchantIndex].approvedAt = new Date();
          this.updatePagination();
        }
      } catch (err) {
        this.error = err.message || "Failed to accept merchant";
        throw err;
      } finally {
        this.acceptLoading = false;
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
