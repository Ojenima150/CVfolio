// File generated from our OpenAPI spec

declare module 'stripe' {
  namespace Stripe {
    namespace TestHelpers {
      namespace Treasury {
        interface OutboundTransferFailParams {
          /**
           * Specifies which fields in the response should be expanded.
           */
          expand?: Array<string>;
        }
      }

      namespace Treasury {
        interface OutboundTransferPostParams {
          /**
           * Specifies which fields in the response should be expanded.
           */
          expand?: Array<string>;
        }
      }

      namespace Treasury {
        interface OutboundTransferReturnOutboundTransferParams {
          /**
           * Specifies which fields in the response should be expanded.
           */
          expand?: Array<string>;

          /**
           * Details about a returned OutboundTransfer.
           */
          returned_details?: OutboundTransferReturnOutboundTransferParams.ReturnedDetails;
        }

        namespace OutboundTransferReturnOutboundTransferParams {
          interface ReturnedDetails {
            /**
             * Reason for the return.
             */
            code?: ReturnedDetails.Code;
          }

          namespace ReturnedDetails {
            type Code =
              | 'account_closed'
              | 'account_frozen'
              | 'bank_account_restricted'
              | 'bank_ownership_changed'
              | 'declined'
              | 'incorrect_account_holder_name'
              | 'invalid_account_number'
              | 'invalid_currency'
              | 'no_account'
              | 'other';
          }
        }
      }

      namespace Treasury {
        class OutboundTransfersResource {
          /**
           * Transitions a test mode created OutboundTransfer to the failed status. The OutboundTransfer must already be in the processing state.
           */
          fail(
            id: string,
            params?: OutboundTransferFailParams,
            options?: RequestOptions
          ): Promise<Stripe.Response<Stripe.Treasury.OutboundTransfer>>;
          fail(
            id: string,
            options?: RequestOptions
          ): Promise<Stripe.Response<Stripe.Treasury.OutboundTransfer>>;

          /**
           * Transitions a test mode created OutboundTransfer to the posted status. The OutboundTransfer must already be in the processing state.
           */
          post(
            id: string,
            params?: OutboundTransferPostParams,
            options?: RequestOptions
          ): Promise<Stripe.Response<Stripe.Treasury.OutboundTransfer>>;
          post(
            id: string,
            options?: RequestOptions
          ): Promise<Stripe.Response<Stripe.Treasury.OutboundTransfer>>;

          /**
           * Transitions a test mode created OutboundTransfer to the returned status. The OutboundTransfer must already be in the processing state.
           */
          returnOutboundTransfer(
            id: string,
            params?: OutboundTransferReturnOutboundTransferParams,
            options?: RequestOptions
          ): Promise<Stripe.Response<Stripe.Treasury.OutboundTransfer>>;
          returnOutboundTransfer(
            id: string,
            options?: RequestOptions
          ): Promise<Stripe.Response<Stripe.Treasury.OutboundTransfer>>;
        }
      }
    }
  }
}
tatus =
          | 'canceled'
          | 'failed'
          | 'posted'
          | 'processing'
          | 'returned';
      }

      interface OutboundTransferCancelParams {
        /**
         * Specifies which fields in the response should be expanded.
         */
        expand?: Array<string>;
      }

      class OutboundTransfersResource {
        /**
         * Creates an OutboundTransfer.
         */
        create(
          params: OutboundTransferCreateParams,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Treasury.OutboundTransfer>>;

        /**
         * Retrieves the details of an existing OutboundTransfer by passing the unique OutboundTransfer ID from either the OutboundTransfer creation request or OutboundTransfer list.
         */
        retrieve(
          id: string,
          params?: OutboundTransferRetrieveParams,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Treasury.OutboundTransfer>>;
        retrieve(
          id: string,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Treasury.OutboundTransfer>>;

        /**
         * Returns a list of OutboundTransfers sent from the specified FinancialAccount.
         */
        list(
          params: OutboundTransferListParams,
          options?: RequestOptions
        ): ApiListPromise<Stripe.Treasury.OutboundTransfer>;

        /**
         * An OutboundTransfer can be canceled if the funds have not yet been paid out.
         */
        cancel(
          id: string,
          params?: OutboundTransferCancelParams,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Treasury.OutboundTransfer>>;
        cancel(
          id: string,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Treasury.OutboundTransfer>>;
      }
    }
  }
}
