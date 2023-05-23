// Please read explanation in SqlError.ts if you are not familiar with
// this trick to create a nominal type in typescript.

const httpConnectionErrorTag = Symbol();

export type HttpConnectionError = {
  _tag: typeof httpConnectionErrorTag;
  status: number;
  reason: string;
};

export const httpConnectionError = (
  status: number,
  reason: string
): HttpConnectionError => ({
  _tag: httpConnectionErrorTag,
  status,
  reason
});

export const isHttpConnectionError = (error: {
  _tag: Symbol;
}): error is HttpConnectionError => error._tag === httpConnectionErrorTag;
