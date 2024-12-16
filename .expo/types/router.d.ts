/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/chat`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/HomePage` | `/HomePage`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Message` | `/Message`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Profile` | `/Profile`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/sample` | `/sample`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Test` | `/Test`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/chat`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/HomePage` | `/HomePage`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/Message` | `/Message`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/Profile` | `/Profile`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/sample` | `/sample`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/Test` | `/Test`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/chat${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/HomePage${`?${string}` | `#${string}` | ''}` | `/HomePage${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/Message${`?${string}` | `#${string}` | ''}` | `/Message${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/Profile${`?${string}` | `#${string}` | ''}` | `/Profile${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/sample${`?${string}` | `#${string}` | ''}` | `/sample${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/Test${`?${string}` | `#${string}` | ''}` | `/Test${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/chat`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/HomePage` | `/HomePage`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Message` | `/Message`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Profile` | `/Profile`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/sample` | `/sample`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Test` | `/Test`; params?: Router.UnknownInputParams; };
    }
  }
}
