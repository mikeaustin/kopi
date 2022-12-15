import { KopiValue, KopiTrait, Context } from '../shared.js';
import * as astNodes from './astNodes.js';
declare global {
    interface FunctionConstructor {
        traits: KopiTrait[];
    }
}
declare function Assignment({ pattern, expression }: astNodes.Assignment, context: Context): Promise<KopiValue>;
declare function BlockExpression({ statements }: astNodes.BlockExpression, context: Context): Promise<KopiValue>;
declare function PipeExpression({ expression, methodName, argumentExpression }: astNodes.PipeExpression, context: Context): Promise<KopiValue>;
declare function OperatorExpression({ operator, leftExpression, rightExpression }: astNodes.OperatorExpression, context: Context): Promise<KopiValue>;
declare function MemberExpression({ expression, member }: astNodes.MemberExpression, context: Context): Promise<KopiValue>;
declare function UnaryExpression({ operator, argumentExpression }: astNodes.UnaryExpression, context: Context): Promise<KopiValue>;
declare function TupleExpression({ expressionFields, expressionFieldNames }: astNodes.TupleExpression, context: Context): Promise<KopiValue>;
declare function FunctionExpression({ parameterPattern, bodyExpression, name }: astNodes.FunctionExpression, context: Context): Promise<KopiValue>;
declare function ApplyExpression({ expression, argumentExpression }: astNodes.ApplyExpression, context: Context): Promise<KopiValue>;
export { Assignment, PipeExpression, BlockExpression, OperatorExpression, MemberExpression, UnaryExpression, TupleExpression, FunctionExpression, ApplyExpression, };
