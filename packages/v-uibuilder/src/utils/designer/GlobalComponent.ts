import { message, notification, Modal } from "ant-design-vue";
import { Dialog } from "../dialog";
import { Drawer } from "../drawer";

class GlobalComponent {
    constructor() {
        this.installComponent();
    }

    installComponent() {
        Object.assign(this, {
            message,
            notification,
            Modal,
            Dialog,
            Drawer
        })
    }
}

export const globalComponent = new GlobalComponent();