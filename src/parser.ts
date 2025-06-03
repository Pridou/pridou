import Environment from "@/environment";
import Lexer from "@/lexer";

import { InvalidTokenError } from "@/errors";

import {
  type ASTAssignmentExpression,
  type ASTBinaryExpression,
  type ASTFunctionCall,
  type ASTFunctionDeclaration,
  type ASTIdentifier,
  type ASTNode,
  ASTNodeType,
  type ASTNumber,
  type ASTProgram,
  type ASTReturnStatement,
  type ASTString,
  type ASTVariableDeclaration,
} from "@/types/ast";
import { type LexerToken, LexerTokenType } from "@/types/lexer";

const ADDITIVE_OPERATORS: Set<string> = new Set<string>(["+", "-"]);

const MULTIPLICATIVE_OPERATORS: Set<string> = new Set<string>(["%", "*", "/"]);

export default class Parser {
  #tokens: LexerToken[] = [];

  private peek(offset = 0): LexerToken {
    return this.#tokens[offset];
  }

  private parseFunctionCall(identifier: ASTIdentifier): ASTNode {
    const functionCall: ASTFunctionCall = {
      type: ASTNodeType.FunctionCall,
      identifier: identifier.value,
      arguments: [],
    };

    this.#tokens.shift();

    while (this.peek().type !== LexerTokenType.ClosingParenthesis) {
      if (this.peek().type === LexerTokenType.EndOfFile) {
        throw new InvalidTokenError("Expected ')' after function call.");
      }

      functionCall.arguments.push(this.parseAdditiveExpression());

      if (this.peek().type === LexerTokenType.Comma) {
        this.#tokens.shift();
      }
    }

    this.#tokens.shift();

    if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
      throw new InvalidTokenError("Expected ';' after function call.");
    }

    return functionCall;
  }

  private parseFunctionDeclaration(): ASTNode {
    this.#tokens.shift();

    const identifier: LexerToken | undefined = this.#tokens.shift();

    if (identifier?.type !== LexerTokenType.Identifier) {
      throw new InvalidTokenError(
        "Expected identifier after function declaration.",
      );
    }

    if (this.#tokens.shift()?.type !== LexerTokenType.OpeningParenthesis) {
      throw new InvalidTokenError("Expected '(' after function identifier.");
    }

    const functionDeclaration: ASTFunctionDeclaration = {
      type: ASTNodeType.FunctionDeclaration,
      body: [],
      identifier: identifier.value,
      parameters: [],
      environment: new Environment(),
    };

    while (this.peek().type !== LexerTokenType.ClosingParenthesis) {
      if (this.peek().type !== LexerTokenType.Identifier) {
        throw new InvalidTokenError("Expected parameter identifier.");
      }

      functionDeclaration.parameters.push(this.peek().value);

      this.#tokens.shift();

      if (this.peek().type === LexerTokenType.Comma) {
        this.#tokens.shift();
      }
    }

    this.#tokens.shift();

    if (this.#tokens.shift()?.type !== LexerTokenType.OpeningCurlyBracket) {
      throw new InvalidTokenError("Expected '{' after function declaration.");
    }

    while (this.peek().type !== LexerTokenType.ClosingCurlyBracket) {
      if (this.peek().type === LexerTokenType.EndOfFile) {
        throw new InvalidTokenError("Expected '}' after function block.");
      }

      functionDeclaration.body.push(this.parseNode());
    }

    this.#tokens.shift();

    return functionDeclaration;
  }

  private parseVariableDeclaration(): ASTNode {
    const isConstant: boolean =
      this.#tokens.shift()?.type === LexerTokenType.Const;

    const identifier: LexerToken | undefined = this.#tokens.shift();

    if (identifier?.type !== LexerTokenType.Identifier) {
      throw new InvalidTokenError(
        "Expected identifier after mut/immut declaration.",
      );
    }

    if (this.peek().type === LexerTokenType.Semicolon) {
      if (isConstant) {
        throw new InvalidTokenError(
          "Missing initializer in immut declaration.",
        );
      }

      this.#tokens.shift();

      return <ASTVariableDeclaration>{
        type: ASTNodeType.VariableDeclaration,
        identifier: identifier.value,
        metadata: {
          isConstant: false,
        },
      };
    }

    if (this.#tokens.shift()?.type !== LexerTokenType.Equals) {
      throw new InvalidTokenError(
        "Expected '=' after identifier in variable declaration.",
      );
    }

    const variableDeclaration: ASTVariableDeclaration = {
      type: ASTNodeType.VariableDeclaration,
      identifier: identifier.value,
      value: this.parseNode(),
      metadata: {
        isConstant,
      },
    };

    if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
      throw new InvalidTokenError("Expected ';' after variable assignment.");
    }

    return variableDeclaration;
  }

  private parseMultiplicativeExpression(): ASTNode {
    let leftExpression: ASTNode = this.parsePrimitiveExpression();

    while (MULTIPLICATIVE_OPERATORS.has(this.peek()?.value)) {
      const binaryOperator: string | undefined = this.#tokens.shift()?.value;
      const rightExpression: ASTNode = this.parsePrimitiveExpression();

      leftExpression = <ASTBinaryExpression>{
        type: ASTNodeType.BinaryExpression,
        binaryOperator,
        leftExpression,
        rightExpression,
      };
    }

    return leftExpression;
  }

  private parseAdditiveExpression(): ASTNode {
    let leftExpression: ASTNode = this.parseMultiplicativeExpression();

    while (ADDITIVE_OPERATORS.has(this.peek()?.value)) {
      const binaryOperator: string | undefined = this.#tokens.shift()?.value;
      const rightExpression: ASTNode = this.parseMultiplicativeExpression();

      leftExpression = <ASTBinaryExpression>{
        type: ASTNodeType.BinaryExpression,
        binaryOperator,
        leftExpression,
        rightExpression,
      };
    }

    return leftExpression;
  }

  private parsePrimitiveExpression(): ASTNode {
    switch (this.peek().type) {
      case LexerTokenType.OpeningParenthesis: {
        this.#tokens.shift();

        const expression: ASTNode = this.parseAdditiveExpression();
        const temporaryToken: LexerToken | undefined = this.#tokens.shift();

        if (
          !temporaryToken ||
          temporaryToken.type !== LexerTokenType.ClosingParenthesis
        ) {
          throw new InvalidTokenError("Expected ')' after expression.");
        }

        return expression;
      }
      case LexerTokenType.Number:
        return <ASTNumber>{
          type: ASTNodeType.Number,
          value: +(this.#tokens.shift()?.value ?? 0),
        };
      case LexerTokenType.Identifier: {
        const identifier = <ASTIdentifier>{
          type: ASTNodeType.Identifier,
          value: this.#tokens.shift()?.value,
        };

        if (this.peek().type === LexerTokenType.OpeningParenthesis) {
          return this.parseFunctionCall(identifier);
        }

        return identifier;
      }
      case LexerTokenType.String:
        return <ASTString>{
          type: ASTNodeType.String,
          value: this.#tokens.shift()?.value,
        };
      default:
        throw new InvalidTokenError(
          `Expected a number or identifier, but got: ${this.peek()?.value}`,
        );
    }
  }

  private parseAssignmentExpression(): ASTNode {
    const leftExpression: ASTNode = this.parseAdditiveExpression();

    if (this.peek().type === LexerTokenType.Equals) {
      this.#tokens.shift();

      if (leftExpression.type !== ASTNodeType.Identifier) {
        throw new InvalidTokenError(
          "Unexpected assignment to binary expression.",
        );
      }

      const assignmentExpression: ASTAssignmentExpression = {
        type: ASTNodeType.AssignmentExpression,
        value: this.parseAdditiveExpression(),
        assignee: <ASTIdentifier>leftExpression,
      };

      if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
        throw new InvalidTokenError(
          "Expected ';' after assignment expression.",
        );
      }

      return assignmentExpression;
    }

    return leftExpression;
  }

  private parseReturnStatement(): ASTNode {
    this.#tokens.shift();

    const isSemicolon = this.peek().type === LexerTokenType.Semicolon;

    const returnStatement: ASTReturnStatement = {
      type: ASTNodeType.ReturnStatement,
      value: isSemicolon
        ? <ASTNumber>{ type: ASTNodeType.Number, value: 0 }
        : this.parseAdditiveExpression(),
    };

    if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
      throw new InvalidTokenError("Expected ';' after return statement.");
    }

    return returnStatement;
  }

  private parseNode(): ASTNode {
    switch (this.peek().type) {
      case LexerTokenType.Let:
      case LexerTokenType.Const:
        return this.parseVariableDeclaration();
      case LexerTokenType.Function:
        return this.parseFunctionDeclaration();
      case LexerTokenType.Return:
        return this.parseReturnStatement();
      default:
        return this.parseAssignmentExpression();
    }
  }

  public toAST(tokens: LexerToken[]): ASTProgram {
    this.#tokens = tokens;

    const program: ASTProgram = {
      type: ASTNodeType.Program,
      body: [],
    };

    while (this.peek().type !== LexerTokenType.EndOfFile) {
      program.body.push(this.parseNode());
    }

    return program;
  }

  public sourceCodeToAST(sourceCode: string): ASTProgram {
    const tokens = new Lexer().toTokens(sourceCode);

    return this.toAST(tokens);
  }
}
