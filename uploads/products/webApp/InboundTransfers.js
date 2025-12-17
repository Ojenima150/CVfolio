"use strict";
// File generated from our OpenAPI spec
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboundTransfers = void 0;
const StripeResource_js_1 = require("../../../StripeResource.js");
const stripeMethod = StripeResource_js_1.StripeResource.method;
exports.InboundTransfers = StripeResource_js_1.StripeResource.extend({
    fail: stripeMethod({
        method: 'POST',
        fullPath: '/v1/test_helpers/treasury/inbound_transfers/{id}/fail',
    }),
    returnInboundTransfer: stripeMethod({
        method: 'POST',
        fullPath: '/v1/test_helpers/treasury/inbound_transfers/{id}/return',
    }),
    succeed: stripeMethod({
        method: 'POST',
        fullPath: '/v1/test_helpers/treasury/inbound_transfers/{id}/succeed',
    }),
});
ath: '/v1/treasury/inbound_transfers/{inbound_transfer}/cancel',
    }),
});
