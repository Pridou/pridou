var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Environment_parent, _Environment_constants, _Environment_variables;
import InvalidVariableError from "./errors/InvalidVariableError.js";
class Environment {
    constructor(parent) {
        _Environment_parent.set(this, void 0);
        _Environment_constants.set(this, void 0);
        _Environment_variables.set(this, void 0);
        __classPrivateFieldSet(this, _Environment_parent, parent, "f");
        __classPrivateFieldSet(this, _Environment_constants, new Set(), "f");
        __classPrivateFieldSet(this, _Environment_variables, new Map(), "f");
    }
    get parent() {
        return __classPrivateFieldGet(this, _Environment_parent, "f");
    }
    addVariable(identifier, value, isConstant) {
        if (__classPrivateFieldGet(this, _Environment_variables, "f").has(identifier)) {
            throw new InvalidVariableError(`Variable "${identifier}" has already been declared.`);
        }
        if (!isConstant) {
            let environment = __classPrivateFieldGet(this, _Environment_parent, "f");
            while (environment) {
                if (__classPrivateFieldGet(environment, _Environment_constants, "f").has(identifier)) {
                    throw new InvalidVariableError(`Constant "${identifier}" from parent's scope cannot be shadowed.`);
                }
                environment = __classPrivateFieldGet(environment, _Environment_parent, "f");
            }
        }
        __classPrivateFieldGet(this, _Environment_variables, "f").set(identifier, value);
        if (isConstant) {
            __classPrivateFieldGet(this, _Environment_constants, "f").add(identifier);
        }
        return value;
    }
    getVariable(identifier) {
        let environment = this;
        while (environment) {
            if (__classPrivateFieldGet(environment, _Environment_variables, "f").has(identifier)) {
                return __classPrivateFieldGet(environment, _Environment_variables, "f").get(identifier);
            }
            environment = __classPrivateFieldGet(environment, _Environment_parent, "f");
        }
        throw new InvalidVariableError(`Variable "${identifier}" was not found.`);
    }
    setVariable(identifier, value) {
        if (__classPrivateFieldGet(this, _Environment_variables, "f").has(identifier)) {
            if (__classPrivateFieldGet(this, _Environment_constants, "f").has(identifier)) {
                throw new InvalidVariableError(`Constant "${identifier}" cannot be reassigned.`);
            }
            __classPrivateFieldGet(this, _Environment_variables, "f").set(identifier, value);
            return value;
        }
        if (__classPrivateFieldGet(this, _Environment_parent, "f")) {
            return __classPrivateFieldGet(this, _Environment_parent, "f").setVariable(identifier, value);
        }
        throw new InvalidVariableError(`Variable "${identifier} was not found."`);
    }
}
_Environment_parent = new WeakMap(), _Environment_constants = new WeakMap(), _Environment_variables = new WeakMap();
export default Environment;
