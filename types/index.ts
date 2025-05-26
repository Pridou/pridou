import {
	ASTNodeType,
	LexerTokenType,
	type ASTAlpha,
	type ASTAssignmentExpression,
	type ASTBinaryExpression,
	type ASTExpression,
	type ASTString,
	type ASTNumber,
	type ASTFloat,
	type ASTProgram,
	type ASTStatement,
	type ASTVariableDeclaration,
	type LexerToken,
	type ASTIfStatement,
	type ASTReturnStatement,
	type ASTArray,
} from "@/types";

import { tokenize } from "@/src/lexer";
import { InvalidTokenError } from "@/src/errs";

const additiveOperators: Set<string> = new Set<string>(["+", "-"]);
const multiplicativeOperators: Set<string> = new Set<string>(["%", "*", "/"]);
const comparatorOperators: Set<string> = new Set<string>([">", ">=", "<", "<="]);

export default class Parser {
	#tokens: LexerToken[] = [];

	private peek(offset: number = 0): LexerToken {
		return this.#tokens[offset];
	}

	private parseVariableDeclaration(): ASTStatement {
		const isConstant: boolean =
			this.#tokens.shift()?.type === LexerTokenType.Const;

		const alpha: string | undefined = this.#tokens.shift()?.value;

		if (!alpha) {
			throw new InvalidTokenError("Expected identifier after let/const");
		}

		if (this.peek().type === LexerTokenType.Semicolon) {
			this.#tokens.shift();

			if (isConstant) {
				throw new InvalidTokenError("Missing initializer in const declaration");
			}

			return {
				type: ASTNodeType.VariableDeclaration,
				alpha,
				metadata: {
					isConstant: false,
				},
			};
		}

		if (this.#tokens.shift()?.type !== LexerTokenType.Equals) {
			throw new InvalidTokenError("Expected '=' in variable declaration");
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
			throw new InvalidTokenError("Expected ';' after variable declaration");
		}

		return variableDeclaration;
	}

	private parseAssignmentExpression(): ASTExpression {
		const leftExpression: ASTExpression = this.parseAdditiveExpression();

		if (this.peek().type === LexerTokenType.Equals) {
			this.#tokens.shift();

			const assignment: ASTAssignmentExpression = {
				type: ASTNodeType.AssignmentExpression,
				value: this.parsePrimitiveExpression(),
				assignee: leftExpression,
			};

			if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
				throw new InvalidTokenError("Expected ';' after assignment expression");
			}

			return assignment;
		}

		return leftExpression;
	}

	private parsePrimitiveExpression(): ASTExpression {
		const tokenType: LexerTokenType = this.peek().type;

		switch (tokenType) {
			case LexerTokenType.Alpha:
				return {
					type: ASTNodeType.Alpha,
					value: this.#tokens.shift()?.value!,
				};
			case LexerTokenType.Number:
				return {
					type: ASTNodeType.Number,
					value: +this.#tokens.shift()?.value!,
				};
			case LexerTokenType.Float:
				return {
					type: ASTNodeType.Float,
					value: +this.#tokens.shift()?.value!,
				};
			case LexerTokenType.String:
				return {
					type: ASTNodeType.String,
					value: this.#tokens.shift()?.value!,
				};
			case LexerTokenType.OpeningParenthesis: {
				this.#tokens.shift();
				const expression = this.parseExpression();
				if (this.#tokens.shift()?.type !== LexerTokenType.ClosingParenthesis) {
					throw new InvalidTokenError("Expected ')' after expression");
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
					}
				}
				if (this.#tokens.shift()?.type !== LexerTokenType.ClosingSquareBracket) {
					throw new InvalidTokenError("Expected ']' after array");
				}
				return {
					type: ASTNodeType.Array,
					body,
				};
			}
			default:
				throw new InvalidTokenError(
					`Unexpected token '${this.peek().value}' in expression`,
				);
		}
	}

	private parseAdditiveExpression(): ASTExpression {
		let left = this.parseMultiplicativeExpression();

		while (additiveOperators.has(this.peek()?.value)) {
			const op = this.#tokens.shift()?.value!;
			const right = this.parseMultiplicativeExpression();

			left = {
				type: ASTNodeType.BinaryExpression,
				binaryOperator: op,
				leftExpression: left,
				rightExpression: right,
			};
		}

		return left;
	}

	private parseMultiplicativeExpression(): ASTExpression {
		let left = this.parsePrimitiveExpression();

		while (multiplicativeOperators.has(this.peek()?.value)) {
			const op = this.#tokens.shift()?.value!;
			const right = this.parsePrimitiveExpression();

			left = {
				type: ASTNodeType.BinaryExpression,
				binaryOperator: op,
				leftExpression: left,
				rightExpression: right,
			};
		}

		return left;
	}

	private parseIfStatement(): ASTIfStatement {
		this.#tokens.shift(); // consume 'if'

		if (this.#tokens.shift()?.type !== LexerTokenType.OpeningParenthesis) {
			throw new InvalidTokenError("Expected '(' after 'if'");
		}

		const condition = this.parseExpression();

		if (this.#tokens.shift()?.type !== LexerTokenType.ClosingParenthesis) {
			throw new InvalidTokenError("Expected ')' after condition");
		}

		const trueCase = this.parseBlock();

		if (this.peek()?.type !== LexerTokenType.Else) {
			throw new InvalidTokenError("Expected 'else' after if block");
		}
		this.#tokens.shift(); // consume 'else'

		const falseCase = this.parseBlock();

		return {
			type: ASTNodeType.If,
			condition,
			trueCase,
			falseCase,
		};
	}

	private parseBlock(): ASTStatement[] {
		if (this.#tokens.shift()?.type !== LexerTokenType.OpeningCurlyBracket) {
			throw new InvalidTokenError("Expected '{'");
		}

		const body: ASTStatement[] = [];

		while (this.peek().type !== LexerTokenType.ClosingCurlyBracket) {
			body.push(this.parseExpression());
		}

		if (this.#tokens.shift()?.type !== LexerTokenType.ClosingCurlyBracket) {
			throw new InvalidTokenError("Expected '}'");
		}

		return body;
	}

	private parseReturnStatement(): ASTReturnStatement {
		this.#tokens.shift(); // consume 'return'
		const value = this.parseExpression();

		if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
			throw new InvalidTokenError("Expected ';' after return");
		}

		return {
			type: ASTNodeType.Return,
			value,
		};
	}

	private parseExpression(): ASTStatement {
		switch (this.peek().type) {
			case LexerTokenType.Let:
			case LexerTokenType.Const:
				return this.parseVariableDeclaration();
			case LexerTokenType.If:
				return this.parseIfStatement();
			case LexerTokenType.Return:
				return this.parseReturnStatement();
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
