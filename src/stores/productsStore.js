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
    productsPerPage: 10,
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

    createProduct(productData, imageFiles) {
      const filesArray = Object.values(imageFiles).filter((file) => file);
      if (!imageFiles || imageFiles.length < 1) {
        return Promise.reject("No image files provided.");
      }
      const imageUrls = [];
      const uploadPromises = filesArray.map((file) => {
        const storagePath = "/products/" + file.name;
        const storageRef = ref(storage, storagePath);
        return uploadBytes(storageRef, file)
          .then((snapshot) => getDownloadURL(snapshot.ref))
          .then((url) => {
            imageUrls.push(url);
          });
      });
      return Promise.all(uploadPromises)
        .then(() => {
          const imageUrlsObj = imageUrls.reduce((acc, url, index) => {
            acc[`imageUrl${index + 1}`] = url;
            return acc;
          }, {});
          const newProductData = { ...productData, ...imageUrlsObj };
          return addDoc(collection(db, "products"), newProductData);
        })
        .then(() => {
          this.updatePagination();
        })
        .catch((error) => {
          throw error;
        });
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
          // console.error("Error fetching product details:", error);
          return null;
        });
    },

    updateProduct(productId, updatedData) {
      const productRef = doc(db, "products", productId);
      return updateDoc(productRef, updatedData)
        .then(() => {
          const index = this.products.findIndex(
            (product) => product.id === productId
          );
          if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedData };
          }
        })
        .catch((error) => {
          return error;
        });
    },

    // deleteProduct(productId) {
    //   if (!productId) return;
    //   const productRef = doc(db, "products", productId);
    //   deleteDoc(productRef)
    //     .then(() => {
    //       this.products = this.products.filter(
    //         (product) => product.id !== productId
    //       );
    //       this.updatePagination();
    //     })
    //     .catch((error) => {
    //       console.error("Error deleting product:", error);
    //     });
    // },

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
