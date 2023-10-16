import Guides from "@scena/guides";

function initGuides() {
	// 横向网格实例
	const horizontal = document.querySelector(".ruler.horizontal") as HTMLElement;
	const horizontalGuides = new Guides(horizontal, {
		type: "horizontal",
		textOffset: [0, 6],
		backgroundColor: "#9c9da0",
	});

	// 纵向网格实例
	const vertical = document.querySelector(".ruler.vertical") as HTMLElement;
	const verticalGuides = new Guides(vertical, {
		type: "vertical",
		textOffset: [6, 0],
		backgroundColor: "#9c9da0",
	});
	return { horizontalGuides, verticalGuides };
}

export { initGuides };
