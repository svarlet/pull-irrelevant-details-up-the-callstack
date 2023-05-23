import {pipe} from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import {TaskEither} from 'fp-ts/TaskEither';

import {httpConnectionError, HttpConnectionError} from './HttpConnectionError';
import {sqlError, SqlError} from './SqlError';
import {FsError} from './FsError';
import {postgresConfig, PostgresConfig} from './PostgresConfig';

export const readDbConfigFromFs = (): TaskEither<FsError, PostgresConfig> =>
  TE.right(postgresConfig(new URL('https://rds.aws.com/abc123')));

export const fetchFullDenominationFromPostgres = (dbConfig: PostgresConfig): (userId: string) => TaskEither<HttpConnectionError | SqlError, string> =>
  (userId: string) => 
    TE.left(httpConnectionError(400, "Irrelevant, I'm just forcing an error"));

export const fetchTimeOfDayForUserFromPostgres = (dbConfig: PostgresConfig): (userId: string) => TaskEither<HttpConnectionError | SqlError, 'morning' | 'afternoon' | 'evening' | 'night'> =>
  (userId: string) =>
    TE.left(sqlError(3029, "Irrelevant, I'm just forcing an error"));

export const greetByTimeOfDay = (
  userId: string,
  fetchFullDenomination: (userId: string) => TaskEither<HttpConnectionError | SqlError, string>,
  fetchTimeOfDay: (userId: string) => TaskEither<HttpConnectionError | SqlError, 'morning' | 'afternoon' | 'evening' | 'night'>,
): TaskEither<HttpConnectionError | FsError | SqlError, string> =>
  pipe(
    TE.Do,
    TE.bindW('fullDenomination', () =>
      fetchFullDenomination(userId)
    ),
    TE.bindW('timeOfDayForUser', () =>
      fetchTimeOfDay(userId)
    ),
    TE.map(
      ({fullDenomination, timeOfDayForUser}) =>
        `Good ${timeOfDayForUser}, ${fullDenomination}`
    )
  );

pipe(
  TE.Do,
  TE.bind('userId', () => TE.of('af8c4600-46a8-4b80-a4d3-9583b4f1085b')),
  TE.bind('dbConfig', () => readDbConfigFromFs()),
  TE.bindW('greeting', ({userId, dbConfig}) => greetByTimeOfDay(userId, fetchFullDenominationFromPostgres(dbConfig), fetchTimeOfDayForUserFromPostgres(dbConfig))),
  TE.match(
    (error) =>
      console.error('Oops something went wrong: ' + JSON.stringify(error)),
    ({greeting}) => console.log(greeting)
  )
)();
