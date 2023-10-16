import guideLocale from "./guide.json";
import componentLocale from "./component.json";

function getGuideSidebar() {
	return [...guideLocale];
}

function getComponentsSideBar() {
	return [...componentLocale];
}

// return sidebar with language configs.
// this might create duplicated data but the overhead is ignorable
const getSidebars = () => {
	return {
		"/guide/": getGuideSidebar(),
		"/component/": getComponentsSideBar(),
	};
};

export const sidebar = getSidebars();
