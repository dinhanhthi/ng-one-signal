# ng-one-signal

Example of how to use OneSignal in an Angular application.

Note that, [the official documentation](https://documentation.onesignal.com/docs/angular-setup) isn't so good.

## Environment Setup for OneSignal Configuration

This project uses environment-specific configuration to manage OneSignal credentials securely.

### Development Setup

1. **Copy the example environment file:**
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.local.ts
   ```

2. **Update the local environment file with your actual OneSignal credentials:**
   Edit `src/environments/environment.local.ts` and replace the placeholder values:
   ```typescript
   export const environment = {
     production: false,
     oneSignal: {
       appId: 'your-actual-onesignal-app-id',
       safariWebId: 'your-actual-safari-web-id'
     }
   };
   ```

3. **Run the development server:**
   ```bash
   ng serve
   ```
   This will automatically use your `environment.local.ts` file with your actual credentials.

### Production Setup

For production builds, set the following environment variables:

- `NG_APP_ONESIGNAL_APP_ID`: Your OneSignal App ID
- `NG_APP_ONESIGNAL_SAFARI_WEB_ID`: Your Safari Web ID

### File Structure

- `environment.local.ts` - Local development environment (gitignored)
- `environment.prod.ts` - Production environment (uses environment variables)
- `environment.example.ts` - Template file for new developers
- `environment.ts` - Default fallback environment

### Security

The `environment.local.ts` file is automatically ignored by git to prevent committing sensitive credentials. Only the example file and production template are tracked in version control.

### Build Configurations

- **Development** (`ng serve`): Uses `environment.local.ts` (your actual credentials)
- **Production** (`ng build --configuration production`): Uses `environment.prod.ts` with environment variables
- **Default** `environment.ts`: Contains placeholder values (safe to commit)