// Here we use a trick to make nominal types in typescript.

// As a Symbol is unique in js, and because we don't export it, the
// only way to get a SqlError value is to use the constructor in this module.

// In turn, we can build an Either<NotAnSqlError, SqlError> parser.

// And we can also build a "type guard", which helps when we map the union of
// error types downstream to an HttpResponse, a Loggable message, etc.

const sqlErrorTag = Symbol();

export type SqlError = {
  _tag: typeof sqlErrorTag;
  errorCode: number;
  reason: string;
};

export const sqlError = (errorCode: number, reason: string): SqlError => ({
  _tag: sqlErrorTag,
  errorCode,
  reason
});

// The following is the "Type Guard"
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards

export const isSqlError = (error: {_tag: Symbol}): error is SqlError =>
  error._tag === sqlErrorTag;
