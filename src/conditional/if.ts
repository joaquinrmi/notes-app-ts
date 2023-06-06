type If<T, Condition> = Condition extends "true" ? T : never;

export default If;