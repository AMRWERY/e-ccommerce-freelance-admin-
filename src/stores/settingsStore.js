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

    async updateLogo(formData) {
      this.loading = true;
      const settingsRef = doc(db, "settings", "appSettings");
      try {
        const updateData = {
          'logo.name': formData.get('name')
        };

        // Handle logo image if provided
        if (formData.get('logo')) {
          // Delete old logo if exists
          if (this.settings?.logo?.imageUrl) {
            const oldPath = decodeURIComponent(
              this.settings.logo.imageUrl.split("/o/")[1].split("?")[0]
            );
            await deleteObject(storageRef(storage, oldPath));
          }

          // Upload new logo
          const file = formData.get('logo');
          const path = `settings/logo_${Date.now()}_${file.name}`;
          const fileRef = storageRef(storage, path);
          await uploadBytes(fileRef, file);
          const imageUrl = await getDownloadURL(fileRef);
          updateData['logo.imageUrl'] = imageUrl;
        }

        await updateDoc(settingsRef, updateData);
        await this.fetchSettings();
      } catch (error) {
        console.error('Error updating logo:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

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
