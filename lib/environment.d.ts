import type { InterpreterValue } from "./types/interpreter.js";
export default class Environment {
    #private;
    constructor(parent?: Environment);
    get parent(): Environment | undefined;
    addVariable(identifier: string, value: InterpreterValue, isConstant: boolean): InterpreterValue;
    getVariable(identifier: string): InterpreterValue;
    setVariable(identifier: string, value: InterpreterValue): InterpreterValue;
}
