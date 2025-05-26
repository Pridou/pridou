import Environment from '@/src/environment';
import {InvalidNodeError, InvalidTokenError} from '@/src/errs';
import {type ASTAlpha, type ASTArray, type ASTAssignmentExpression, type ASTBinaryExpression, ASTNodeType, type ASTNumber, type ASTObject, type ASTObjectAttribute, type ASTProgram, type ASTStatement, type ASTString, type ASTVariableDeclaration, type InterpreterArray, type InterpreterNull, type InterpreterNumber, type InterpreterObject, type InterpreterString, type InterpreterValue, InterpreterValueType,} from '@/types';

export function evaluate(
    node: ASTStatement,
    environment: Environment,
    ): InterpreterValue {
  switch (node.type) {
    case ASTNodeType.Program: {
      let lastEvaluatedValue: InterpreterValue = {
        type: InterpreterValueType.Null,
        value: null,
      } as InterpreterNull;

      for (const statement of (<ASTProgram>node).body) {
        lastEvaluatedValue = evaluate(statement, environment);
      }

      return lastEvaluatedValue;
    }
    case ASTNodeType.VariableDeclaration:
      return environment.addVariable(
          (<ASTVariableDeclaration>node).alpha,
          // FIXME:
          evaluate((<ASTVariableDeclaration>node).value!, environment) ??
              <InterpreterNull>{
                type: InterpreterValueType.Null,
                value: null,
              },
          (<ASTVariableDeclaration>node).metadata.isConstant,
      );
    case ASTNodeType.Alpha:
      return environment.getVariable((<ASTAlpha>node).value);
    case ASTNodeType.Number:
      return <InterpreterNumber>{
        type: InterpreterValueType.Number,
        value: (<ASTNumber>node).value,
      };
    case ASTNodeType.Float:
      return <InterpreterNumber>{
        type: InterpreterValueType.Number,
        value: (<ASTNumber>node).value,
      };

    case ASTNodeType.BinaryExpression: {
      const leftHandSide =
          evaluate((<ASTBinaryExpression>node).leftExpression, environment);
      const rightHandSide =
          evaluate((<ASTBinaryExpression>node).rightExpression, environment);
      const operator = (<ASTBinaryExpression>node).binaryOperator;

      if (operator === '+' &&
          leftHandSide.type === InterpreterValueType.String &&
          rightHandSide.type === InterpreterValueType.String) {
        return <InterpreterString>{
          type: InterpreterValueType.String,
          value: (<InterpreterString>leftHandSide)
                     .value.concat((<InterpreterString>rightHandSide).value)
        };
      }

      if (operator === '*' &&
          ((leftHandSide.type === InterpreterValueType.String &&
            rightHandSide.type === InterpreterValueType.Number) ||
           (leftHandSide.type === InterpreterValueType.Number &&
            rightHandSide.type === InterpreterValueType.String))) {
        const str = leftHandSide.type === InterpreterValueType.String ?
            (<InterpreterString>leftHandSide).value :
            (<InterpreterString>rightHandSide).value;

        const count = leftHandSide.type === InterpreterValueType.Number ?
            (<InterpreterNumber>leftHandSide).value :
            (<InterpreterNumber>rightHandSide).value;

        if (count < 0) {
          throw new InvalidTokenError(
              'Cannot multiply a string by a negative number');
        }

        return <InterpreterString>{
          type: InterpreterValueType.String,
          value: str.repeat(count)
        };
      }

      if (leftHandSide.type === InterpreterValueType.Number &&
          rightHandSide.type === InterpreterValueType.Number) {
        const leftValue = (<InterpreterNumber>leftHandSide).value;
        const rightValue = (<InterpreterNumber>rightHandSide).value;
        let value = 0;

        switch ((<ASTBinaryExpression>node).binaryOperator) {
          case '%':
            value = leftValue % rightValue;
            break;
          case '*':
            value = leftValue * rightValue;
            break;
          case '+':
            value = leftValue + rightValue;
            break;
          case '-':
            value = leftValue - rightValue;
            break;
          case '/':
            value = leftValue / rightValue;
            break;
        }

        return <InterpreterNumber>{
          type: InterpreterValueType.Number,
          value,
        };
      }

      return <InterpreterNull>{type: InterpreterValueType.Null, value: null};
    }
    case ASTNodeType.AssignmentExpression: {
      const assignee = (<ASTAssignmentExpression>node).assignee;

      if (assignee.type === ASTNodeType.ObjectAttribute) {
        const object =
            evaluate((<ASTObjectAttribute>assignee).object, environment);
        if (object.type !== InterpreterValueType.Object) {
          throw new InvalidTokenError(
              'Cannot assign to property of non-object value');
        }

        const propertyName =
            (<ASTAlpha>(<ASTObjectAttribute>assignee).property).value;
        const value =
            evaluate((<ASTAssignmentExpression>node).value, environment);

        (<InterpreterObject>object).properties[propertyName] = value;
        (<InterpreterObject>object)
            .environment.setVariable(propertyName, value);

        return value;
      }

      if (assignee.type === ASTNodeType.Alpha) {
        return environment.setVariable(
            (<ASTAlpha>assignee).value,
            evaluate((<ASTAssignmentExpression>node).value, environment));
      }

      throw new InvalidTokenError('Invalid assignment target');
    }

    case ASTNodeType.String:
      return <InterpreterString>{
        type: InterpreterValueType.String,
        value: (<ASTString>node).value,
      };

    case ASTNodeType.Array: {
      const elements: InterpreterValue[] = [];
      for (const expression of (<ASTArray>node).body) {
        elements.push(evaluate(expression, environment));
      }

      return <InterpreterArray>{type: InterpreterValueType.Array, elements};
    }

    case ASTNodeType.Object: {
      const properties: {[key: string]: InterpreterValue} = {};
      const objectEnv = new Environment(environment);

      for (const [key, expr] of Object.entries((<ASTObject>node).properties)) {
        const value = evaluate(expr, environment);
        properties[key] = value;
        objectEnv.addVariable(key, value, false);
      }

      return <InterpreterObject>{
        type: InterpreterValueType.Object,
        properties,
        environment: objectEnv
      };
    }

    case ASTNodeType.ObjectAttribute: {
      const object = evaluate((<ASTObjectAttribute>node).object, environment);
      if (object.type !== InterpreterValueType.Object) {
        throw new InvalidTokenError(
            'Cannot access property of non-object value');
      }

      const propertyName =
          (<ASTAlpha>(<ASTObjectAttribute>node).property).value;
      const property = (<InterpreterObject>object).properties[propertyName];

      if (!property) {
        throw new InvalidTokenError(
            `Property '${propertyName}' does not exist`);
      }

      return property;
    }

    default:
      throw new InvalidNodeError(`Unexpected AST node type: '${node.type}'`);
  }
}
