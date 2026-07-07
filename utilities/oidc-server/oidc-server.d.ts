/* eslint-disable @typescript-eslint/no-explicit-any */
// oidc-provider ships no type declarations and there is no @types package;
// lodash is imported via a submodule path without @types/lodash installed.
// These ambient declarations satisfy the compiler for this dev-only OIDC server.
declare module 'oidc-provider' {
  export interface Account {
    [key: string]: any;
  }
  export interface AccountClaims {
    [key: string]: any;
  }
  export type Configuration = Record<string, any>;
  export const errors: any;
  export default class Provider {
    constructor(issuer: string, configuration?: Configuration);
    [key: string]: any;
  }
}

declare module 'lodash/isEmpty.js' {
  const isEmpty: (value?: unknown) => boolean;
  export default isEmpty;
}
