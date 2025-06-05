import { type InterpreterValue } from "./types/interpreter.js";
import Environment from "./environment.js";
export default class Interpreter {
    private env;
    constructor(environment?: Environment);
    private init;
    private evaluateProgram;
    private evaluateFunctionCallExpression;
    private evaluateVariableDeclarationStatement;
    private evaluateFunctionDeclarationStatement;
    private evaluateReturnStatement;
    private evaluateBinaryExpression;
    private evaluateComparisonExpression;
    private evaluateWhileStatement;
    private evaluateAssignmentExpression;
    private evaluateNode;
    setEnvironment(environment: Environment): void;
    eval(sourceCode: string): InterpreterValue;
    run(sourceCode: string): void;
}
