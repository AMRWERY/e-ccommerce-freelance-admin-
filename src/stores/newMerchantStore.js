import { auth, db, storage } from "@/firebase";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  getDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  ref,
  deleteObject,
} from "firebase/storage";
import { defineStore } from "pinia";

export const useNewMerchantStore = defineStore("new-merchants", {
  state: () => ({
    marketName: "",
    imageFile: null,
    description: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    loading: false,
    error: null,
    merchants: [],
    paginatedMerchants: [],
    currentPage: 1,
    merchantsPerPage: 10,
    acceptLoading: false,
    selectedStatus: "all",
  }),

  actions: {
    async registerMarket() {
      this.loading = true;
      this.error = null;
      try {
        // Check if user already exists
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("email", "==", this.email));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          throw new Error("User with this email already exists");
        }
        // Create user first
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;
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
        // Check if merchant already exists
        const merchantsRef = collection(db, "new-merchants");
        const merchantQuery = query(
          merchantsRef,
          where("email", "==", this.email)
        );
        const merchantSnapshot = await getDocs(merchantQuery);
        if (!merchantSnapshot.empty) {
          throw new Error("Merchant with this email already exists");
        }
        // Create merchant data with email
        const marketData = {
          name: this.marketName,
          description: this.description,
          marketId,
          imageUrl,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          userId: user.uid,
          status: "pending",
          createdAt: new Date(),
        };
        const marketDocRef = await addDoc(
          collection(db, "new-merchants"),
          marketData
        );
        // Create user data with merchant reference
        const userData = {
          uid: user.uid,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          marketId,
          marketDocId: marketDocRef.id,
          role: "market_owner",
          status: "pending",
          createdAt: new Date(),
        };
        await setDoc(doc(db, "users", user.uid), userData);
        const storageData = {
          marketData: {
            ...marketData,
            id: marketDocRef.id,
            createdAt: marketData.createdAt.toISOString(),
          },
          userData: {
            ...userData,
            createdAt: userData.createdAt.toISOString(),
          },
        };
        localStorage.setItem("user", JSON.stringify(storageData));
        this.resetForm();
        return { marketId, marketDocId: marketDocRef.id, userId: user.uid };
      } catch (err) {
        this.error = err.message || "An error occurred";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.marketName = "";
      this.imageFile = null;
      this.description = "";
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.password = "";
      this.error = null;
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

    async rejectMerchant(merchantId) {
      this.acceptLoading = true;
      try {
        const merchantRef = doc(db, "new-merchants", merchantId);
        const merchantDoc = await getDoc(merchantRef);
        if (!merchantDoc.exists()) {
          throw new Error("Merchant not found");
        }
        const merchantData = merchantDoc.data();
        await updateDoc(merchantRef, {
          status: "rejected",
          rejectedAt: new Date(),
        });
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const userDoc = usersSnapshot.docs.find(
          (doc) => doc.data().marketId === merchantData.marketId
        );
        if (userDoc) {
          await updateDoc(doc(db, "users", userDoc.id), {
            status: "rejected",
            rejectedAt: new Date(),
          });
        }
        const merchantIndex = this.merchants.findIndex(
          (m) => m.id === merchantId
        );
        if (merchantIndex !== -1) {
          this.merchants[merchantIndex].status = "rejected";
          this.merchants[merchantIndex].rejectedAt = new Date();
          this.updatePagination();
        }
      } catch (err) {
        this.error = err.message || "Failed to reject merchant";
        throw err;
      } finally {
        this.acceptLoading = false;
      }
    },

    async deleteMerchant(merchantId) {
      this.loading = true;
      try {
        // Get merchant data first
        const merchantRef = doc(db, "new-merchants", merchantId);
        const merchantDoc = await getDoc(merchantRef);
        if (!merchantDoc.exists()) {
          throw new Error("Merchant not found");
        }
        const merchantData = merchantDoc.data();
        // Get user document using userId
        const userRef = doc(db, "users", merchantData.userId);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          throw new Error("User not found");
        }
        // Delete from Authentication
        try {
          await deleteUser(merchantData.userId);
        } catch (error) {
          // console.error("Error deleting user from Auth:", error);
        }
        // Delete merchant image from storage if exists
        if (merchantData.imageUrl) {
          try {
            const imageRef = ref(storage, merchantData.imageUrl);
            await deleteObject(imageRef);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        }
        // Delete from Firestore
        await deleteDoc(merchantRef);
        await deleteDoc(userRef);
        // Remove from local state
        this.merchants = this.merchants.filter((m) => m.id !== merchantId);
        this.updatePagination();
        return true;
      } catch (err) {
        this.error = err.message || "Failed to delete merchant";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    setStatusFilter(status) {
      this.selectedStatus = status;
      this.currentPage = 1;
      this.updatePagination();
    },

    updatePagination() {
      const filteredMerchants =
        this.selectedStatus === "all"
          ? this.merchants
          : this.merchants.filter((m) => m.status === this.selectedStatus);
      this.paginatedMerchants = filteredMerchants.slice(
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
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      password: state.password,
    }),

    totalPages() {
      const filteredCount =
        this.selectedStatus === "all"
          ? this.merchants.length
          : this.merchants.filter((m) => m.status === this.selectedStatus)
              .length;
      return Math.ceil(filteredCount / this.merchantsPerPage);
    },

    filteredMerchants() {
      return this.selectedStatus === "all"
        ? this.merchants
        : this.merchants.filter((m) => m.status === this.selectedStatus);
    },
  },
});
