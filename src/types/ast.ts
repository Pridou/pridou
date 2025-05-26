export enum ASTNodeType {
  Program = "Program",

  VariableDeclaration = "VariableDeclaration",

  Alpha = "Alpha",
  Number = "Number",

  BinaryExpression = "BinaryExpression",
  AssignmentExpression = "AssignmentExpression",
}

export interface ASTStatement {
  type: ASTNodeType;
}

export interface ASTExpression extends ASTStatement {}

export interface ASTProgram extends ASTStatement {
  type: ASTNodeType.Program;
  body: ASTStatement[];
}

export interface ASTVariableDeclaration extends ASTStatement {
  type: ASTNodeType.VariableDeclaration;
  alpha: string;
  value?: ASTExpression;
  metadata: {
    isConstant: boolean;
  };
}

export interface ASTAlpha extends ASTStatement {
  type: ASTNodeType.Alpha;
  value: string;
}

export interface ASTNumber extends ASTStatement {
  type: ASTNodeType.Number;
  value: number;
}

export interface ASTBinaryExpression extends ASTStatement {
  type: ASTNodeType.BinaryExpression;
  binaryOperator: string;
  leftExpression: ASTExpression;
  rightExpression: ASTExpression;
}

export interface ASTAssignmentExpression extends ASTStatement {
  type: ASTNodeType.AssignmentExpression;
  value: ASTExpression;
  assignee: ASTExpression;
}
