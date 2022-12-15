import { KopiValue, ASTNode, ASTPatternNode, Environment, Context } from "../../shared";
import { KopiApplicative } from "../../shared";

class KopiFunction extends KopiValue {
  static override readonly traits = [KopiApplicative];

  readonly parameterPattern: ASTPatternNode;
  readonly bodyExpression: ASTNode;
  readonly environment: Environment;
  readonly name?: string;

  constructor(
    parameterPattern: ASTPatternNode,
    bodyExpression: ASTNode,
    environment: Environment,
    name?: string
  ) {
    super();

    this.parameterPattern = parameterPattern;
    this.bodyExpression = bodyExpression;
    this.environment = environment;
    this.name = name;
  }

  async apply(
    thisArg: KopiValue,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    const { evaluateAst, bindValues } = context;

    const matches = await this.parameterPattern.match(argument, context);

    const newEnvironment = {
      ...this.environment,
      ...matches,
      ...(this.name ? { [this.name]: this } : {}),
      'this': thisArg
    };

    Object.setPrototypeOf(newEnvironment, Object.getPrototypeOf(this.environment));

    return evaluateAst(this.bodyExpression, newEnvironment, bindValues);
  }
}

export default KopiFunction;
