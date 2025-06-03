export enum ASTNodeType {
	Program = "Program",

	Number = "Number",
	String = "String",
	// TODO: Support booleans

	Identifier = "Identifier",

	FunctionCallExpression = "FunctionCallExpression",
	ReturnExpression     = "ReturnExpression",
	VariableDeclarationStatement  = "VariableDeclarationStatement",
	FunctionDeclarationStatement  = "FunctionDeclarationStatement",
	AssignmentExpression = "AssignmentExpression",
}

export interface ASTNode {
	type: ASTNodeType;
}

export interface ASTProgram extends ASTNode {
	type: ASTNodeType.Program;
	body: Set<ASTNode>;
}

export interface ASTNumber extends ASTNode {
	type: ASTNodeType.Number;
	value: number;
}

export interface ASTString extends ASTNode {
	type: ASTNodeType.String;
	value: string;
}

export interface ASTIdentifier extends ASTNode {
	type: ASTNodeType.Identifier;
	value: string;
}

export interface ASTFunctionCallExpression extends ASTNode {
	type: ASTNodeType.FunctionCallExpression;
	identifier: string;
	arguments: ASTAssignmentExpression[];
}

export interface ASTReturnStatement extends ASTNode {
	type: ASTNodeType.ReturnExpression;
	value: ASTNode;
}

export interface ASTVariableDeclarationStatement extends ASTNode {
	type: ASTNodeType.VariableDeclarationStatement;
	value?: ASTNode;
	identifier: string;
	metadata: {
		isConstant: boolean;
	}
}

export interface ASTFunctionDeclarationStatement extends ASTNode {
	type: ASTNodeType.FunctionDeclarationStatement;
	body?: ASTNode[];
	identifier: string;
	parameters: string[];
}

export interface ASTAssignmentExpression extends ASTNode {
	type: ASTNodeType.AssignmentExpression;
	// FIXME: Add more precise typing
	value?: ASTNode;
	leftExpression: ASTNode;
}
