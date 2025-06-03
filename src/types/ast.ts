import type Environment from "@/environment";

export enum ASTNodeType {
  Program = "Program",

  Number = "Number",
  Identifier = "Identifier",

  String = "String",

  BinaryExpression = "BinaryExpression",

  ReturnStatement = "ReturnStatement",

  FunctionCall = "FunctionCall",
  FunctionDeclaration = "FunctionDeclaration",
  VariableDeclaration = "VariableDeclaration",
  AssignmentExpression = "AssignmentExpression",
}

export interface ASTNode {
  type: ASTNodeType;
}

export interface ASTProgram extends ASTNode {
  type: ASTNodeType.Program;
  body: ASTNode[];
}

export interface ASTNumber extends ASTNode {
  type: ASTNodeType.Number;
  value: number;
}

export interface ASTIdentifier extends ASTNode {
  type: ASTNodeType.Identifier;
  value: string;
}

export interface ASTString extends ASTNode {
  type: ASTNodeType.String;
  value: string;
}

export interface ASTBinaryExpression extends ASTNode {
  type: ASTNodeType.BinaryExpression;
  binaryOperator: string;
  leftExpression: ASTNode;
  rightExpression: ASTNode;
}

export interface ASTReturnStatement extends ASTNode {
  type: ASTNodeType.ReturnStatement;
  value: ASTNode;
}

export interface ASTFunctionCall extends ASTNode {
  type: ASTNodeType.FunctionCall;
  identifier: string;
  arguments: ASTNode[];
}

export interface ASTFunctionDeclaration extends ASTNode {
  type: ASTNodeType.FunctionDeclaration;
  body: ASTNode[];
  identifier: string;
  parameters: string[];
  environment: Environment;
}

export interface ASTVariableDeclaration extends ASTNode {
  type: ASTNodeType.VariableDeclaration;
  identifier: string;
  value?: ASTNode;
  metadata: {
    isConstant: boolean;
  };
}

export interface ASTAssignmentExpression extends ASTNode {
  type: ASTNodeType.AssignmentExpression;
  value: ASTNode;
  assignee: ASTIdentifier;
}
