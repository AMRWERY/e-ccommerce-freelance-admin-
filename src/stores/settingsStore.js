import { db, storage } from "@/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    settings: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSettings() {
      try {
        this.loading = true;
        const docRef = doc(db, "settings", "appSettings");
        const docSnap = await getDoc(docRef);
        this.settings = docSnap.exists()
          ? docSnap.data()
          : {
              socialMedia: {},
              contactNumbers: {},
              logo: {},
              homeSliders: {},
            };
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async saveSection(section, data, imageFiles = {}, removedImages = {}) {
      this.loading = true;
      const settingsRef = doc(db, "settings", "appSettings");
      try {
        if (section === "homeSliders") {
          // 1) Upload new files & get URLs
          const imageUrls = await this.handleHomeSliderImages(
            imageFiles,
            removedImages
          );
          // 2) Build update payload that both sets new URLs and deletes removed keys
          const updatePayload = {};
          for (const [key, url] of Object.entries(imageUrls)) {
            updatePayload[`homeSliders.${key}`] = url;
          }
          // explicitly delete each removed slider key
          for (const key of Object.keys(removedImages)) {
            updatePayload[`homeSliders.${key}`] = deleteField();
          }
          await updateDoc(settingsRef, updatePayload);
        } else {
          // for everything else, just merge
          await setDoc(settingsRef, { [section]: data }, { merge: true });
        }
        // refresh local copy
        await this.fetchSettings();
      } catch (err) {
        console.error("saveSection failed:", err);
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // async saveSection(section, data, imageFiles = {}, removedImages = {}) {
    //   try {
    //     this.loading = true;
    //     let processedData = data;
    //     if (section === "homeSliders") {
    //       const imageUrls = await this.handleHomeSliderImages(
    //         imageFiles,
    //         removedImages
    //       );
    //       processedData = imageUrls;
    //     }
    //     await setDoc(
    //       doc(db, "settings", "appSettings"),
    //       { [section]: processedData },
    //       { merge: true }
    //     );
    //     await this.fetchSettings();
    //   } catch (error) {
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    async handleHomeSliderImages(imageFiles, removedImages) {
      const imageUrls = { ...this.settings.homeSliders };
      for (const key of Object.keys(removedImages)) {
        if (imageUrls[key]) {
          const oldPath = decodeURIComponent(
            imageUrls[key].split("/o/")[1].split("?")[0]
          );
          await deleteObject(storageRef(storage, oldPath));
          imageUrls[key] = null;
        }
      }
      for (const [key, file] of Object.entries(imageFiles)) {
        const path = `settings/${Date.now()}_${file.name}`;
        const ref = storageRef(storage, path);
        await uploadBytes(ref, file);
        imageUrls[key] = await getDownloadURL(ref);
      }
      Object.keys(imageUrls).forEach((key) => {
        if (imageUrls[key] === null) delete imageUrls[key];
      });
      return imageUrls;
    },
  },
});
