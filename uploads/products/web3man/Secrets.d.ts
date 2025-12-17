// File generated from our OpenAPI spec

declare module 'stripe' {
  namespace Stripe {
    namespace Apps {
      /**
       * Secret Store is an API that allows Stripe Apps developers to securely persist secrets for use by UI Extensions and app backends.
       *
       * The primary resource in Secret Store is a `secret`. Other apps can't view secrets created by an app. Additionally, secrets are scoped to provide further permission control.
       *
       * All Dashboard users and the app backend share `account` scoped secrets. Use the `account` scope for secrets that don't change per-user, like a 