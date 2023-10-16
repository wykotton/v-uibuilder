import { defineStore } from "pinia";
import { store } from "@/store";
import { IUndoRedoData } from "@/types/IConfigData";

export const useHeaderStore = defineStore({
  id: "header",
  state: (): any => ({
    snapshotData: {},
    manualRefHistory: {},
  }),
  getters: {},
  actions: {
    setSnapshotData(data: IUndoRedoData) {
      this.snapshotData = data;
    },
    setManualRefHistory(example: any) {
      this.manualRefHistory = example;
    },
  },
});

// Need to be used outside the setup
export function useHeaderStoreWithOut() {
  return useHeaderStore(store);
}
