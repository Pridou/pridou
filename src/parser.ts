<<<<<<< HEAD
import {InvalidTokenError} from '@/src/errs';
import {tokenize} from '@/src/lexer';
import {type ASTAlpha, type ASTArray, type ASTAssignmentExpression, type ASTBinaryExpression, type ASTExpression, ASTNodeType, type ASTNumber, type ASTProgram, type ASTStatement, type ASTVariableDeclaration, type LexerToken, LexerTokenType,} from '@/types';
=======
import {
	ASTNodeType,
	LexerTokenType,
	type ASTAlpha,
	type ASTAssignmentExpression,
	type ASTBinaryExpression,
	type ASTExpression,
	type ASTFloat,
	type ASTNumber,
	type ASTProgram,
	type ASTStatement,
	type ASTVariableDeclaration,
	type LexerToken,
} from "@/types";
>>>>>>> 73bc23ebbd8fd679be2439303e2c43cdbb3924fa

const additiveOperators: Set<string> = new Set<string>(['+', '-']);
const multiplicativeOperators: Set<string> = new Set<string>(['%', '*', '/']);

export default class Parser {
  #tokens: LexerToken[] = [];

  private peek(offset = 0): LexerToken {
    return this.#tokens[offset];
  }

  private parseVariableDeclaration(): ASTStatement {
    const isConstant: boolean =
        this.#tokens.shift()?.type === LexerTokenType.Const;

    const alpha: string|undefined = this.#tokens.shift()?.value;

    if (!alpha) {
      throw new InvalidTokenError('Expected identifier after let/const');
    }

    if (this.peek().type === LexerTokenType.Semicolon) {
      this.#tokens.shift();

      if (isConstant) {
        throw new InvalidTokenError('Missing initializer in const declaration');
      }

      return <ASTVariableDeclaration>{
        type: ASTNodeType.VariableDeclaration,
        alpha,
        metadata: {
          isConstant: false,
        },
      };
    }

    if (this.#tokens.shift()?.type !== LexerTokenType.Equals) {
      throw new InvalidTokenError('Expected \'=\' in variable declaration');
    }

    const variableDeclaration: ASTVariableDeclaration = {
      type: ASTNodeType.VariableDeclaration,
      alpha,
      value: this.parseExpression(),
      metadata: {
        isConstant,
      },
    };

    if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
      throw new InvalidTokenError('Expected \';\' after variable declaration');
    }

    return variableDeclaration;
  }

  private parseAssignmentExpression(): ASTExpression {
    const leftExpression: ASTExpression = this.parseAdditiveExpression();

    if (this.peek().type === LexerTokenType.Equals) {
      this.#tokens.shift();

<<<<<<< HEAD
      const assignment: ASTAssignmentExpression = {
        type: ASTNodeType.AssignmentExpression,
        value: this.parsePrimitiveExpression(),
        assignee: leftExpression,
      };
=======
			if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
				throw new InvalidTokenError("Expected ';' after assignment expression");
			}
>>>>>>> 73bc23ebbd8fd679be2439303e2c43cdbb3924fa

      if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
        throw new InvalidTokenError(
            'Expected \';\' after assignment expression');
      }

      return assignment;
    }

    return leftExpression;
  }

<<<<<<< HEAD
  private parsePrimitiveExpression(): ASTExpression {
    const tokenType: LexerTokenType = this.peek().type;
=======
		switch (tokenType) {
			case LexerTokenType.Alpha:
				return <ASTAlpha>{
					type: ASTNodeType.Alpha,
					value: this.#tokens.shift()?.value,
				};
			case LexerTokenType.Number:
				return <ASTNumber>{
					type: ASTNodeType.Number,
					// TODO: Correct typing
					// @ts-ignore
					value: +this.#tokens.shift()?.value,
				};
			case LexerTokenType.Float:
				return <ASTFloat>{
					type: ASTNodeType.Float,
					// TODO: Correct typing
					// @ts-ignore
					value: +this.#tokens.shift()?.value,
				};

			case LexerTokenType.OpeningParenthesis: {
				this.#tokens.shift();
>>>>>>> 73bc23ebbd8fd679be2439303e2c43cdbb3924fa

    switch (tokenType) {
      case LexerTokenType.Alpha:
        return <ASTAlpha>{
          type: ASTNodeType.Alpha,
          value: this.#tokens.shift()?.value,
        };
      case LexerTokenType.Number:
        return <ASTNumber>{
          type: ASTNodeType.Number,
          // TODO: Correct typing
          // @ts-ignore
          value: +this.#tokens.shift()?.value,
        };
      case LexerTokenType.OpeningParenthesis: {
        this.#tokens.shift();

        const expression: ASTExpression = this.parseAdditiveExpression();
        const temporaryToken: LexerToken|undefined = this.#tokens.shift();

        if (!temporaryToken ||
            temporaryToken.type !== LexerTokenType.ClosingParenthesis) {
          throw new InvalidTokenError('Expected \')\' after expression');
        }

        return expression;
      }

      case LexerTokenType.OpeningSquareBracket: {
        this.#tokens.shift();
        const body: ASTExpression[] = [];
        while (this.peek().type !== LexerTokenType.ClosingSquareBracket) {
          body.push(this.parseExpression());

          if (this.peek().type === LexerTokenType.Comma) {
            this.#tokens.shift();
          } else if (this.peek().type !== LexerTokenType.ClosingSquareBracket) {
            throw new InvalidTokenError(
                'Expected \',\' or \']\' in array expression');
          }
        }
        if (this.#tokens.shift()?.type !==
            LexerTokenType.ClosingSquareBracket) {
          throw new InvalidTokenError('Expected \']\' after array elements');
        }
        return <ASTArray>{type: ASTNodeType.Array, body};
      }

      default:
        throw new InvalidTokenError(
            `Unexpected token '${this.peek().value}' in expression`);
    }
  }

  private parseAdditiveExpression(): ASTExpression {
    let leftExpression: ASTExpression = this.parseMultiplicativeExpression();

    while (additiveOperators.has(this.peek()?.value)) {
      const binaryOperator: string|undefined = this.#tokens.shift()?.value;

      if (!binaryOperator) {
        throw new InvalidTokenError('Expected binary operator');
      }

      const rightExpression: ASTExpression =
          this.parseMultiplicativeExpression();

      leftExpression = <ASTBinaryExpression>{
        type: ASTNodeType.BinaryExpression,
        binaryOperator,
        leftExpression,
        rightExpression,
      };
    }

    return leftExpression;
  }

  private parseMultiplicativeExpression(): ASTExpression {
    let leftExpression: ASTExpression = this.parsePrimitiveExpression();

    while (multiplicativeOperators.has(this.peek()?.value)) {
      const binaryOperator: string|undefined = this.#tokens.shift()?.value;
      if (!binaryOperator) {
        throw new InvalidTokenError('Expected binary operator');
      }

      const rightExpression: ASTExpression = this.parsePrimitiveExpression();

      leftExpression = <ASTBinaryExpression>{
        type: ASTNodeType.BinaryExpression,
        binaryOperator,
        leftExpression,
        rightExpression,
      };
    }

    return leftExpression;
  }

  private parseExpression(): ASTExpression {
    switch (this.peek().type) {
      case LexerTokenType.Let:
      case LexerTokenType.Const:
        return this.parseVariableDeclaration();
      default:
        return this.parseAssignmentExpression();
    }
  }

  public toAST(sourceCode: string): ASTProgram {
    this.#tokens = tokenize(sourceCode);

    const program: ASTProgram = {
      type: ASTNodeType.Program,
      body: [],
    };

    while (this.peek().type !== LexerTokenType.EOF) {
      program.body.push(this.parseExpression());
    }

    return program;
  }
}
