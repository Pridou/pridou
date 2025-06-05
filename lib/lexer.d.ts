import { type LexerToken } from "./types/lexer.js";
export default class Lexer {
    #private;
    private peek;
    private save;
    private shift;
    toTokens(sourceCode: string): LexerToken[];
}
