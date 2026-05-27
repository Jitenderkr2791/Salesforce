# Environment Configuration Guide
## How to Run Tests in Different Environments
### Development Environment (Default)
```bash
npx playwright test     # Uses dev environment by default
```
### Stage Environment
```bash
NODE_ENV=stage npx playwright test    # Linux / macOS
set NODE_ENV=stage && npx playwright test   # Windows CMD
$env:NODE_ENV = "stage"; npx playwright test    # Windows PowerShell
npm run test:stage    # Alternatively, use the npm script if cross-env is installed
```
### Production Environment
```bash

NODE_ENV=prod npx playwright test            # Linux / macOS 

set NODE_ENV=prod && npx playwright test      # Windows CMD

$env:NODE_ENV = "prod"; npx playwright test   # Windows PowerShell

npm run test:prod                             # Alternatively, use the npm script if cross-env is installed
```

## Environment Variables

### Dev Environment
- `SF_DEV_USERNAME` - Dev Salesforce username
- `SF_DEV_PASSWORD` - Dev Salesforce password

### Stage Environment
- `SF_STAGE_USERNAME` - Stage Salesforce username
- `SF_STAGE_PASSWORD` - Stage Salesforce password

### Prod Environment
- `SF_PROD_USERNAME` - Prod Salesforce username
- `SF_PROD_PASSWORD` - Prod Salesforce password

## Example Usage
```bash
# Run stage tests with custom credentials
NODE_ENV=stage SF_STAGE_USERNAME="stage.user@company.com" SF_STAGE_PASSWORD="mypassword" npx playwright test

# Run dev tests (uses defaults if no env vars set)
npx playwright test
```

## Configuration Structure

The `config.js` file now supports multiple environments with fallback defaults:

```javascript
const environments = {
     dev: { username: 'jk885827@resourceful-impala-ehughf.com', password: 'Test@12345678', ... },
    stage: { username: 'jitender.kumar@mindruby.com', password: 'Test@12345678', ... }
  //prod: { username: 'prod.user@mindruby.com', password: 'ProdPass@123', ... }
};
```
Each environment can have its own URL, credentials, and settings.