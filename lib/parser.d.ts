import { type LexerToken } from "./types/lexer.js";
import { type ASTProgram } from "./types/parser.js";
export default class Parser {
    #private;
    private peek;
    private shift;
    private expect;
    private parseFunctionCallExpression;
    private parseVariableDeclarationStatement;
    private parseBlockBody;
    private parseFunctionDeclarationStatement;
    private parseReturnStatement;
    private parseComparisonExpression;
    private parseWhileStatement;
    private parsePrimitiveExpression;
    private parseMultiplicativeExpression;
    private parseAdditiveExpression;
    private parseAssignmentExpression;
    private parseStatement;
    toAST(tokens: LexerToken[]): ASTProgram;
    sourceCodeToAST(sourceCode: string): ASTProgram;
}
