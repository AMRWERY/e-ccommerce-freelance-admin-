import { db } from "@/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

export const useCategoriesStore = defineStore("categoriesStore", {
  state: () => ({
    categories: [],
    subCategories: [],
    paginatedCategories: [],
    paginatedSubcategories: [],
    currentPage: 1,
    categoriesPerPage: 8,
    subcategoriesPerPage: 4,
    currentCategory: null,
    currentMarketCategory: null,
    searchCategoryByTitle: "",
  }),

  actions: {
    async fetchCategories() {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        this.categories = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => a.catId - b.catId);
        this.updatePagination();
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },

    async fetchCategoryDetails(categoryId) {
      try {
        const docRef = doc(db, "categories", categoryId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.currentCategory = {
            id: docSnap.id,
            ...docSnap.data(),
          };
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    },

    async updateCategory(categoryId, updatedData, imageFile) {
      try {
        let updateData = { ...updatedData };
        if (imageFile) {
          const storage = getStorage();
          const storagePath = `/categories/${imageFile.name}`;
          const storageRef = ref(storage, storagePath);
          const snapshot = await uploadBytes(storageRef, imageFile);
          updateData.imgOne = await getDownloadURL(snapshot.ref);
        }
        const categoryDoc = doc(db, "categories", categoryId);
        await updateDoc(categoryDoc, updateData);
        const index = this.categories.findIndex((cat) => cat.id === categoryId);
        if (index !== -1) {
          this.categories[index] = {
            ...this.categories[index],
            ...updateData,
          };
          this.updatePagination();
        }
      } catch (error) {
        // console.error("Error updating category:", error);
        throw error;
      }
    },

    async addCategory(title, titleAr, imageFile) {
      const storage = getStorage();
      const storagePath = "/categories/" + imageFile.name;
      const storageRef = ref(storage, storagePath);
      try {
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);
        const docRef = await addDoc(collection(db, "categories"), {
          title,
          titleAr,
          imgOne: imageUrl,
        });
        const newCategory = {
          id: docRef.id,
          title,
          titleAr,
          imgOne: imageUrl,
        };
        this.categories.push(newCategory);
        return newCategory;
      } catch (error) {
        // console.error("Error adding category:", error);
        throw error;
      }
    },

    async deleteCategory(categoryId) {
      try {
        const categoryDoc = doc(db, "categories", categoryId);
        await deleteDoc(categoryDoc);
        this.categories = this.categories.filter(
          (category) => category.id !== categoryId
        );
        const totalPages = Math.ceil(
          this.filteredCategories.length / this.categoriesPerPage
        );
        if (this.currentPage > totalPages) {
          this.currentPage = Math.max(1, totalPages);
        }
        this.updatePagination();
      } catch (error) {
        // console.error("Error deleting category:", error);
        throw error;
      }
    },

    fetchSubCategories() {
      getDocs(collection(db, "subCategories"))
        .then((querySnapshot) => {
          this.subCategories = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.updatePagination();
        })
        .catch((error) => {
          console.error("Error fetching subcategories:", error);
        });
    },

    setSearchTerm(term) {
      this.searchCategoryByTitle = term;
      this.currentPage = 1;
      this.updatePagination();
    },

    updatePagination() {
      const start = (this.currentPage - 1) * this.categoriesPerPage;
      const end = this.currentPage * this.categoriesPerPage;
      this.paginatedCategories = this.filteredCategories.slice(start, end);
      if (this.paginatedCategories.length === 0 && this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePagination();
      }
    },
  },

  getters: {
    totalPages() {
      return Math.ceil(this.filteredCategories.length / this.categoriesPerPage);
    },

    filteredCategories: (state) => {
      const searchTerm = state.searchCategoryByTitle.trim().toLowerCase();
      if (!searchTerm) return state.categories;
      return state.categories.filter((category) => {
        const title = (category.title || "").toLowerCase();
        const titleAr = (category.titleAr || "").toLowerCase();
        return title.includes(searchTerm) || titleAr.includes(searchTerm);
      });
    },

    getCategoryById: (state) => (categoryId) => {
      return state.categories.find(category => category.id === categoryId);
    }
  },
});
