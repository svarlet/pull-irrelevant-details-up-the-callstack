const fsErrorTag = Symbol();

export type FsError = {
  _tag: typeof fsErrorTag;
  reason: string;
};

export const fsError = (reason: string): FsError => ({
  _tag: fsErrorTag,
  reason
});

export const isErrorTag = (error: {_tag: Symbol}): error is FsError =>
  error._tag === fsErrorTag;
