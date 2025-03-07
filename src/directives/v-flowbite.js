import { initFlowbite } from "flowbite";

export default {
  mounted(el) {
    // Initialize Flowbite components on mount
    initFlowbite();
  },
  updated(el) {
    // Reinitialize Flowbite components on update
    initFlowbite();
  },
};
