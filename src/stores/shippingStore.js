import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export const useShippingStore = defineStore("shipping", {
  state: () => ({
    shippingCosts: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchShippingCosts() {
      try {
        this.loading = true;
        const docRef = doc(db, "shipping-cost", "cwqaLQhGYdjOpVCBRH0s");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.shippingCosts = docSnap.data();
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async addGovernorate(countryCode, newGovernorate) {
      try {
        const docRef = doc(db, "shipping-cost", "cwqaLQhGYdjOpVCBRH0s");
        const updatedGovernorates = [
          ...this.shippingCosts[countryCode].governorates,
          newGovernorate,
        ];
        await updateDoc(docRef, {
          [`${countryCode}.governorates`]: updatedGovernorates,
        });
        this.shippingCosts[countryCode].governorates = updatedGovernorates;
      } catch (error) {
        throw new Error("Failed to add governorate: " + error.message);
      }
    },

    async updateGovernorateCost(countryCode, governorateName, newCost) {
      try {
        const docRef = doc(db, "shipping-cost", "cwqaLQhGYdjOpVCBRH0s");
        const updatedGovernorates = this.shippingCosts[
          countryCode
        ].governorates.map((g) =>
          g.title === governorateName ? { ...g, cost: newCost } : g
        );
        await updateDoc(docRef, {
          [`${countryCode}.governorates`]: updatedGovernorates,
        });
        this.shippingCosts[countryCode].governorates = updatedGovernorates;
      } catch (error) {
        throw new Error("Failed to update cost: " + error.message);
      }
    },

    async updateGovernorate(countryCode, { originalTitle, newData }) {
      try {
        const docRef = doc(db, "shipping-cost", "cwqaLQhGYdjOpVCBRH0s");
        const currentGovernorates =
          this.shippingCosts[countryCode].governorates;
        const updatedGovernorates = currentGovernorates.map((g) =>
          g.title === originalTitle ? { ...g, ...newData } : g
        );
        await updateDoc(docRef, {
          [`${countryCode}.governorates`]: updatedGovernorates,
        });
        this.shippingCosts[countryCode].governorates = updatedGovernorates;
      } catch (error) {
        throw new Error("Update failed: " + error.message);
      }
    },

    async deleteGovernorate(countryCode, governorateTitle) {
      try {
        const docRef = doc(db, "shipping-cost", "cwqaLQhGYdjOpVCBRH0s");
        const currentGovernorates =
          this.shippingCosts[countryCode].governorates;
        const updatedGovernorates = currentGovernorates.filter(
          (g) => g.title !== governorateTitle
        );
        // Update Firestore
        await updateDoc(docRef, {
          [`${countryCode}.governorates`]: updatedGovernorates,
        });
        // Update local state
        this.shippingCosts[countryCode].governorates = updatedGovernorates;
      } catch (error) {
        throw new Error("Failed to delete governorate: " + error.message);
      }
    },
  },

  getters: {
    getGovernorates: (state) => (countryCode) => {
      return state.shippingCosts?.[countryCode]?.governorates || [];
    },
  },
});
