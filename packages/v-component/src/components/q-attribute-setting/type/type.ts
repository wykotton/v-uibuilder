import _object from "./object";
import _string from "./string";
import _array from "./array";
import _boolean from "./boolean";
import _number from "./number";
const TYPE_NAME = ["string", "number", "object", "array", "boolean"];

const TYPE = {
	object: _object,
	string: _string,
	array: _array,
	boolean: _boolean,
	number: _number,
};
export { TYPE, TYPE_NAME };
