export function clearAttr(obj: Object) {
	for (const key in obj) {
		delete obj[key];
	}
}

/**
 * 快速拷贝两个对象的属性值
 * @param {*} source
 * @param {*} target
 */
export function copyAttr(source: any, target: any) {
	Object.keys(target).forEach((key) => {
		target[key] = source[key];
	});
}

export function isNull(ele: any) {
	if (typeof ele === "undefined") {
		return true;
	} else if (ele === null) {
		return true;
	} else if (ele === "") {
		return true;
	}
	return false;
}
