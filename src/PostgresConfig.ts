// Please read explanation in SqlError.ts if you are not familiar with
// this trick to create a nominal type in typescript.

const postgresConfigTag = Symbol();

export type PostgresConfig = {
  _tag: typeof postgresConfigTag;
  url: URL;
};

export const postgresConfig = (url: URL): PostgresConfig => ({
  _tag: postgresConfigTag,
  url
});

export const isPostgresConfig = (config: {
  _tag: Symbol;
}): config is PostgresConfig => config._tag === postgresConfigTag;
