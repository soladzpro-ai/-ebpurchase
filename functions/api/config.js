import { PRODUCTS, currency, getEnv, json, pay2sConfigured, sanityConfigured } from '../../src/lumen.js';

export function onRequestGet({ env }) {
  return json(200, {
    googleConfigured: Boolean(getEnv(env, 'GOOGLE_CLIENT_ID') && getEnv(env, 'GOOGLE_CLIENT_SECRET')),
    sanityConfigured: sanityConfigured(env),
    pay2sConfigured: pay2sConfigured(env),
    currency: currency(env),
    products: PRODUCTS
  });
}
