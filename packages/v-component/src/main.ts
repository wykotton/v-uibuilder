import "./components/index";

import BootStrap from "./types/runtime/BootStrap";
import DesignerPage from "./types/runtime/DesignerPage";
import { eventBus } from "./types/runtime/EventBus";
import "./plugins/index"
(window as any).v_component = {
  BootStrap,
  DesignerPage,
  eventBus,
};
