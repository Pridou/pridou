import { type LexerToken, LexerTokenType } from "@/types/lexer";
import {
  type ASTAssignmentExpression,
  type ASTBinaryExpression,
  type ASTComparisonExpression,
  type ASTFunctionCallExpression,
  type ASTFunctionDeclarationStatement,
  type ASTIdentifier,
  type ASTNode,
  ASTNodeType,
  type ASTNumber,
  type ASTProgram,
  type ASTReturnStatement,
  type ASTString,
  type ASTVariableDeclarationStatement,
  type ASTWhileStatement,
} from "@/types/parser";

import Lexer from "@/lexer";

import {
  ADDITIVE_OPERATORS,
  COMPARISON_OPERATORS,
  MULTIPLICATIVE_OPERATORS,
} from "@/config/parser";

import InvalidTokenError from "@/errors/InvalidTokenError";

export default class Parser {
  #tokens: LexerToken[] = [];

  private peek(offset = 0): LexerToken {
    return this.#tokens[offset];
  }

  private shift(): LexerToken {
    const token: LexerToken | undefined = this.#tokens.shift();

    if (!token) {
      throw new InvalidTokenError("Unexpected end of file.");
    }

    return token;
  }

  private expect(value: string): void {
    const token: LexerToken = this.shift();

    if (token.value !== value) {
      throw new InvalidTokenError(
        `Invalid token "${token.value}" was found, expected "${value}".`,
      );
    }
  }

  private parseFunctionCallExpression(
    identifier: string,
  ): ASTFunctionCallExpression {
    const functionCallExpression: ASTFunctionCallExpression = {
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

  private parseVariableDeclarationStatement(): ASTVariableDeclarationStatement {
    const isConstant: boolean = this.shift().type === LexerTokenType.Fix;

    const identifier = this.shift();

    if (identifier?.type !== LexerTokenType.Identifier) {
      throw new InvalidTokenError(
        "Expected identifier after mut/immut declaration.",
      );
    }

    if (this.peek()?.type === LexerTokenType.Semicolon) {
      if (isConstant) {
        throw new InvalidTokenError(
          "Cannot declare a constant without an initializer.",
        );
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

    const variableDeclarationStatement: ASTVariableDeclarationStatement = {
      type: ASTNodeType.VariableDeclarationStatement,
      value: this.parseAssignmentExpression(),
      identifier: identifier.value,
      metadata: {
        isConstant,
      },
    };

    if (
      variableDeclarationStatement.value?.type !==
      ASTNodeType.FunctionCallExpression
    )
      this.expect(LexerTokenType.Semicolon);

    return variableDeclarationStatement;
  }

  private parseBlockBody(): ASTNode[] {
    this.expect(LexerTokenType.LeftCurlyBracket);

    const body: ASTNode[] = [];

    while (this.peek()?.type !== LexerTokenType.RightCurlyBracket) {
      if (!this.peek()) {
        throw new InvalidTokenError("Expected '}' after function block.");
      }

      body.push(this.parseStatement());
    }

    this.expect(LexerTokenType.RightCurlyBracket);

    return body;
  }

  private parseFunctionDeclarationStatement(): ASTFunctionDeclarationStatement {
    this.expect(LexerTokenType.Fun);

    const identifier = this.shift();

    if (identifier.type !== LexerTokenType.Identifier) {
      throw new InvalidTokenError(
        "Expected identifier after function declaration.",
      );
    }

    this.expect(LexerTokenType.LeftRoundBracket);

    const functionDeclarationStatement: ASTFunctionDeclarationStatement = {
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

  private parseReturnStatement(): ASTReturnStatement {
    this.expect(LexerTokenType.Ret);

    const isSemicolon = this.peek().type === LexerTokenType.Semicolon;
    const expression: ASTNode = isSemicolon
      ? <ASTNumber>{ type: ASTNodeType.Number, value: 0 }
      : this.parseAdditiveExpression();

    if (expression.type !== ASTNodeType.FunctionCallExpression) {
      this.expect(LexerTokenType.Semicolon);
    }

    return <ASTReturnStatement>{
      type: ASTNodeType.ReturnStatement,
      value: expression,
    };
  }

  private parseComparisonExpression(): ASTComparisonExpression | ASTNode {
    let leftExpression: ASTNode = this.parseAdditiveExpression();

    while (COMPARISON_OPERATORS.has(this.peek()?.type)) {
      const comparisonOperator: string = this.shift().value;
      const rightExpression: ASTNode = this.parseAdditiveExpression();

      leftExpression = <ASTComparisonExpression>{
        type: ASTNodeType.ComparisonExpression,
        comparisonOperator,
        leftExpression,
        rightExpression,
      };
    }

    return leftExpression;
  }

  private parseWhileStatement(): ASTWhileStatement {
    this.expect(LexerTokenType.Wil);

    this.expect(LexerTokenType.LeftRoundBracket);

    const comparison: ASTComparisonExpression | ASTNode =
      this.parseComparisonExpression();

    this.expect(LexerTokenType.RightRoundBracket);

    return <ASTWhileStatement>{
      type: ASTNodeType.WhileStatement,
      body: this.parseBlockBody(),
      comparison,
    };
  }

  private parsePrimitiveExpression(): ASTNode {
    switch (this.peek().type) {
      case LexerTokenType.LeftRoundBracket: {
        this.expect(LexerTokenType.LeftRoundBracket);

        const expression: ASTNode = this.parseAdditiveExpression();
        const temporaryToken: LexerToken = this.shift();

        if (
          !temporaryToken ||
          temporaryToken.type !== LexerTokenType.RightRoundBracket
        ) {
          throw new InvalidTokenError("Expected ')' after expression.");
        }

        return expression;
      }
      case LexerTokenType.Number:
        return <ASTNumber>{
          type: ASTNodeType.Number,
          value: +this.shift().value,
        };
      case LexerTokenType.String:
        return <ASTString>{
          type: ASTNodeType.String,
          value: this.shift().value,
        };
      case LexerTokenType.Identifier: {
        const identifier = this.shift().value;

        if (this.peek()?.type === LexerTokenType.LeftRoundBracket) {
          return this.parseFunctionCallExpression(identifier);
        }

        return <ASTIdentifier>{
          type: ASTNodeType.Identifier,
          value: identifier,
        };
      }
      default:
        throw new InvalidTokenError(
          `Invalid token ${this.peek().type} was found.`,
        );
    }
  }

  private parseMultiplicativeExpression(): ASTBinaryExpression {
    let leftExpression: ASTBinaryExpression = <ASTBinaryExpression>(
      this.parsePrimitiveExpression()
    );

    while (MULTIPLICATIVE_OPERATORS.has(this.peek()?.type)) {
      const binaryOperator: string = this.shift().value;
      const rightExpression: ASTNode = this.parsePrimitiveExpression();

      leftExpression = {
        type: ASTNodeType.BinaryExpression,
        binaryOperator,
        leftExpression,
        rightExpression,
      };
    }

    return leftExpression;
  }

  private parseAdditiveExpression(): ASTBinaryExpression {
    let leftExpression: ASTBinaryExpression =
      this.parseMultiplicativeExpression();

    while (ADDITIVE_OPERATORS.has(this.peek()?.type)) {
      const binaryOperator: string = this.shift().value;
      const rightExpression: ASTNode = this.parseMultiplicativeExpression();

      leftExpression = {
        type: ASTNodeType.BinaryExpression,
        leftExpression,
        rightExpression,
        binaryOperator,
      };
    }

    return leftExpression;
  }

  private parseAssignmentExpression(): ASTAssignmentExpression | ASTNode {
    const leftExpression: ASTComparisonExpression | ASTNode =
      this.parseComparisonExpression();

    if (this.peek()?.type === LexerTokenType.Assignment) {
      this.expect(LexerTokenType.Assignment);

      if (leftExpression.type !== ASTNodeType.Identifier) {
        throw new InvalidTokenError(
          "Unexpected assignment to binary expression.",
        );
      }

      const expression: ASTAssignmentExpression = {
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

  private parseStatement(): ASTNode {
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

  public toAST(tokens: LexerToken[]): ASTProgram {
    this.#tokens = tokens;

    const program: ASTProgram = {
      type: ASTNodeType.Program,
      body: new Set<ASTNode>(),
    };

    while (this.peek()) {
      program.body.add(this.parseStatement());
    }

    return program;
  }

  public sourceCodeToAST(sourceCode: string): ASTProgram {
    return this.toAST(new Lexer().toTokens(sourceCode));
  }
}
