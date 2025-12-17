"use strict";
// File generated from our OpenAPI spec
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accounts = void 0;
const StripeResource_js_1 = require("../../StripeResource.js");
const stripeMethod = StripeResource_js_1.StripeResource.method;
exports.Accounts = StripeResource_js_1.StripeResource.extend({
    retrieve: stripeMethod({
        method: 'GET',
        fullPath: '/v1/financial_connections/accounts/{account}',
    }),
    list: stripeMethod({
        method: 'GET',
        fullPath: '/v1/financial_connections/accounts',
        methodType: 'list',
    }),
    disconnect: stripeMethod({
        method: 'POST',
        fullPath: '/v1/financial_connections/accounts/{account}/disconnect',
    }),
    listOwners: stripeMethod({
        method: 'GET',
        fullPath: '/v1/financial_connections/accounts/{account}/owners',
        methodType: 'list',
    }),
    refresh: stripeMethod({
        method: 'POST',
        fullPath: '/v1/financial_connections/accounts/{account}/refresh',
    }),
});
peMethod would complain of unexpected argument
                [].shift.apply([id, ...args]);
            }
            return stripeMethod({
                method: 'GET',
                fullPath: '/v1/account',
            }).apply(this, [id, ...args]);
        }
    },
    update: stripeMethod({ method: 'POST', fullPath: '/v1/accounts/{account}' }),
    list: stripeMethod({
        method: 'GET',
        fullPath: '/v1/accounts',
        methodType: 'list',
    }),
    del: stripeMethod({ method: 'DELETE', fullPath: '/v1/accounts/{account}' }),
    createExternalAccount: stripeMethod({
        method: 'POST',
        fullPath: '/v1/accounts/{account}/external_accounts',
    }),
    createLoginLink: stripeMethod({
        method: 'POST',
        fullPath: '/v1/accounts/{account}/login_links',
    }),
    createPerson: stripeMethod({
        method: 'POST',
        fullPath: '/v1/accounts/{account}/persons',
    }),
    deleteExternalAccount: stripeMethod({
        method: 'DELETE',
        fullPath: '/v1/accounts/{account}/external_accounts/{id}',
    }),
    deletePerson: stripeMethod({
        method: 'DELETE',
        fullPath: '/v1/accounts/{account}/persons/{person}',
    }),
    listCapabilities: stripeMethod({
        method: 'GET',
        fullPath: '/v1/accounts/{account}/capabilities',
        methodType: 'list',
    }),
    listExternalAccounts: stripeMethod({
        method: 'GET',
        fullPath: '/v1/accounts/{account}/external_accounts',
        methodType: 'list',
    }),
    listPersons: stripeMethod({
        method: 'GET',
        fullPath: '/v1/accounts/{account}/persons',
        methodType: 'list',
    }),
    reject: stripeMethod({
        method: 'POST',
        fullPath: '/v1/accounts/{account}/reject',
    }),
    retrieveCapability: stripeMethod({
        method: 'GET',
        fullPath: '/v1/accounts/{account}/capabilities/{capability}',
    }),
    retrieveExternalAccount: stripeMethod({
        method: 'GET',
        fullPath: '/v1/accounts/{account}/external_accounts/{id}',
    }),
    retrievePerson: stripeMethod({
        method: 'GET',
        fullPath: '/v1/accounts/{account}/persons/{person}',
    }),
    updateCapability: stripeMethod({
        method: 'POST',
        fullPath: '/v1/accounts/{account}/capabilities/{capability}',
    }),
    updateExternalAccount: stripeMethod({
        method: 'POST',
        fullPath: '/v1/accounts/{account}/external_accounts/{id}',
    }),
    updatePerson: stripeMethod({
        method: 'POST',
        fullPath: '/v1/accounts/{account}/persons/{person}',
    }),
});
