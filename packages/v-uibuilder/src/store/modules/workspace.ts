import { defineStore } from "pinia";
import { store } from "@/store";
import { PageType } from "@/enums/workspace";

interface WorkspaceState {
  currentPageType: PageType;
  endToEndInfo: any;
}
export const useWorkspaceStore = defineStore({
  id: "workspace",
  state: (): WorkspaceState => {
    return {
      currentPageType: PageType.PROJECT,
      endToEndInfo: {},
    };
  },
  getters: {},
  actions: {
    setPageType(type: PageType) {
      this.currentPageType = type;
    },
    setEndToEndInfo(info: any) {
      this.endToEndInfo = info;
    },
    clearEndToEndInfo() {
      this.endToEndInfo = {};
    },
  },
});

// Need to be used outside the setup
export function useWorkspaceStoreWithOut() {
  return useWorkspaceStore(store);
}
