export function getAttrMap(dom: any) {
    const pairs: Record<string, any> = {};
    for (let i = 0, len = dom.attributes.length; i < len; i++) {
        const name = dom.attributes[i].nodeName;
        const value = dom.attributes[i].nodeValue;
        if (dom.attributes[i].specified) {
            pairs[name] = value;
        }
    }
    return pairs;
}

export const generateId = function() {
    return Math.floor(Math.random() * 10000) + "";
};

export function newEval(fn: string) {
    const Fn = Function;
    return new Fn("return " + fn)();
}
