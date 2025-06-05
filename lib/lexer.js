// TODO: Maybe count boundaries (i.e. { { ... } }, /* /* ... */ */) for nesting
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
var _Lexer_source, _Lexer_tokens;
import { LexerTokenType } from "./types/lexer.js";
import { CLASSIC_TOKENS, RESERVED_TOKENS, SKIPPED_TOKENS, } from "./config/lexer.js";
import { isIdentifier, isNumber } from "./utils/index.js";
import InvalidTokenError from "./errors/InvalidTokenError.js";
class Lexer {
    constructor() {
        _Lexer_source.set(this, []);
        _Lexer_tokens.set(this, []);
    }
    peek(offset = 0) {
        return __classPrivateFieldGet(this, _Lexer_source, "f")[offset];
    }
    save(type, value) {
        __classPrivateFieldGet(this, _Lexer_tokens, "f").push({ type, value });
    }
    shift(offset = 1) {
        let shift = "";
        for (let i = 0; i < offset; i++) {
            shift += __classPrivateFieldGet(this, _Lexer_source, "f").shift();
        }
        return shift;
    }
    toTokens(sourceCode) {
        __classPrivateFieldSet(this, _Lexer_source, sourceCode.split(""), "f");
        while (__classPrivateFieldGet(this, _Lexer_source, "f").length > 0) {
            // Parse one-line comments
            if (this.peek() === "/" && this.peek(1) === "/") {
                while (this.peek() !== "\n") {
                    this.shift();
                }
                // Shift "\n"
                this.shift();
                continue;
            }
            // Parse many-lines comments
            if (this.peek() === "/" && this.peek(1) === "*") {
                // Shift "/*"
                this.shift(2);
                while (this.peek() !== "*" && this.peek(1) !== "/") {
                    this.shift();
                }
                // Shift "*/"
                this.shift(2);
                continue;
            }
            // Parse numbers
            if (isNumber(this.peek())) {
                let number = this.shift();
                while (isNumber(this.peek())) {
                    number += this.shift();
                }
                if (this.peek() === LexerTokenType.Dot) {
                    number += this.shift();
                }
                while (isNumber(this.peek())) {
                    number += this.shift();
                }
                this.save(LexerTokenType.Number, number);
                continue;
            }
            // Parse identifiers
            if (isIdentifier(this.peek())) {
                let identifier = this.shift();
                while (isIdentifier(this.peek())) {
                    identifier += this.shift();
                }
                this.save(RESERVED_TOKENS.get(identifier) ?? LexerTokenType.Identifier, identifier);
                continue;
            }
            // Parse skipped
            if (SKIPPED_TOKENS.has(this.peek())) {
                this.shift();
                continue;
            }
            // Parse classics
            if (CLASSIC_TOKENS.has(this.peek())) {
                this.save(CLASSIC_TOKENS.get(this.peek()), this.shift());
                continue;
            }
            let token = "";
            switch (this.peek()) {
                // Parse strings
                case LexerTokenType.SingleQuote:
                case LexerTokenType.DoubleQuote: {
                    let string = "";
                    const quote = this.shift();
                    while (__classPrivateFieldGet(this, _Lexer_source, "f").length > 0 && this.peek() !== quote) {
                        string += this.shift();
                    }
                    if (__classPrivateFieldGet(this, _Lexer_source, "f").length === 0) {
                        throw new InvalidTokenError("Unterminated string literal.");
                    }
                    this.shift();
                    this.save(LexerTokenType.String, string);
                    break;
                }
                case LexerTokenType.Modulus:
                case LexerTokenType.Multiply:
                case LexerTokenType.Divide:
                    token = this.shift();
                    if (this.peek() === LexerTokenType.Assignment) {
                        token += this.shift();
                    }
                    this.save(token, token);
                    break;
                case LexerTokenType.Plus:
                    token = this.shift();
                    if (this.peek() === LexerTokenType.Plus) {
                        this.save(LexerTokenType.Increment, token + this.shift());
                        break;
                    }
                    if (this.peek() === LexerTokenType.Assignment) {
                        this.save(LexerTokenType.Assignment, token + this.shift());
                        break;
                    }
                    if (isNumber(this.peek())) {
                        while (isNumber(this.peek())) {
                            token += this.shift();
                        }
                        if (this.peek() === LexerTokenType.Dot) {
                            token += this.shift();
                        }
                        while (isNumber(this.peek())) {
                            token += this.shift();
                        }
                        this.save(LexerTokenType.Number, token);
                        break;
                    }
                    // TODO: Add support for identifiers (i.e. +<identifier>)
                    this.save(LexerTokenType.Plus, token);
                    break;
                case LexerTokenType.Minus:
                    token = this.shift();
                    if (this.peek() === LexerTokenType.Minus) {
                        this.save(LexerTokenType.Decrement, token + this.shift());
                        break;
                    }
                    if (this.peek() === LexerTokenType.Assignment) {
                        this.save(LexerTokenType.Assignment, token + this.shift());
                        break;
                    }
                    if (isNumber(this.peek())) {
                        while (isNumber(this.peek())) {
                            token += this.shift();
                        }
                        if (this.peek() === LexerTokenType.Dot) {
                            token += this.shift();
                        }
                        while (isNumber(this.peek())) {
                            token += this.shift();
                        }
                        this.save(LexerTokenType.Number, token);
                        break;
                    }
                    // TODO: Add support for identifiers (i.e. -<identifier>)
                    this.save(LexerTokenType.Minus, token);
                    break;
                case LexerTokenType.Assignment:
                    token = this.shift();
                    if (this.peek() === LexerTokenType.Assignment) {
                        this.save(LexerTokenType.Equality, token + this.shift());
                        break;
                    }
                    this.save(LexerTokenType.Assignment, token);
                    break;
                case LexerTokenType.LessThan:
                case LexerTokenType.GreaterThan:
                    token = this.shift();
                    if (this.peek() === LexerTokenType.Assignment) {
                        token += this.shift();
                        this.save(token, token);
                        break;
                    }
                    this.save(token, token);
                    break;
                default:
                    throw new InvalidTokenError(`Invalid token ${this.peek()} was found.`);
            }
        }
        return __classPrivateFieldGet(this, _Lexer_tokens, "f");
    }
}
_Lexer_source = new WeakMap(), _Lexer_tokens = new WeakMap();
export default Lexer;
