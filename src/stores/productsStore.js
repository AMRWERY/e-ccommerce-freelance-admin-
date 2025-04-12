import {
  getDocs,
  collection,
  query,
  getDoc,
  doc,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const useProductsStore = defineStore("new-products", {
  state: () => ({
    products: [],
    selectedProduct: null,
    paginatedProducts: [],
    currentPage: 1,
    productsPerPage: 2,
    productRatings: {},
    searchProductByTitle: "",
    lowStockProducts: [],
  }),

  actions: {
    fetchProducts() {
      getDocs(query(collection(db, "products")))
        .then((querySnap) => {
          const allProducts = querySnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.products = allProducts;
          // console.log(this.products);
          this.updatePagination();
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    },

    async createProduct(productData, imageFiles) {
      try {
        const filesArray = Object.values(imageFiles).filter((file) => file);
        if (filesArray.length === 0) {
          throw new Error("No image files provided.");
        }
        const imageUrls = await Promise.all(
          filesArray.map(async (file) => {
            const storagePath = `/products/${file.name}`;
            const storageRef = ref(storage, storagePath);
            await uploadBytes(storageRef, file);
            return getDownloadURL(storageRef);
          })
        );
        const imageUrlsObj = imageUrls.reduce((acc, url, index) => {
          acc[`imageUrl${index + 1}`] = url;
          return acc;
        }, {});
        const newProductData = { ...productData, ...imageUrlsObj };
        const docRef = await addDoc(collection(db, "products"), newProductData);
        await this.fetchProducts();
        return docRef.id;
      } catch (error) {
        console.error("Create error:", error);
        throw error;
      }
    },

    fetchProductDetail(productId) {
      if (!productId) {
        return null;
      }
      const docRef = doc(db, "products", productId);
      return getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const product = { ...docSnap.data(), id: productId };
            this.selectedProduct = product;
            return product;
          } else {
            this.selectedProduct = null;
            return null;
          }
        })
        .catch((error) => {
          return null;
        });
    },

    async updateProduct(productId, updatedData, imageFiles) {
      try {
        const filesArray = Object.values(imageFiles).filter((file) => file);
        const imageUrls = await Promise.all(
          filesArray.map(async (file) => {
            const storagePath = `/products/${file.name}`;
            const storageRef = ref(storage, storagePath);
            await uploadBytes(storageRef, file);
            return getDownloadURL(storageRef);
          })
        );
        const imageUrlsObj = imageUrls.reduce((acc, url, index) => {
          acc[`imageUrl${index + 1}`] = url;
          return acc;
        }, {});
        const finalData = {
          ...updatedData,
          ...imageUrlsObj,
          originalPrice: Number(updatedData.originalPrice),
          discountedPrice: Number(updatedData.discountedPrice),
        };
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, finalData);
        const index = this.products.findIndex((p) => p.id === productId);
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...finalData };
        }
        await this.fetchProducts();
      } catch (error) {
        console.error("Update error:", error);
        throw error;
      }
    },

    deleteProduct(productId) {
      if (!productId) return;
      const productRef = doc(db, "products", productId);
      deleteDoc(productRef)
        .then(() => {
          this.products = this.products.filter(
            (product) => product.id !== productId
          );
          this.updatePagination();
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
        });
    },

    setSearchTerm(term) {
      this.searchProductByTitle = term.toLowerCase();
      this.currentPage = 1;
      this.updatePagination();
    },

    updatePagination() {
      const start = (this.currentPage - 1) * this.productsPerPage;
      const end = this.currentPage * this.productsPerPage;
      this.paginatedProducts = this.filteredProducts.slice(start, end);
      if (this.paginatedProducts.length === 0 && this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePagination();
      }
    },

    async fetchLowStockProducts() {
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("stock", "<=", 10));
        const querySnapshot = await getDocs(q);
        this.lowStockProducts = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((product) => product.availability === "In stock");
      } catch (error) {
        console.error("Error fetching low stock products:", error);
      }
    },
  },

  getters: {
    inStockProducts() {
      return this.products.filter(
        (product) => product.availability === "In stock"
      ).length;
    },

    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.productsPerPage);
    },

    filteredProducts: (state) => {
      if (!state.searchProductByTitle) return state.products;
      return state.products.filter((product) => {
        const title = product.title?.toLowerCase() || "";
        const titleAr = product.titleAr?.toLowerCase() || "";
        return (
          title.includes(state.searchProductByTitle) ||
          titleAr.includes(state.searchProductByTitle)
        );
      });
    },
  },
});
