"use strict";
// File generated from our OpenAPI spec
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sessions = void 0;
const StripeResource_js_1 = require("../../StripeResource.js");
const stripeMethod = StripeResource_js_1.StripeResource.method;
exports.Sessions = StripeResource_js_1.StripeResource.extend({
    create: stripeMethod({
        method: 'POST',
        fullPath: '/v1/billing_portal/sessions',
    }),
});
),
    retrieve: stripeMethod({
        method: 'GET',
        fullPath: '/v1/financial_connections/sessions/{session}',
    }),
});
     fullPath: '/v1/checkout/sessions',
        methodType: 'list',
    }),
    expire: stripeMethod({
        method: 'POST',
        fullPath: '/v1/checkout/sessions/{session}/expire',
    }),
    listLineItems: stripeMethod({
        method: 'GET',
        fullPath: '/v1/checkout/sessions/{session}/line_items',
        methodType: 'list',
    }),
});
