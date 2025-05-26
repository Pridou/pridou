import type { LexerToken, LexerTokenType } from ".";

export interface Config {
    [token: string]:LexerTokenType
}