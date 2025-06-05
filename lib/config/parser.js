import { LexerTokenType } from "../types/lexer.js";
export const MULTIPLICATIVE_OPERATORS = new Set([
    LexerTokenType.Modulus,
    LexerTokenType.Multiply,
    LexerTokenType.Divide,
]);
export const ADDITIVE_OPERATORS = new Set([
    LexerTokenType.Plus,
    LexerTokenType.Minus,
]);
export const COMPARISON_OPERATORS = new Set([
    LexerTokenType.LessThan,
    LexerTokenType.LessThanOrEqual,
    LexerTokenType.Equality,
    LexerTokenType.GreaterThan,
    LexerTokenType.GreaterThanOrEqual,
]);
export const ASSIGNMENT_OPERATORS = new Set([
    LexerTokenType.Increment,
    LexerTokenType.Decrement,
    LexerTokenType.Assignment,
    LexerTokenType.ModulusEquals,
    LexerTokenType.MultiplyEquals,
    LexerTokenType.PlusEquals,
    LexerTokenType.MinusEquals,
    LexerTokenType.DivideEquals,
]);
