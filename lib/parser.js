var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Parser_tokens;
import { LexerTokenType } from "./types/lexer.js";
import { ASTNodeType, } from "./types/parser.js";
import Lexer from "./lexer.js";
import { ADDITIVE_OPERATORS, COMPARISON_OPERATORS, MULTIPLICATIVE_OPERATORS, } from "./config/parser.js";
import InvalidTokenError from "./errors/InvalidTokenError.js";
class Parser {
    constructor() {
        _Parser_tokens.set(this, []);
    }
    peek(offset = 0) {
        return __classPrivateFieldGet(this, _Parser_tokens, "f")[offset];
    }
    shift() {
        const token = __classPrivateFieldGet(this, _Parser_tokens, "f").shift();
        if (!token) {
            throw new InvalidTokenError("Unexpected end of file.");
        }
        return token;
    }
    expect(value) {
        const token = this.shift();
        if (token.value !== value) {
            throw new InvalidTokenError(`Invalid token "${token.value}" was found, expected "${value}".`);
        }
    }
    parseFunctionCallExpression(identifier) {
        const functionCallExpression = {
            type: ASTNodeType.FunctionCallExpression,
            identifier,
            arguments: [],
        };
        this.expect(LexerTokenType.LeftRoundBracket);
        while (this.peek()?.type !== LexerTokenType.RightRoundBracket) {
            if (!this.peek()) {
                throw new InvalidTokenError("Expected ')' after function call.");
            }
            functionCallExpression.arguments.push(this.parseAssignmentExpression());
            if (this.peek()?.type === LexerTokenType.Comma) {
                this.expect(LexerTokenType.Comma);
            }
        }
        this.expect(LexerTokenType.RightRoundBracket);
        this.expect(LexerTokenType.Semicolon);
        return functionCallExpression;
    }
    parseVariableDeclarationStatement() {
        const isConstant = this.shift().type === LexerTokenType.Fix;
        const identifier = this.shift();
        if (identifier?.type !== LexerTokenType.Identifier) {
            throw new InvalidTokenError("Expected identifier after mut/immut declaration.");
        }
        if (this.peek()?.type === LexerTokenType.Semicolon) {
            if (isConstant) {
                throw new InvalidTokenError("Cannot declare a constant without an initializer.");
            }
            this.expect(LexerTokenType.Semicolon);
            return {
                type: ASTNodeType.VariableDeclarationStatement,
                identifier: identifier.value,
                metadata: {
                    isConstant,
                },
            };
        }
        this.expect(LexerTokenType.Assignment);
        const variableDeclarationStatement = {
            type: ASTNodeType.VariableDeclarationStatement,
            value: this.parseAssignmentExpression(),
            identifier: identifier.value,
            metadata: {
                isConstant,
            },
        };
        if (variableDeclarationStatement.value?.type !==
            ASTNodeType.FunctionCallExpression)
            this.expect(LexerTokenType.Semicolon);
        return variableDeclarationStatement;
    }
    parseBlockBody() {
        this.expect(LexerTokenType.LeftCurlyBracket);
        const body = [];
        while (this.peek()?.type !== LexerTokenType.RightCurlyBracket) {
            if (!this.peek()) {
                throw new InvalidTokenError("Expected '}' after function block.");
            }
            body.push(this.parseStatement());
        }
        this.expect(LexerTokenType.RightCurlyBracket);
        return body;
    }
    parseFunctionDeclarationStatement() {
        this.expect(LexerTokenType.Fun);
        const identifier = this.shift();
        if (identifier.type !== LexerTokenType.Identifier) {
            throw new InvalidTokenError("Expected identifier after function declaration.");
        }
        this.expect(LexerTokenType.LeftRoundBracket);
        const functionDeclarationStatement = {
            type: ASTNodeType.FunctionDeclarationStatement,
            identifier: identifier.value,
            parameters: [],
        };
        while (this.peek().type !== LexerTokenType.RightRoundBracket) {
            if (this.peek().type !== LexerTokenType.Identifier) {
                throw new InvalidTokenError(`Expected parameter's identifier.`);
            }
            functionDeclarationStatement.parameters.push(this.shift().value);
            if (this.peek().type === LexerTokenType.Comma) {
                this.expect(LexerTokenType.Comma);
            }
        }
        this.expect(LexerTokenType.RightRoundBracket);
        return {
            ...functionDeclarationStatement,
            body: this.parseBlockBody(),
        };
    }
    parseReturnStatement() {
        this.expect(LexerTokenType.Ret);
        const isSemicolon = this.peek().type === LexerTokenType.Semicolon;
        const expression = isSemicolon
            ? { type: ASTNodeType.Number, value: 0 }
            : this.parseComparisonExpression();
        if (expression.type !== ASTNodeType.FunctionCallExpression) {
            this.expect(LexerTokenType.Semicolon);
        }
        return {
            type: ASTNodeType.ReturnStatement,
            value: expression,
        };
    }
    parseComparisonExpression() {
        let leftExpression = this.parseAdditiveExpression();
        while (COMPARISON_OPERATORS.has(this.peek()?.type)) {
            const comparisonOperator = this.shift().value;
            const rightExpression = this.parseAdditiveExpression();
            leftExpression = {
                type: ASTNodeType.ComparisonExpression,
                comparisonOperator,
                leftExpression,
                rightExpression,
            };
        }
        return leftExpression;
    }
    parseWhileStatement() {
        this.expect(LexerTokenType.Wil);
        this.expect(LexerTokenType.LeftRoundBracket);
        const comparison = this.parseComparisonExpression();
        this.expect(LexerTokenType.RightRoundBracket);
        return {
            type: ASTNodeType.WhileStatement,
            body: this.parseBlockBody(),
            comparison,
        };
    }
    parsePrimitiveExpression() {
        switch (this.peek().type) {
            case LexerTokenType.LeftRoundBracket: {
                this.expect(LexerTokenType.LeftRoundBracket);
                const expression = this.parseAdditiveExpression();
                const temporaryToken = this.shift();
                if (!temporaryToken ||
                    temporaryToken.type !== LexerTokenType.RightRoundBracket) {
                    throw new InvalidTokenError("Expected ')' after expression.");
                }
                return expression;
            }
            case LexerTokenType.Number:
                return {
                    type: ASTNodeType.Number,
                    value: +this.shift().value,
                };
            case LexerTokenType.String:
                return {
                    type: ASTNodeType.String,
                    value: this.shift().value,
                };
            case LexerTokenType.Identifier: {
                const identifier = this.shift().value;
                if (this.peek()?.type === LexerTokenType.LeftRoundBracket) {
                    return this.parseFunctionCallExpression(identifier);
                }
                return {
                    type: ASTNodeType.Identifier,
                    value: identifier,
                };
            }
            default:
                throw new InvalidTokenError(`Invalid token ${this.peek().type} was found.`);
        }
    }
    parseMultiplicativeExpression() {
        let leftExpression = (this.parsePrimitiveExpression());
        while (MULTIPLICATIVE_OPERATORS.has(this.peek()?.type)) {
            const binaryOperator = this.shift().value;
            const rightExpression = this.parsePrimitiveExpression();
            leftExpression = {
                type: ASTNodeType.BinaryExpression,
                binaryOperator,
                leftExpression,
                rightExpression,
            };
        }
        return leftExpression;
    }
    parseAdditiveExpression() {
        let leftExpression = this.parseMultiplicativeExpression();
        while (ADDITIVE_OPERATORS.has(this.peek()?.type)) {
            const binaryOperator = this.shift().value;
            const rightExpression = this.parseMultiplicativeExpression();
            leftExpression = {
                type: ASTNodeType.BinaryExpression,
                leftExpression,
                rightExpression,
                binaryOperator,
            };
        }
        return leftExpression;
    }
    parseAssignmentExpression() {
        const leftExpression = this.parseComparisonExpression();
        if (this.peek()?.type === LexerTokenType.Assignment) {
            this.expect(LexerTokenType.Assignment);
            if (leftExpression.type !== ASTNodeType.Identifier) {
                throw new InvalidTokenError("Unexpected assignment to binary expression.");
            }
            const expression = {
                type: ASTNodeType.AssignmentExpression,
                value: this.parseComparisonExpression(),
                leftExpression,
            };
            if (expression.value?.type !== ASTNodeType.FunctionCallExpression)
                this.expect(LexerTokenType.Semicolon);
            return expression;
        }
        // TODO: Support complex assignment operators
        /* if (ASSIGNMENT_OPERATORS.has(this.peek().type)) {
                this.#tokens = [
                    {
                        type: LexerTokenType.Identifier,
                        value: (<ASTIdentifier>leftExpression).value,
                    },
                    {
                        type: LexerTokenType.BinaryOperator,
                        value: this.shift().value.split("")[0],
                    },
                    ...this.#tokens,
                ];
    
                const assignmentExpression: ASTAssignmentExpression = {
                    type: ASTNodeType.AssignmentExpression,
                    value: this.parseComparisonExpression(),
                    leftExpression,
                };
    
                this.expect(";");
    
                return assignmentExpression;
            } */
        return leftExpression;
    }
    parseStatement() {
        switch (this.peek().type) {
            case LexerTokenType.Fix:
            case LexerTokenType.Mut:
                return this.parseVariableDeclarationStatement();
            case LexerTokenType.Fun:
                return this.parseFunctionDeclarationStatement();
            case LexerTokenType.Ret:
                return this.parseReturnStatement();
            case LexerTokenType.Wil:
                return this.parseWhileStatement();
            default:
                return this.parseAssignmentExpression();
        }
    }
    toAST(tokens) {
        __classPrivateFieldSet(this, _Parser_tokens, tokens, "f");
        const program = {
            type: ASTNodeType.Program,
            body: new Set(),
        };
        while (this.peek()) {
            program.body.add(this.parseStatement());
        }
        return program;
    }
    sourceCodeToAST(sourceCode) {
        return this.toAST(new Lexer().toTokens(sourceCode));
    }
}
_Parser_tokens = new WeakMap();
export default Parser;
