
// Environment-based configuration
const rawNodeEnv = process.env.NODE_ENV || 'dev';
const NODE_ENV = rawNodeEnv.trim().toLowerCase();

const environments = {
  dev: {
    username: process.env.SF_DEV_USERNAME || 'jk885827@resourceful-impala-ehughf.com',
    password: process.env.SF_DEV_PASSWORD || 'Test@12345678',
    url: 'https://login.salesforce.com/?locale=in'
  },
  stage: {
    username: process.env.SF_STAGE_USERNAME || 'jitender.kumar@mindruby.com',
    password: process.env.SF_STAGE_PASSWORD || 'Test@12345678',
    url: 'https://login.salesforce.com/?locale=in'
  },
  prod: {
    username: process.env.SF_PROD_USERNAME || 'prod.user@mindruby.com',
    password: process.env.SF_PROD_PASSWORD || 'ProdPass@123',
    url: 'https://login.salesforce.com/?locale=in'
  }
};

const environment = environments[NODE_ENV] || environments.dev;

if (!environments[NODE_ENV]) {
  console.warn(`Unknown NODE_ENV value \"${rawNodeEnv}\"; falling back to dev.`);
}

export const salesforceUsername = environment.username;
export const salesforcePassword = environment.password;
export const salesforceUrl = environment.url;
    