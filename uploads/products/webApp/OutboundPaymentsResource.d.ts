// File generated from our OpenAPI spec

declare module 'stripe' {
  namespace Stripe {
    namespace TestHelpers {
      namespace Treasury {
        interface OutboundPaymentFailParams {
          /**
           * Specifies which fields in the response should be expanded.
           */
          expand?: Array<string>;
        }
      }

      namespace Treasury {
        interface OutboundPaymentPostParams {
          /**
           * Specifies which fields in the response should be expanded.
           */
          expand?: Array<string>;
        }
      }

      namespace Treasury {
        interface OutboundPaymentReturnOutboundPaymentParams {
          /**
           * Specifies which fields in the response should be expanded.
           */
          expand?: Array<string>;

          /**
           * Optional hash to set the the return code.
           */
          returned_details?: OutboundPaymentReturnOutboundPaymentParams.ReturnedDetails;
        }

        namespace OutboundPaymentReturnOutboundPaymentParams {
          interface ReturnedDetails {
            /**
             * The return code to be set on the OutboundPayment object.
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
        class OutboundPaymentsResource {
          /**
           * Transitions a test mode created OutboundPayment to the failed status. The OutboundPayment must already be in the processing state.
           */
          fail(
            id: string,
            params?: OutboundPaymentFailParams,
            options?: RequestOptions
          ): Promise<Stripe.Response<Stripe.Treasury.OutboundPayment>>;
          fail(
            id: string,
            options?: RequestOptions
          ): Promise<Stripe.Response<Stripe.Treasury.OutboundPayment>>;

          /**
           * Transitions a test mode created OutboundPayment to the posted status. The OutboundPayment must already be in the processing state.
           */
          post(
            id: string,
            params?: OutboundPaymentPostParams,
            options?: RequestOptions
          ): Promise<Stripe.Response<Stripe.Treasury.OutboundPayment>>;
          post(
            id: string,
            options?: RequestOptions
          ): Promise<Stripe.Response<Stripe.Treasury.OutboundPayment>>;

          /**
           * Transitions a test mode created OutboundPayment to the returned status. The OutboundPayment must already be in the processing state.
           */
          returnOutboundPayment(
            id: string,
            params?: OutboundPaymentReturnOutboundPaymentParams,
            options?: RequestOptions
          ): Promise<Stripe.Response<Stripe.Treasury.OutboundPayment>>;
          returnOutboundPayment(
            id: string,
            options?: RequestOptions
          ): Promise<Stripe.Response<Stripe.Treasury.OutboundPayment>>;
        }
      }
    }
  }
}
by posting an empty value to them. All keys can be unset by posting an empty value to `metadata`.
           */
          metadata?: Stripe.MetadataParam;

          /**
           * The type of the PaymentMethod. An additional hash is included on the PaymentMethod with a name matching this value. It contains additional information specific to the PaymentMethod type.
           */
          type: DestinationPaymentMethodData.Type;

          /**
           * Required hash if type is set to `us_bank_account`.
           */
          us_bank_account?: DestinationPaymentMethodData.UsBankAccount;
        }

        namespace DestinationPaymentMethodData {
          interface BillingDetails {
            /**
             * Billing address.
             */
            address?: Stripe.Emptyable<Stripe.AddressParam>;

            /**
             * Email address.
             */
            email?: Stripe.Emptyable<string>;

            /**
             * Full name.
             */
            name?: Stripe.Emptyable<string>;

            /**
             * Billing phone number (including extension).
             */
            phone?: Stripe.Emptyable<string>;
          }

          type Type = 'financial_account' | 'us_bank_account';

          interface UsBankAccount {
            /**
             * Account holder type: individual or company.
             */
            account_holder_type?: UsBankAccount.AccountHolderType;

            /**
             * Account number of the bank account.
             */
            account_number?: string;

            /**
             * Account type: checkings or savings. Defaults to checking if omitted.
             */
            account_type?: UsBankAccount.AccountType;

            /**
             * The ID of a Financial Connections Account to use as a payment method.
             */
            financial_connections_account?: string;

            /**
             * Routing number of the bank account.
             */
            routing_number?: string;
          }

          namespace UsBankAccount {
            type AccountHolderType = 'company' | 'individual';

            type AccountType = 'checking' | 'savings';
          }
        }

        interface DestinationPaymentMethodOptions {
          /**
           * Optional fields for `us_bank_account`.
           */
          us_bank_account?: Stripe.Emptyable<
            DestinationPaymentMethodOptions.UsBankAccount
          >;
        }

        namespace DestinationPaymentMethodOptions {
          interface UsBankAccount {
            /**
             * The US bank account network that must be used for this OutboundPayment. If not set, we will default to the PaymentMethod's preferred network.
             */
            network?: UsBankAccount.Network;
          }

          namespace UsBankAccount {
            type Network = 'ach' | 'us_domestic_wire';
          }
        }

        interface EndUserDetails {
          /**
           * IP address of the user initiating the OutboundPayment. Must be supplied if `present` is set to `true`.
           */
          ip_address?: string;

          /**
           * `True` if the OutboundPayment creation request is being made on behalf of an end user by a platform. Otherwise, `false`.
           */
          present: boolean;
        }
      }

      interface OutboundPaymentRetrieveParams {
        /**
         * Specifies which fields in the response should be expanded.
         */
        expand?: Array<string>;
      }

      interface OutboundPaymentListParams extends PaginationParams {
        /**
         * Returns objects associated with this FinancialAccount.
         */
        financial_account: string;

        /**
         * Only return OutboundPayments sent to this customer.
         */
        customer?: string;

        /**
         * Specifies which fields in the response should be expanded.
         */
        expand?: Array<string>;

        /**
         * Only return OutboundPayments that have the given status: `processing`, `failed`, `posted`, `returned`, or `canceled`.
         */
        status?: OutboundPaymentListParams.Status;
      }

      namespace OutboundPaymentListParams {
        type Status =
          | 'canceled'
          | 'failed'
          | 'posted'
          | 'processing'
          | 'returned';
      }

      interface OutboundPaymentCancelParams {
        /**
         * Specifies which fields in the response should be expanded.
         */
        expand?: Array<string>;
      }

      class OutboundPaymentsResource {
        /**
         * Creates an OutboundPayment.
         */
        create(
          params: OutboundPaymentCreateParams,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Treasury.OutboundPayment>>;

        /**
         * Retrieves the details of an existing OutboundPayment by passing the unique OutboundPayment ID from either the OutboundPayment creation request or OutboundPayment list.
         */
        retrieve(
          id: string,
          params?: OutboundPaymentRetrieveParams,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Treasury.OutboundPayment>>;
        retrieve(
          id: string,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Treasury.OutboundPayment>>;

        /**
         * Returns a list of OutboundPayments sent from the specified FinancialAccount.
         */
        list(
          params: OutboundPaymentListParams,
          options?: RequestOptions
        ): ApiListPromise<Stripe.Treasury.OutboundPayment>;

        /**
         * Cancel an OutboundPayment.
         */
        cancel(
          id: string,
          params?: OutboundPaymentCancelParams,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Treasury.OutboundPayment>>;
        cancel(
          id: string,
          options?: RequestOptions
        ): Promise<Stripe.Response<Stripe.Treasury.OutboundPayment>>;
      }
    }
  }
}
