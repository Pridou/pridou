import Environment from '@/src/environment';
import {InvalidNodeError, InvalidTokenError} from '@/src/errs';
import {type ASTAlpha, type ASTArray, type ASTAssignmentExpression, type ASTBinaryExpression, type ASTExpression, type ASTIndex, ASTNodeType, type ASTNumber, type ASTObject, type ASTObjectAttribute, type ASTProgram, type ASTStatement, type ASTString, type ASTVariableDeclaration, type InterpreterArray, type InterpreterNull, type InterpreterNumber, type InterpreterObject, type InterpreterString, type InterpreterValue, InterpreterValueType,type ASTIfStatement,type InterpreterBoolean} from '@/types';

function getArrayIndex(
    array: InterpreterArray, indexNode: ASTExpression,
    environment: Environment): number {
  const index = evaluate(indexNode, environment);
  if (index.type !== InterpreterValueType.Number) {
    throw new InvalidTokenError('Array index must be a number');
  }

  const arrayLength = array.elements.length;
  let actualIndex = (<InterpreterNumber>index).value;

  if (actualIndex < 0) {
    actualIndex = arrayLength + actualIndex;
  }

  if (actualIndex < 0 || actualIndex >= arrayLength) {
    throw new InvalidTokenError('Array index out of bounds');
  }

  return actualIndex;
}

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

      if (assignee.type === ASTNodeType.Index) {
        const array = evaluate((<ASTIndex>assignee).array, environment);
        if (array.type !== InterpreterValueType.Array) {
          throw new InvalidTokenError(
              'Cannot assign to index of non-array value');
        }

        const value =
            evaluate((<ASTAssignmentExpression>node).value, environment);
        const actualIndex = getArrayIndex(
            <InterpreterArray>array, (<ASTIndex>assignee).index, environment);

        (<InterpreterArray>array).elements[actualIndex] = value;
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

    case ASTNodeType.Index: {
      const array = evaluate((<ASTIndex>node).array, environment);
      if (array.type !== InterpreterValueType.Array) {
        throw new InvalidTokenError(
            'Cannot use index operator on non-array value');
      }

      const actualIndex = getArrayIndex(
          <InterpreterArray>array, (<ASTIndex>node).index, environment);
      return (<InterpreterArray>array).elements[actualIndex];
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

    case ASTNodeType.Index: {
      const array = evaluate((<ASTIndex>node).array, environment);
      if (array.type !== InterpreterValueType.Array) {
        throw new InvalidTokenError(
            'Cannot use index operator on non-array value');
      }

      const actualIndex = getArrayIndex(
          <InterpreterArray>array, (<ASTIndex>node).index, environment);
      return (<InterpreterArray>array).elements[actualIndex];
    }

    case ASTNodeType.If: {
      const { condition, trueCase, falseCase } = node as ASTIfStatement;

      const conditionValue = evaluate(condition, environment);
      if (conditionValue.type !== InterpreterValueType.Boolean) {
        throw new Error("Condition in 'if' must evaluate to a boolean");
      }

      const scopedEnv = new Environment(environment);

     if ((conditionValue as InterpreterBoolean).value === 1){
        return evaluate(trueCase, scopedEnv);
      } else if (falseCase) {
        return evaluate(falseCase, scopedEnv);
      } else {
       return {
          type: InterpreterValueType.Null,
          value: null,
        } as InterpreterNull;

      }
}


    default:
      throw new InvalidNodeError(`Unexpected AST node type: '${node.type}'`);
  }
}
