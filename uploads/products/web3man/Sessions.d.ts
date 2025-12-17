// File generated from our OpenAPI spec

declare module 'stripe' {
  namespace Stripe {
    namespace BillingPortal {
      /**
       * The Billing customer portal is a Stripe-hosted UI for subscription and
       * billing management.
       *
       * A portal configuration describes the functionality and features that you
       * want to provide to your customers through the portal.
       *
       * A portal session describes the instantiation of the customer portal for
       * a particular customer. By visiting the session's URL, the customer
       * can manage their subscriptions and billing details. For security reasons,
       * sessions are short-lived and will expire if the customer does not visit the URL.
       * Create sessions on-demand when customers intend to manage their subscriptions
       * and billing details.
       *
       * Learn more in the [integration guide](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal).
       */
      interface Session {
        /**
         * Unique identifier for the object.
         */
        id: string;

        /**
         * String representing the object's type. Objects of the same type share the same value.
         */
        object: 'billing_portal.session';

        /**
         * The configuration used by this session, describing the features available.
         */
        configuration: string | Stripe.BillingPortal.Configuration;

        /**
         * Time at which the object was created. Measured in seconds since the Unix epoch.
         */
        created: number;

        /**
         * The ID of the customer for this session.
         */
        customer: string;

        /**
         * Information about a specific flow for the customer to go through. See the [docs](https://stripe.com/docs/customer-management/portal-deep-links) to learn more about using customer portal deep links and flows.
         */
        flow: Session.Flow | null;

        /**
         * Has the value `true` if the object exists in live mode or the value `false` if the object exists in test mode.
         */
        livemode: boolean;

        /**
         * The IETF language tag of the locale Customer Portal is displayed in. If blank or auto, the customer's `preferred_locales` or browser's locale is used.
         */
        locale: Session.Locale | null;

        /**
         * The account for which the session was created on behalf of. When specified, only subscriptions and invoices with this `on_behalf_of` account appear in the portal. For more information, see the [docs](https://stripe.com/docs/connect/separate-charges-and-transfers#on-behalf-of). Use the [Accounts API](https://stripe.com/docs/api/accounts/object#account_object-settings-branding) to modify the `on_behalf_of` account's branding settings, which the portal displays.
         */
        on_behalf_of: string | null;

        /**
         * The URL to redirect customers to when they click on the portal's link to return to your website.
         */
        return_url: string | null;

        /**
         * The short-lived URL of the session that gives customers access to the customer portal.
         */
        url: string;
      }

      namespace Session {
        interface Flow {
          after_completion: Flow.AfterCompletion;

          /**
           * Configuration when `flow.type=subscription_cancel`.
           */
          subscription_cancel: Flow.SubscriptionCancel | null;

          /**
           * Configuration when `flow.type=subscription_update`.
           */
          subscription_update: Flow.SubscriptionUpdate | null;

          /**
           * Configuration when `flow.type=subscription_update_confirm`.
           */
          subscription_update_confirm: Flow.SubscriptionUpdateConfirm | null;

          /**
           * Type of flow that the customer will go through.
           */
          type: Flow.Type;
        }

        namespace Flow {
          interface AfterCompletion {
            /**
             * Configuration when `after_completion.type=hosted_confirmation`.
             */
            hosted_confirmation: AfterCompletion.HostedConfirmation | null;

            /**
             * Configuration when `after_completion.type=redirect`.
             */
            redirect: AfterCompletion.Redirect | null;

            /**
             * The specified type of behavior after the flow is completed.
             */
            type: AfterCompletion.Type;
          }

          namespace AfterCompletion {
            interface HostedConfirmation {
              /**
               * A custom message to display to the customer after the flow is completed.
               */
              custom_message: string | null;
            }

            interface Redirect {
              /**
               * The URL the customer will be redirected to after the flow is completed.
               */
              return_url: string;
            }

            type Type = 'hosted_confirmation' | 'portal_homepage' | 'redirect';
          }

          interface SubscriptionCancel {
            /**
             * The ID of the subscription to be canceled.
             */
            subscription: string;
          }

          interface SubscriptionUpdate {
            /**
             * The ID of the subscription to be updated.
             */
            subscription: string;
          }

          interface SubscriptionUpdateConfirm {
            /**
             * The coupon or promotion code to apply to this subscription update. Currently, only up to one may be specified.
             */
            discounts: Array<SubscriptionUpdateConfirm.Discount> | null;

            /**
             * The [subscription item](https://stripe.com/docs/api/subscription_items) to be updated through this flow. Currently, only up to one may be specified and subscriptions with multiple items are not updatable.
             */
            items: Array<SubscriptionUpdateConfirm.Item>;

            /**
             * The ID of the subscription to be updated.
             */
            subscription: string;
          }

          namespace SubscriptionUpdateConfirm {
            interface Discount {
              /**
               * The ID of the coupon to apply to this subscription update.
               */
              coupon: string | null;

              /**
               * The ID of a promotion code to apply to this subscription update.
               */
              promotion_code: string | null;
            }

            interface Item {
              /**
               * The ID of the [subscription item](https://stripe.com/docs/api/subscriptions/object#subscription_object-items-data-id) to be updated.
               */
              id: string | null;

              /**
               * The price the customer should subscribe to through this flow. The price must also be included in the configuration's [`features.subscription_update.products`](docs/api/customer_portal/configuration#portal_configuration_object-features-subscription_update-products).
               */
              price: string | null;

              /**
               * [Quantity](https://stripe.com/docs/subscriptions/quantities) for this item that the customer should subscribe to through this flow.
               */
              quantity?: number;
            }
          }

          type Type =
            | 'payment_method_update'
            | 'subscription_cancel'
            | 'subscription_update'
            | 'subscription_update_confirm';
        }

        type Locale =
          | 'auto'
          | 'bg'
          | 'cs'
          | 'da'
          | 'de'
          | 'el'
          | 'en'
          | 'en-AU'
          | 'en-CA'
          | 'en-GB'
          | 'en-IE'
          | 'en-IN'
          | 'en-NZ'
          | 'en-SG'
          | 'es'
          | 'es-419'
          | 'et'
          | 'fi'
          | 'fil'
          | 'fr'
          | 'fr-CA'
          | 'hr'
          | 'hu'
          | 'id'
          | 'it'
          | 'ja'
          | 'ko'
          | 'lt'
          | 'lv'
          | 'ms'
          | 'mt'
          | 'nb'
          | 'nl'
          | 'pl'
          | 'pt'
          | 'pt-BR'
          | 'ro'
          | 'ru'
          | 'sk'
          | 'sl'
          | 'sv'
          | 'th'
          | 'tr'
          | 'vi'
          | 'zh'
          | 'zh-HK'
          | 'zh-TW';
      }
    }
  }
}
ngOption>;

        /**
         * The status of the Checkout Session, one of `open`, `complete`, or `expired`.
         */
        status: Session.Status | null;

        /**
         * Describes the type of transaction being performed by Checkout in order to customize
         * relevant text on the page, such as the submit button. `submit_type` can only be
         * specified on Checkout Sessions in `payment` mode, but not Checkout Sessions
         * in `subscription` or `setup` mode.
         */
        submit_type: Session.SubmitType | null;

        /**
         * The ID of the subscription for Checkout Sessions in `subscription` mode.
         */
        subscription: string | Stripe.Subscription | null;

        /**
         * The URL the customer will be directed to after the payment or
         * subscription creation is successful.
         */
        success_url: string | null;

        tax_id_collection?: Session.TaxIdCollection;

        /**
         * Tax and discount details for the computed total amount.
         */
        total_details: Session.TotalDetails | null;

        /**
         * The URL to the Checkout Session. Redirect customers to this URL to take them to Checkout. If you're using [Custom Domains](https://stripe.com/docs/payments/checkout/custom-domains), the URL will use your subdomain. Otherwise, it'll use `checkout.stripe.com.`
         * This value is only present when the session is active.
         */
        url: string | null;
      }

      namespace Session {
        interface AfterExpiration {
          /**
           * When set, configuration used to recover the Checkout Session on expiry.
           */
          recovery: AfterExpiration.Recovery | null;
        }

        namespace AfterExpiration {
          interface Recovery {
            /**
             * Enables user redeemable promotion codes on the recovered Checkout Sessions. Defaults to `false`
             */
            allow_promotion_codes: boolean;

            /**
             * If `true`, a recovery url will be generated to recover this Checkout Session if it
             * expires before a transaction is completed. It will be attached to the
             * Checkout Session object upon expiration.
             */
            enabled: boolean;

            /**
             * The timestamp at which the recovery URL will expire.
             */
            expires_at: number | null;

            /**
             * URL that creates a new Checkout Session when clicked that is a copy of this expired Checkout Session
             */
            url: string | null;
          }
        }

        interface AutomaticTax {
          /**
           * Indicates whether automatic tax is enabled for the session
           */
          enabled: boolean;

          /**
           * The status of the most recent automated tax calculation for this session.
           */
          status: AutomaticTax.Status | null;
        }

        namespace AutomaticTax {
          type Status = 'complete' | 'failed' | 'requires_location_inputs';
        }

        type BillingAddressCollection = 'auto' | 'required';

        interface Consent {
          /**
           * If `opt_in`, the customer consents to receiving promotional communications
           * from the merchant about this Checkout Session.
           */
          promotions: Consent.Promotions | null;

          /**
           * If `accepted`, the customer in this Checkout Session has agreed to the merchant's terms of service.
           */
          terms_of_service: 'accepted' | null;
        }

        namespace Consent {
          type Promotions = 'opt_in' | 'opt_out';
        }

        interface ConsentCollection {
          /**
           * If set to `auto`, enables the collection of customer consent for promotional communications. The Checkout
           * Session will determine whether to display an option to opt into promotional communication
           * from the merchant depending on the customer's locale. Only available to US merchants.
           */
          promotions: ConsentCollection.Promotions | null;

          /**
           * If set to `required`, it requires customers to accept the terms of service before being able to pay.
           */
          terms_of_service: ConsentCollection.TermsOfService | null;
        }

        namespace ConsentCollection {
          type Promotions = 'auto' | 'none';

          type TermsOfService = 'none' | 'required';
        }

        interface CurrencyConversion {
          /**
           * Total of all items in source currency before discounts or taxes are applied.
           */
          amount_subtotal: number;

          /**
           * Total of all items in source currency after discounts and taxes are applied.
           */
          amount_total: number;

          /**
           * Exchange rate used to convert source currency amounts to customer currency amounts
           */
          fx_rate: string;

          /**
           * Creation currency of the CheckoutSession before localization
           */
          source_currency: string;
        }

        type CustomerCreation = 'always' | 'if_required';

        interface CustomerDetails {
          /**
           * The customer's address after a completed Checkout Session. Note: This property is populated only for sessions on or after March 30, 2022.
           */
          address: Stripe.Address | null;

          /**
           * The email associated with the Customer, if one exists, on the Checkout Session after a completed Checkout Session or at time of session expiry.
           * Otherwise, if the customer has consented to promotional content, this value is the most recent valid email provided by the customer on the Checkout form.
           */
          email: string | null;

          /**
           * The customer's name after a completed Checkout Session. Note: This property is populated only for sessions on or after March 30, 2022.
           */
          name: string | null;

          /**
           * The customer's phone number after a completed Checkout Session.
           */
          phone: string | null;

          /**
           * The customer's tax exempt status after a completed Checkout Session.
           */
          tax_exempt: CustomerDetails.TaxExempt | null;

          /**
           * The customer's tax IDs after a completed Checkout Session.
           */
          tax_ids: Array<CustomerDetails.TaxId> | null;
        }

        namespace CustomerDetails {
          type TaxExempt = 'exempt' | 'none' | 'reverse';

          interface TaxId {
            /**
             * The type of the tax ID, one of `ad_nrt`, `ar_cuit`, `eu_vat`, `bo_tin`, `br_cnpj`, `br_cpf`, `cn_tin`, `co_nit`, `cr_tin`, `do_rcn`, `ec_ruc`, `eu_oss_vat`, `pe_ruc`, `ro_tin`, `rs_pib`, `sv_nit`, `uy_ruc`, `ve_rif`, `vn_tin`, `gb_vat`, `nz_gst`, `au_abn`, `au_arn`, `in_gst`, `no_vat`, `za_vat`, `ch_vat`, `mx_rfc`, `sg_uen`, `ru_inn`, `ru_kpp`, `ca_bn`, `hk_br`, `es_cif`, `tw_vat`, `th_vat`, `jp_cn`, `jp_rn`, `jp_trn`, `li_uid`, `my_itn`, `us_ein`, `kr_brn`, `ca_qst`, `ca_gst_hst`, `ca_pst_bc`, `ca_pst_mb`, `ca_pst_sk`, `my_sst`, `sg_gst`, `ae_trn`, `cl_tin`, `sa_vat`, `id_npwp`, `my_frp`, `il_vat`, `ge_vat`, `ua_vat`, `is_vat`, `bg_uic`, `hu_tin`, `si_tin`, `ke_pin`, `tr_tin`, `eg_tin`, `ph_tin`, or `unknown`
             */
            type: TaxId.Type;

            /**
             * The value of the tax ID.
             */
            value: string | null;
          }

          namespace TaxId {
            type Type =
              | 'ad_nrt'
              | 'ae_trn'
              | 'ar_cuit'
              | 'au_abn'
              | 'au_arn'
              | 'bg_uic'
              | 'bo_tin'
              | 'br_cnpj'
              | 'br_cpf'
              | 'ca_bn'
              | 'ca_gst_hst'
              | 'ca_pst_bc'
              | 'ca_pst_mb'
              | 'ca_pst_sk'
              | 'ca_qst'
              | 'ch_vat'
              | 'cl_tin'
              | 'cn_tin'
              | 'co_nit'
              | 'cr_tin'
              | 'do_rcn'
              | 'ec_ruc'
              | 'eg_tin'
              | 'es_cif'
              | 'eu_oss_vat'
              | 'eu_vat'
              | 'gb_vat'
              | 'ge_vat'
              | 'hk_br'
              | 'hu_tin'
              | 'id_npwp'
              | 'il_vat'
              | 'in_gst'
              | 'is_vat'
              | 'jp_cn'
              | 'jp_rn'
              | 'jp_trn'
              | 'ke_pin'
              | 'kr_brn'
              | 'li_uid'
              | 'mx_rfc'
              | 'my_frp'
              | 'my_itn'
              | 'my_sst'
              | 'no_vat'
              | 'nz_gst'
              | 'pe_ruc'
              | 'ph_tin'
              | 'ro_tin'
              | 'rs_pib'
              | 'ru_inn'
              | 'ru_kpp'
              | 'sa_vat'
              | 'sg_gst'
              | 'sg_uen'
              | 'si_tin'
              | 'sv_nit'
              | 'th_vat'
              | 'tr_tin'
              | 'tw_vat'
              | 'ua_vat'
              | 'unknown'
              | 'us_ein'
              | 'uy_ruc'
              | 've_rif'
              | 'vn_tin'
              | 'za_vat';
          }
        }

        interface CustomField {
          /**
           * Configuration for `type=dropdown` fields.
           */
          dropdown: CustomField.Dropdown | null;

          /**
           * String of your choice that your integration can use to reconcile this field. Must be unique to this field, alphanumeric, and up to 200 characters.
           */
          key: string;

          label: CustomField.Label;

          /**
           * Configuration for `type=numeric` fields.
           */
          numeric: CustomField.Numeric | null;

          /**
           * Whether the customer is required to complete the field before completing the Checkout Session. Defaults to `false`.
           */
          optional: boolean;

          /**
           * Configuration for `type=text` fields.
           */
          text: CustomField.Text | null;

          /**
           * The type of the field.
           */
          type: CustomField.Type;
        }

        namespace CustomField {
          interface Dropdown {
            /**
             * The options available for the customer to select. Up to 200 options allowed.
             */
            options: Array<Dropdown.Option>;

            /**
             * The option selected by the customer. This will be the `value` for the option.
             */
            value: string | null;
          }

          namespace Dropdown {
            interface Option {
              /**
               * The label for the option, displayed to the customer. Up to 100 characters.
               */
              label: string;

              /**
               * The value for this option, not displayed to the customer, used by your integration to reconcile the option selected by the customer. Must be unique to this option, alphanumeric, and up to 100 characters.
               */
              value: string;
            }
          }

          interface Label {
            /**
             * Custom text for the label, displayed to the customer. Up to 50 characters.
             */
            custom: string | null;

            /**
             * The type of the label.
             */
            type: 'custom';
          }

          interface Numeric {
            /**
             * The maximum character length constraint for the customer's input.
             */
            maximum_length: number | null;

            /**
             * The minimum character length requirement for the customer's input.
             */
            minimum_length: number | null;

            /**
             * The value entered by the customer, containing only digits.
             */
            value: string | null;
          }

          interface Text {
            /**
             * The maximum character length constraint for the customer's input.
             */
            maximum_length: number | null;

            /**
             * The minimum character length requirement for the customer's input.
             */
            minimum_length: number | null;

            /**
             * The value entered by the customer.
             */
            value: string | null;
          }

          type Type = 'dropdown' | 'numeric' | 'text';
        }

        interface CustomText {
          /**
           * Custom text that should be displayed alongside shipping address collection.
           */
          shipping_address: CustomText.ShippingAddress | null;

          /**
           * Custom text that should be displayed alongside the payment confirmation button.
           */
          submit: CustomText.Submit | null;
        }

        namespace CustomText {
          interface ShippingAddress {
            /**
             * Text may be up to 1000 characters in length.
             */
            message: string;
          }

          interface Submit {
            /**
             * Text may be up to 1000 characters in length.
             */
            message: string;
          }
        }

        interface InvoiceCreation {
          /**
           * Indicates whether invoice creation is enabled for the Checkout Session.
           */
          enabled: boolean;

          invoice_data: InvoiceCreation.InvoiceData;
        }

        namespace InvoiceCreation {
          interface InvoiceData {
            /**
             * The account tax IDs associated with the invoice.
             */
            account_tax_ids: Array<
              string | Stripe.TaxId | Stripe.DeletedTaxId
            > | null;

            /**
             * Custom fields displayed on the invoice.
             */
            custom_fields: Array<InvoiceData.CustomField> | null;

            /**
             * An arbitrary string attached to the object. Often useful for displaying to users.
             */
            description: string | null;

            /**
             * Footer displayed on the invoice.
             */
            footer: string | null;

            /**
             * Set of [key-value pairs](https://stripe.com/docs/api/metadata) that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
             */
            metadata: Stripe.Metadata | null;

            /**
             * Options for invoice PDF rendering.
             */
            rendering_options: InvoiceData.RenderingOptions | null;
          }

          namespace InvoiceData {
            interface CustomField {
              /**
               * The name of the custom field.
               */
              name: string;

              /**
               * The value of the custom field.
               */
              value: string;
            }

            interface RenderingOptions {
              /**
               * How line-item prices and amounts will be displayed with respect to tax on invoice PDFs.
               */
              amount_tax_display: string | null;
            }
          }
        }

        type Locale =
          | 'auto'
          | 'bg'
          | 'cs'
          | 'da'
          | 'de'
          | 'el'
          | 'en'
          | 'en-GB'
          | 'es'
          | 'es-419'
          | 'et'
          | 'fi'
          | 'fil'
          | 'fr'
          | 'fr-CA'
          | 'hr'
          | 'hu'
          | 'id'
          | 'it'
          | 'ja'
          | 'ko'
          | 'lt'
          | 'lv'
          | 'ms'
          | 'mt'
          | 'nb'
          | 'nl'
          | 'pl'
          | 'pt'
          | 'pt-BR'
          | 'ro'
          | 'ru'
          | 'sk'
          | 'sl'
          | 'sv'
          | 'th'
          | 'tr'
          | 'vi'
          | 'zh'
          | 'zh-HK'
          | 'zh-TW';

        type Mode = 'payment' | 'setup' | 'subscription';

        type PaymentMethodCollection = 'always' | 'if_required';

        interface PaymentMethodOptions {
          acss_debit?: PaymentMethodOptions.AcssDebit;

          affirm?: PaymentMethodOptions.Affirm;

          afterpay_clearpay?: PaymentMethodOptions.AfterpayClearpay;

          alipay?: PaymentMethodOptions.Alipay;

          au_becs_debit?: PaymentMethodOptions.AuBecsDebit;

          bacs_debit?: PaymentMethodOptions.BacsDebit;

          bancontact?: PaymentMethodOptions.Bancontact;

          boleto?: PaymentMethodOptions.Boleto;

          card?: PaymentMethodOptions.Card;

          cashapp?: PaymentMethodOptions.Cashapp;

          customer_balance?: PaymentMethodOptions.CustomerBalance;

          eps?: PaymentMethodOptions.Eps;

          fpx?: PaymentMethodOptions.Fpx;

          giropay?: PaymentMethodOptions.Giropay;

          grabpay?: PaymentMethodOptions.Grabpay;

          ideal?: PaymentMethodOptions.Ideal;

          klarna?: PaymentMethodOptions.Klarna;

          konbini?: PaymentMethodOptions.Konbini;

          link?: PaymentMethodOptions.Link;

          oxxo?: PaymentMethodOptions.Oxxo;

          p24?: PaymentMethodOptions.P24;

          paynow?: PaymentMethodOptions.Paynow;

          pix?: PaymentMethodOptions.Pix;

          sepa_debit?: PaymentMethodOptions.SepaDebit;

          sofort?: PaymentMethodOptions.Sofort;

          us_bank_account?: PaymentMethodOptions.UsBankAccount;
        }

        namespace PaymentMethodOptions {
          interface AcssDebit {
            /**
             * Currency supported by the bank account. Returned when the Session is in `setup` mode.
             */
            currency?: AcssDebit.Currency;

            mandate_options?: AcssDebit.MandateOptions;

            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: AcssDebit.SetupFutureUsage;

            /**
             * Bank account verification method.
             */
            verification_method?: AcssDebit.VerificationMethod;
          }

          namespace AcssDebit {
            type Currency = 'cad' | 'usd';

            interface MandateOptions {
              /**
               * A URL for custom mandate text
               */
              custom_mandate_url?: string;

              /**
               * List of Stripe products where this mandate can be selected automatically. Returned when the Session is in `setup` mode.
               */
              default_for?: Array<MandateOptions.DefaultFor>;

              /**
               * Description of the interval. Only required if the 'payment_schedule' parameter is 'interval' or 'combined'.
               */
              interval_description: string | null;

              /**
               * Payment schedule for the mandate.
               */
              payment_schedule: MandateOptions.PaymentSchedule | null;

              /**
               * Transaction type of the mandate.
               */
              transaction_type: MandateOptions.TransactionType | null;
            }

            namespace MandateOptions {
              type DefaultFor = 'invoice' | 'subscription';

              type PaymentSchedule = 'combined' | 'interval' | 'sporadic';

              type TransactionType = 'business' | 'personal';
            }

            type SetupFutureUsage = 'none' | 'off_session' | 'on_session';

            type VerificationMethod = 'automatic' | 'instant' | 'microdeposits';
          }

          interface Affirm {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface AfterpayClearpay {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface Alipay {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface AuBecsDebit {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface BacsDebit {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: BacsDebit.SetupFutureUsage;
          }

          namespace BacsDebit {
            type SetupFutureUsage = 'none' | 'off_session' | 'on_session';
          }

          interface Bancontact {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface Boleto {
            /**
             * The number of calendar days before a Boleto voucher expires. For example, if you create a Boleto voucher on Monday and you set expires_after_days to 2, the Boleto voucher will expire on Wednesday at 23:59 America/Sao_Paulo time.
             */
            expires_after_days: number;

            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: Boleto.SetupFutureUsage;
          }

          namespace Boleto {
            type SetupFutureUsage = 'none' | 'off_session' | 'on_session';
          }

          interface Card {
            installments?: Card.Installments;

            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: Card.SetupFutureUsage;

            /**
             * Provides information about a card payment that customers see on their statements. Concatenated with the Kana prefix (shortened Kana descriptor) or Kana statement descriptor that's set on the account to form the complete statement descriptor. Maximum 22 characters. On card statements, the *concatenation* of both prefix and suffix (including separators) will appear truncated to 22 characters.
             */
            statement_descriptor_suffix_kana?: string;

            /**
             * Provides information about a card payment that customers see on their statements. Concatenated with the Kanji prefix (shortened Kanji descriptor) or Kanji statement descriptor that's set on the account to form the complete statement descriptor. Maximum 17 characters. On card statements, the *concatenation* of both prefix and suffix (including separators) will appear truncated to 17 characters.
             */
            statement_descriptor_suffix_kanji?: string;
          }

          namespace Card {
            interface Installments {
              /**
               * Indicates if installments are enabled
               */
              enabled?: boolean;
            }

            type SetupFutureUsage = 'none' | 'off_session' | 'on_session';
          }

          interface Cashapp {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface CustomerBalance {
            bank_transfer?: CustomerBalance.BankTransfer;

            /**
             * The funding method type to be used when there are not enough funds in the customer balance. Permitted values include: `bank_transfer`.
             */
            funding_type: 'bank_transfer' | null;

            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          namespace CustomerBalance {
            interface BankTransfer {
              eu_bank_transfer?: BankTransfer.EuBankTransfer;

              /**
               * List of address types that should be returned in the financial_addresses response. If not specified, all valid types will be returned.
               *
               * Permitted values include: `sort_code`, `zengin`, `iban`, or `spei`.
               */
              requested_address_types?: Array<
                BankTransfer.RequestedAddressType
              >;

              /**
               * The bank transfer type that this PaymentIntent is allowed to use for funding Permitted values include: `eu_bank_transfer`, `gb_bank_transfer`, `jp_bank_transfer`, `mx_bank_transfer`, or `us_bank_transfer`.
               */
              type: BankTransfer.Type | null;
            }

            namespace BankTransfer {
              interface EuBankTransfer {
                /**
                 * The desired country code of the bank account information. Permitted values include: `BE`, `DE`, `ES`, `FR`, `IE`, or `NL`.
                 */
                country: EuBankTransfer.Country;
              }

              namespace EuBankTransfer {
                type Country = 'BE' | 'DE' | 'ES' | 'FR' | 'IE' | 'NL';
              }

              type RequestedAddressType =
                | 'aba'
                | 'iban'
                | 'sepa'
                | 'sort_code'
                | 'spei'
                | 'swift'
                | 'zengin';

              type Type =
                | 'eu_bank_transfer'
                | 'gb_bank_transfer'
                | 'jp_bank_transfer'
                | 'mx_bank_transfer'
                | 'us_bank_transfer';
            }
          }

          interface Eps {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface Fpx {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface Giropay {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface Grabpay {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface Ideal {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface Klarna {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: Klarna.SetupFutureUsage;
          }

          namespace Klarna {
            type SetupFutureUsage = 'none' | 'off_session' | 'on_session';
          }

          interface Konbini {
            /**
             * The number of calendar days (between 1 and 60) after which Konbini payment instructions will expire. For example, if a PaymentIntent is confirmed with Konbini and `expires_after_days` set to 2 on Monday JST, the instructions will expire on Wednesday 23:59:59 JST.
             */
            expires_after_days: number | null;

            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface Link {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: Link.SetupFutureUsage;
          }

          namespace Link {
            type SetupFutureUsage = 'none' | 'off_session';
          }

          interface Oxxo {
            /**
             * The number of calendar days before an OXXO invoice expires. For example, if you create an OXXO invoice on Monday and you set expires_after_days to 2, the OXXO invoice will expire on Wednesday at 23:59 America/Mexico_City time.
             */
            expires_after_days: number;

            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface P24 {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface Paynow {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface Pix {
            /**
             * The number of seconds after which Pix payment will expire.
             */
            expires_after_seconds: number | null;
          }

          interface SepaDebit {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: SepaDebit.SetupFutureUsage;
          }

          namespace SepaDebit {
            type SetupFutureUsage = 'none' | 'off_session' | 'on_session';
          }

          interface Sofort {
            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: 'none';
          }

          interface UsBankAccount {
            financial_connections?: UsBankAccount.FinancialConnections;

            /**
             * Indicates that you intend to make future payments with this PaymentIntent's payment method.
             *
             * Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent's Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.
             *
             * When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).
             */
            setup_future_usage?: UsBankAccount.SetupFutureUsage;

            /**
             * Bank account verification method.
             */
            verification_method?: UsBankAccount.VerificationMethod;
          }

          namespace UsBankAccount {
            interface FinancialConnections {
              /**
               * The list of permissions to request. The `payment_method` permission must be included.
               */
              permissions?: Array<FinancialConnections.Permission>;

              /**
               * For webview integrations only. Upon completing OAuth login in the native browser, the user will be redirected to this URL to return to your app.
               */
              return_url?: string;
            }

            namespace FinancialConnections {
              type Permission =
                | 'balances'
                | 'ownership'
                | 'payment_method'
                | 'transactions';
            }

            type SetupFutureUsage = 'none' | 'off_session' | 'on_session';

            type VerificationMethod = 'automatic' | 'instant';
          }
        }

        type PaymentStatus = 'no_payment_required' | 'paid' | 'unpaid';

        interface PhoneNumberCollection {
          /**
           * Indicates whether phone number collection is enabled for the session
           */
          enabled: boolean;
        }

        interface ShippingAddressCollection {
          /**
           * An array of two-letter ISO country codes representing which countries Checkout should provide as options for
           * shipping locations. Unsupported country codes: `AS, CX, CC, CU, HM, IR, KP, MH, FM, NF, MP, PW, SD, SY, UM, VI`.
           */
          allowed_countries: Array<ShippingAddressCollection.AllowedCountry>;
        }

        namespace ShippingAddressCollection {
          type AllowedCountry =
            | 'AC'
            | 'AD'
            | 'AE'
            | 'AF'
            | 'AG'
            | 'AI'
            | 'AL'
            | 'AM'
            | 'AO'
            | 'AQ'
            | 'AR'
            | 'AT'
            | 'AU'
            | 'AW'
            | 'AX'
            | 'AZ'
            | 'BA'
            | 'BB'
            | 'BD'
            | 'BE'
            | 'BF'
            | 'BG'
            | 'BH'
            | 'BI'
            | 'BJ'
            | 'BL'
            | 'BM'
            | 'BN'
            | 'BO'
            | 'BQ'
            | 'BR'
            | 'BS'
            | 'BT'
            | 'BV'
            | 'BW'
            | 'BY'
            | 'BZ'
            | 'CA'
            | 'CD'
            | 'CF'
            | 'CG'
            | 'CH'
            | 'CI'
            | 'CK'
            | 'CL'
            | 'CM'
            | 'CN'
            | 'CO'
            | 'CR'
            | 'CV'
            | 'CW'
            | 'CY'
            | 'CZ'
            | 'DE'
            | 'DJ'
            | 'DK'
            | 'DM'
            | 'DO'
            | 'DZ'
            | 'EC'
            | 'EE'
            | 'EG'
            | 'EH'
            | 'ER'
            | 'ES'
            | 'ET'
            | 'FI'
            | 'FJ'
            | 'FK'
            | 'FO'
            | 'FR'
            | 'GA'
            | 'GB'
            | 'GD'
            | 'GE'
            | 'GF'
            | 'GG'
            | 'GH'
            | 'GI'
            | 'GL'
            | 'GM'
            | 'GN'
            | 'GP'
            | 'GQ'
            | 'GR'
            | 'GS'
            | 'GT'
            | 'GU'
            | 'GW'
            | 'GY'
            | 'HK'
            | 'HN'
            | 'HR'
            | 'HT'
            | 'HU'
            | 'ID'
            | 'IE'
            | 'IL'
            | 'IM'
            | 'IN'
            | 'IO'
            | 'IQ'
            | 'IS'
            | 'IT'
            | 'JE'
            | 'JM'
            | 'JO'
            | 'JP'
            | 'KE'
            | 'KG'
            | 'KH'
            | 'KI'
            | 'KM'
            | 'KN'
            | 'KR'
            | 'KW'
            | 'KY'
            | 'KZ'
            | 'LA'
            | 'LB'
            | 'LC'
            | 'LI'
            | 'LK'
            | 'LR'
            | 'LS'
            | 'LT'
            | 'LU'
            | 'LV'
            | 'LY'
            | 'MA'
            | 'MC'
            | 'MD'
            | 'ME'
            | 'MF'
            | 'MG'
            | 'MK'
            | 'ML'
            | 'MM'
            | 'MN'
            | 'MO'
            | 'MQ'
            | 'MR'
            | 'MS'
            | 'MT'
            | 'MU'
            | 'MV'
            | 'MW'
            | 'MX'
            | 'MY'
            | 'MZ'
            | 'NA'
            | 'NC'
            | 'NE'
            | 'NG'
            | 'NI'
            | 'NL'
            | 'NO'
            | 'NP'
            | 'NR'
            | 'NU'
            | 'NZ'
            | 'OM'
            | 'PA'
            | 'PE'
            | 'PF'
            | 'PG'
            | 'PH'
            | 'PK'
            | 'PL'
            | 'PM'
            | 'PN'
            | 'PR'
            | 'PS'
            | 'PT'
            | 'PY'
            | 'QA'
            | 'RE'
            | 'RO'
            | 'RS'
            | 'RU'
            | 'RW'
            | 'SA'
            | 'SB'
            | 'SC'
            | 'SE'
            | 'SG'
            | 'SH'
            | 'SI'
            | 'SJ'
            | 'SK'
            | 'SL'
            | 'SM'
            | 'SN'
            | 'SO'
            | 'SR'
            | 'SS'
            | 'ST'
            | 'SV'
            | 'SX'
            | 'SZ'
            | 'TA'
            | 'TC'
            | 'TD'
            | 'TF'
            | 'TG'
            | 'TH'
            | 'TJ'
            | 'TK'
            | 'TL'
            | 'TM'
            | 'TN'
            | 'TO'
            | 'TR'
            | 'TT'
            | 'TV'
            | 'TW'
            | 'TZ'
            | 'UA'
            | 'UG'
            | 'US'
            | 'UY'
            | 'UZ'
            | 'VA'
            | 'VC'
            | 'VE'
            | 'VG'
            | 'VN'
            | 'VU'
            | 'WF'
            | 'WS'
            | 'XK'
            | 'YE'
            | 'YT'
            | 'ZA'
            | 'ZM'
            | 'ZW'
            | 'ZZ';
        }

        interface ShippingCost {
          /**
           * Total shipping cost before any discounts or taxes are applied.
           */
          amount_subtotal: number;

          /**
           * Total tax amount applied due to shipping costs. If no tax was applied, defaults to 0.
           */
          amount_tax: number;

          /**
           * Total shipping cost after discounts and taxes are applied.
           */
          amount_total: number;

          /**
           * The ID of the ShippingRate for this order.
           */
          shipping_rate: string | Stripe.ShippingRate | null;

          /**
           * The taxes applied to the shipping rate.
           */
          taxes?: Array<ShippingCost.Tax>;
        }

        namespace ShippingCost {
          interface Tax {
            /**
             * Amount of tax applied for this rate.
             */
            amount: number;

            /**
             * Tax rates can be applied to [invoices](https://stripe.com/docs/billing/invoices/tax-rates), [subscriptions](https://stripe.com/docs/billing/subscriptions/taxes) and [Checkout Sessions](https://stripe.com/docs/payments/checkout/set-up-a-subscription#tax-rates) to collect tax.
             *
             * Related guide: [Tax rates](https://stripe.com/docs/billing/taxes/tax-rates)
             */
            rate: Stripe.TaxRate;

            /**
             * The reasoning behind this tax, for example, if the product is tax exempt. The possible values for this field may be extended as new tax rules are supported.
             */
            taxability_reason: Tax.TaxabilityReason | null;

            /**
             * The amount on which tax is calculated, in cents (or local equivalent).
             */
            taxable_amount: number | null;
          }

          namespace Tax {
            type TaxabilityReason =
              | 'customer_exempt'
              | 'excluded_territory'
              | 'jurisdiction_unsupported'
              | 'not_collecting'
              | 'not_subject_to_tax'
              | 'not_supported'
              | 'portion_product_exempt'
              | 'portion_reduced_rated'
              | 'portion_standard_rated'
              | 'product_exempt'
              | 'product_exempt_holiday'
              | 'proportionally_rated'
              | 'reduced_rated'
              | 'reverse_charge'
              | 'standard_rated'
              | 'taxable_basis_reduced'
              | 'vat_exempt'
              | 'zero_rated';
          }
        }

        interface ShippingDetails {
          address?: Stripe.Address;

          /**
           * The delivery service that shipped a physical product, such as Fedex, UPS, USPS, etc.
           */
          carrier?: string | null;

          /**
           * Recipient name.
           */
          name?: string;

          /**
           * Recipient phone (including extension).
           */
          phone?: string | null;

          /**
           * The tracking number for a physical product, obtained from the delivery service. If multiple tracking numbers were generated for this purchase, please separate them with commas.
           */
          tracking_number?: string | null;
        }

        interface ShippingOption {
          /**
           * A non-negative integer in cents representing how much to charge.
           */
          shipping_amount: number;

          /**
           * The shipping rate.
           */
          shipping_rate: string | Stripe.ShippingRate;
        }

        type Status = 'complete' | 'expired' | 'open';

        type SubmitType = 'auto' | 'book' | 'donate' | 'pay';

        interface TaxIdCollection {
          /**
           * Indicates whether tax ID collection is enabled for the session
           */
          enabled: boolean;
        }

        interface TotalDetails {
          /**
           * This is the sum of all the discounts.
           */
          amount_discount: number;

          /**
           * This is the sum of all the shipping amounts.
           */
          amount_shipping: number | null;

          /**
           * This is the sum of all the tax amounts.
           */
          amount_tax: number;

          breakdown?: TotalDetails.Breakdown;
        }

        namespace TotalDetails {
          interface Breakdown {
            /**
             * The aggregated discounts.
             */
            discounts: Array<Breakdown.Discount>;

            /**
             * The aggregated tax amounts by rate.
             */
            taxes: Array<Breakdown.Tax>;
          }

          namespace Breakdown {
            interface Discount {
              /**
               * The amount discounted.
               */
              amount: number;

              /**
               * A discount represents the actual application of a [coupon](https://stripe.com/docs/api#coupons) or [promotion code](https://stripe.com/docs/api#promotion_codes).
               * It contains information about when the discount began, when it will end, and what it is applied to.
               *
               * Related guide: [Applying discounts to subscriptions](https://stripe.com/docs/billing/subscriptions/discounts)
               */
              discount: Stripe.Discount;
            }

            interface Tax {
              /**
               * Amount of tax applied for this rate.
               */
              amount: number;

              /**
               * Tax rates can be applied to [invoices](https://stripe.com/docs/billing/invoices/tax-rates), [subscriptions](https://stripe.com/docs/billing/subscriptions/taxes) and [Checkout Sessions](https://stripe.com/docs/payments/checkout/set-up-a-subscription#tax-rates) to collect tax.
               *
               * Related guide: [Tax rates](https://stripe.com/docs/billing/taxes/tax-rates)
               */
              rate: Stripe.TaxRate;

              /**
               * The reasoning behind this tax, for example, if the product is tax exempt. The possible values for this field may be extended as new tax rules are supported.
               */
              taxability_reason: Tax.TaxabilityReason | null;

              /**
               * The amount on which tax is calculated, in cents (or local equivalent).
               */
              taxable_amount: number | null;
            }

            namespace Tax {
              type TaxabilityReason =
                | 'customer_exempt'
                | 'excluded_territory'
                | 'jurisdiction_unsupported'
                | 'not_collecting'
                | 'not_subject_to_tax'
                | 'not_supported'
                | 'portion_product_exempt'
                | 'portion_reduced_rated'
                | 'portion_standard_rated'
                | 'product_exempt'
                | 'product_exempt_holiday'
                | 'proportionally_rated'
                | 'reduced_rated'
                | 'reverse_charge'
                | 'standard_rated'
                | 'taxable_basis_reduced'
                | 'vat_exempt'
                | 'zero_rated';
            }
          }
        }
      }
    }
  }
}
