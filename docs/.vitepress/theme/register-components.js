import Demo from "vitepress-theme-demoblock/dist/client/components/Demo.vue";
import DemoBlock from "vitepress-theme-demoblock/dist/client/components/DemoBlock.vue";
import Message from "vitepress-theme-demoblock/dist/client/components/Message.vue";

export function useComponents(app) {
	app.component("Demo", Demo);
	app.component("DemoBlock", DemoBlock);
	app.component("Message", Message);
	
}
