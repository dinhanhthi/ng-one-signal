export const environment = {
  production: true,
  oneSignal: {
    appId: process.env['NG_APP_ONESIGNAL_APP_ID'] || '',
    safariWebId: process.env['NG_APP_ONESIGNAL_SAFARI_WEB_ID'] || ''
  }
};
