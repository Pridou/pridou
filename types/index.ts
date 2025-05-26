export enum TokenType {
    Alpha,
    Number,

    Equals,
    BinaryOperator,

    OpeningParenthesis,
    ClosingParenthesis,

    Let,
    Const,
}

export interface Token {
    type: TokenType;
    value: string;
}
