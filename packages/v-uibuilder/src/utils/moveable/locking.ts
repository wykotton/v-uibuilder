/**
 * 添加锁
 * @param element 节点
 * @param type 锁的类型 (attributes|moveable|all)
 */
export function addLocking(element: HTMLElement, type: string) {
	if (!element || !type) return;
	switch (type) {
		case "attributes":
			(element as any).locking ? ((element as any).locking = { attributes: true }) : ((element as any).locking.attributes = true);
			break;
		case "moveable":
			(element as any).locking ? ((element as any).locking = { moveable: true }) : ((element as any).locking.moveable = true);
			break;
		case "all":
			(element as any).locking = { attributes: true, moveable: true };
			break;
	}
}

/**
 * 移除锁
 * @param element 节点
 * @param type 锁的类型 (attributes|moveable|all)
 */
export function removeLocking(element: HTMLElement, type: string) {
	if (!element || !type) return;
	switch (type) {
		case "attributes":
			(element as any).locking ? void 0 : ((element as any).locking.attributes = false);
			break;
		case "moveable":
			(element as any).locking ? void 0 : ((element as any).locking.moveable = false);
			break;
		case "all":
			(element as any).locking = { attributes: false, moveable: false };
			break;
	}
}

/**
 * 检查锁
 * @param element 节点
 * @param type 锁的类型 (attributes|moveable)
 */
export function checkLocking(element: HTMLElement, type: string) {
	if (!element || !type) return false;
	switch (type) {
		case "attributes":
			if ((element as any).locking && (element as any).locking.attributes) {
				return true;
			}
			return false;

		case "moveable":
			if ((element as any).locking && (element as any).locking.moveable) {
				return true;
			}
			return false;
	}
	return false;
}
