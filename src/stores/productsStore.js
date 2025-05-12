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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

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
        this.currentPage = 1;
        this.updatePagination();
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

    async updateProduct(
      productId,
      updatedData,
      imageFiles,
      removedImages = {}
    ) {
      try {
        const productRef = doc(db, "products", productId);
        const existingProduct = await getDoc(productRef);
        const existingData = existingProduct.data();
        const uploadPromises = [];
        const newImageUrls = {};
        const updateData = { ...updatedData };
        Object.keys(removedImages).forEach((imageKey) => {
          updateData[imageKey] = null;
        });
        for (let i = 1; i <= 20; i++) {
          const imageKey = `imageUrl${i}`;
          const file = imageFiles[imageKey];
          if (file) {
            const storagePath = `/products/${productId}/${imageKey}_${file.name}`;
            const storageRef = ref(storage, storagePath);
            uploadPromises.push(
              uploadBytes(storageRef, file)
                .then((snapshot) => getDownloadURL(snapshot.ref))
                .then((url) => {
                  newImageUrls[imageKey] = url;
                })
            );
          } else if (!removedImages[imageKey] && existingData[imageKey]) {
            newImageUrls[imageKey] = existingData[imageKey];
          }
        }
        await Promise.all(uploadPromises);
        const deletePromises = [];
        Object.keys(removedImages).forEach((imageKey) => {
          const oldUrl = existingData[imageKey];
          if (oldUrl) {
            try {
              const path = decodeURIComponent(
                oldUrl.split("/o/")[1].split("?")[0]
              );
              const storageRef = ref(storage, path);
              // Handle deletion errors, ignore if file not found
              const deletePromise = deleteObject(storageRef).catch((error) => {
                if (error.code === "storage/object-not-found") {
                  console.log(`Image not found, skipping deletion: ${path}`);
                  return; // Resolve promise to prevent rejection
                }
                throw error; // Re-throw other errors
              });
              deletePromises.push(deletePromise);
            } catch (error) {
              console.error("Error preparing delete:", error);
            }
          }
        });
        await Promise.all(deletePromises);
        const finalData = {
          ...updateData,
          ...newImageUrls,
          originalPrice: Number(updatedData.originalPrice),
          discountedPrice: Number(updatedData.discountedPrice),
        };
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

    // async updateProduct(
    //   productId,
    //   updatedData,
    //   imageFiles,
    //   removedImages = {}
    // ) {
    //   try {
    //     const productRef = doc(db, "products", productId);
    //     const existingProduct = await getDoc(productRef);
    //     const existingData = existingProduct.data();
    //     const uploadPromises = [];
    //     const newImageUrls = {};
    //     const updateData = { ...updatedData };
    //     Object.keys(removedImages).forEach((imageKey) => {
    //       updateData[imageKey] = null;
    //     });
    //     for (let i = 1; i <= 8; i++) {
    //       const imageKey = `imageUrl${i}`;
    //       const file = imageFiles[imageKey];
    //       if (file) {
    //         const storagePath = `/products/${productId}/${imageKey}_${file.name}`;
    //         const storageRef = ref(storage, storagePath);
    //         uploadPromises.push(
    //           uploadBytes(storageRef, file)
    //             .then((snapshot) => getDownloadURL(snapshot.ref))
    //             .then((url) => {
    //               newImageUrls[imageKey] = url;
    //             })
    //         );
    //       } else if (!removedImages[imageKey] && existingData[imageKey]) {
    //         newImageUrls[imageKey] = existingData[imageKey];
    //       }
    //     }
    //     await Promise.all(uploadPromises);
    //     const deletePromises = [];
    //     Object.keys(removedImages).forEach((imageKey) => {
    //       const oldUrl = existingData[imageKey];
    //       if (oldUrl) {
    //         try {
    //           const path = decodeURIComponent(
    //             oldUrl.split("/o/")[1].split("?")[0]
    //           );
    //           const storageRef = ref(storage, path);
    //           deletePromises.push(deleteObject(storageRef));
    //         } catch (error) {
    //           console.error("Error deleting old image:", error);
    //         }
    //       }
    //     });
    //     await Promise.all(deletePromises);
    //     const finalData = {
    //       ...updateData,
    //       ...newImageUrls,
    //       originalPrice: Number(updatedData.originalPrice),
    //       discountedPrice: Number(updatedData.discountedPrice),
    //     };
    //     await updateDoc(productRef, finalData);
    //     const index = this.products.findIndex((p) => p.id === productId);
    //     if (index !== -1) {
    //       this.products[index] = { ...this.products[index], ...finalData };
    //     }
    //     await this.fetchProducts();
    //   } catch (error) {
    //     console.error("Update error:", error);
    //     throw error;
    //   }
    // },

    async deleteProduct(productId) {
      if (!productId) return;
      try {
        const productRef = doc(db, "products", productId);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const productData = productDoc.data();
          const deletePromises = [];
          for (let i = 1; i <= 4; i++) {
            const imageUrl = productData[`imageUrl${i}`];
            if (imageUrl) {
              const path = decodeURIComponent(
                imageUrl.split("/o/")[1].split("?")[0]
              );
              const storageRef = ref(storage, path);
              deletePromises.push(deleteObject(storageRef));
            }
          }
          await Promise.all(deletePromises);
          await deleteDoc(productRef);
          this.products = this.products.filter(
            (product) => product.id !== productId
          );
          this.updatePagination();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
      }
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
        const productCode = product.productCode?.toLowerCase() || "";
        return (
          title.includes(state.searchProductByTitle) ||
          titleAr.includes(state.searchProductByTitle) ||
          productCode.includes(state.searchProductByTitle)
        );
      });
    },
  },
});
