import { LexerTokenType } from "@/types/lexer";

export const MULTIPLICATIVE_OPERATORS: Set<string> = new Set([
  LexerTokenType.Modulus,
  LexerTokenType.Multiply,
  LexerTokenType.Divide,
]);

export const ADDITIVE_OPERATORS: Set<string> = new Set([
  LexerTokenType.Plus,
  LexerTokenType.Minus,
]);

export const COMPARISON_OPERATORS: Set<string> = new Set([
  LexerTokenType.LessThan,
  LexerTokenType.LessThanOrEqual,
  LexerTokenType.Equality,
  LexerTokenType.GreaterThan,
  LexerTokenType.GreaterThanOrEqual,
]);

export const ASSIGNMENT_OPERATORS: Set<string> = new Set([
  LexerTokenType.Increment,
  LexerTokenType.Decrement,
  LexerTokenType.Assignment,
  LexerTokenType.ModulusEquals,
  LexerTokenType.MultiplyEquals,
  LexerTokenType.PlusEquals,
  LexerTokenType.MinusEquals,
  LexerTokenType.DivideEquals,
]);
