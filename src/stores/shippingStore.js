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
  },

  getters: {
    getGovernorates: (state) => (countryCode) => {
      return state.shippingCosts?.[countryCode]?.governorates || [];
    },
  },
});
