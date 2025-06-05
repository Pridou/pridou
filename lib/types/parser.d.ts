export declare enum ASTNodeType {
    Program = "Program",
    Number = "Number",
    String = "String",
    Identifier = "Identifier",
    FunctionCallExpression = "FunctionCallExpression",
    VariableDeclarationStatement = "VariableDeclarationStatement",
    FunctionDeclarationStatement = "FunctionDeclarationStatement",
    ReturnStatement = "ReturnStatement",
    BinaryExpression = "BinaryExpression",
    ComparisonExpression = "ComparisonExpression",
    WhileStatement = "WhileStatement",
    AssignmentExpression = "AssignmentExpression"
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
    arguments: (ASTAssignmentExpression | ASTNode)[];
}
export interface ASTVariableDeclarationStatement extends ASTNode {
    type: ASTNodeType.VariableDeclarationStatement;
    value?: ASTNode;
    identifier: string;
    metadata: {
        isConstant: boolean;
    };
}
export interface ASTFunctionDeclarationStatement extends ASTNode {
    type: ASTNodeType.FunctionDeclarationStatement;
    body?: ASTNode[];
    identifier: string;
    parameters: string[];
}
export interface ASTReturnStatement extends ASTNode {
    type: ASTNodeType.ReturnStatement;
    value: ASTNode;
}
export interface ASTBinaryExpression extends ASTNode {
    type: ASTNodeType.BinaryExpression;
    binaryOperator: string;
    leftExpression: ASTNode;
    rightExpression: ASTNode;
}
export interface ASTComparisonExpression extends ASTNode {
    type: ASTNodeType.ComparisonExpression;
    comparisonOperator: string;
    leftExpression: ASTNode;
    rightExpression: ASTNode;
}
export interface ASTWhileStatement extends ASTNode {
    type: ASTNodeType.WhileStatement;
    body: ASTNode[];
    comparison: ASTComparisonExpression | ASTNode;
}
export interface ASTAssignmentExpression extends ASTNode {
    type: ASTNodeType.AssignmentExpression;
    value?: ASTNode;
    leftExpression: ASTNode;
}
