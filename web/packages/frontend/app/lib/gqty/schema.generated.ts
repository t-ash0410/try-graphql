/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

import { type ScalarsEnumsHash } from "gqty";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Any: { input: any; output: any };
  Date: { input: any; output: any };
  File: { input: any; output: any };
  JSON: { input: any; output: any };
  Number: { input: any; output: any };
  Object: { input: any; output: any };
  Void: { input: any; output: any };
}

export const scalarsEnumsHash: ScalarsEnumsHash = {
  Any: true,
  Boolean: true,
  Date: true,
  File: true,
  Float: true,
  ID: true,
  Int: true,
  JSON: true,
  Number: true,
  Object: true,
  String: true,
  Void: true,
};
export const generatedSchema = {
  Tickets: {
    __typename: { __type: "String!" },
    authorId: { __type: "Number!" },
    createdAt: { __type: "Date!" },
    deadline: { __type: "Date" },
    description: { __type: "String" },
    ticketId: { __type: "Number!" },
    title: { __type: "String!" },
    updatedAt: { __type: "Date!" },
  },
  mutation: {
    __typename: { __type: "String!" },
    createTicket: {
      __type: "Tickets!",
      __args: { deadline: "Date", description: "String", title: "String!" },
    },
  },
  query: {
    __typename: { __type: "String!" },
    tickets: { __type: "[Tickets!]!", __args: { ticketId: "Number" } },
  },
  subscription: {},
} as const;

export interface Tickets {
  __typename?: "Tickets";
  authorId: ScalarsEnums["Number"];
  /**
   * Enables basic storage and retrieval of dates and times.
   */
  createdAt: ScalarsEnums["Date"];
  deadline?: Maybe<ScalarsEnums["Date"]>;
  description?: Maybe<ScalarsEnums["String"]>;
  ticketId: ScalarsEnums["Number"];
  title: ScalarsEnums["String"];
  /**
   * Enables basic storage and retrieval of dates and times.
   */
  updatedAt: ScalarsEnums["Date"];
}

export interface Mutation {
  __typename?: "Mutation";
  createTicket: (args: {
    deadline?: Maybe<ScalarsEnums["Date"]>;
    description?: Maybe<ScalarsEnums["String"]>;
    title: ScalarsEnums["String"];
  }) => Tickets;
}

export interface Query {
  __typename?: "Query";
  tickets: (args?: {
    ticketId?: Maybe<ScalarsEnums["Number"]>;
  }) => Array<Tickets>;
}

export interface Subscription {
  __typename?: "Subscription";
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}

export type ScalarsEnums = {
  [Key in keyof Scalars]: Scalars[Key] extends { output: unknown }
    ? Scalars[Key]["output"]
    : never;
} & {};
