import { Component } from '@angular/core';
import { OneSignal } from 'onesignal-ngx';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-one-signal';

  constructor(private oneSignal: OneSignal) {
    this.oneSignal.init({
      appId: environment.oneSignal.appId,
      safari_web_id: environment.oneSignal.safariWebId,
      allowLocalhostAsSecureOrigin: true,
      serviceWorkerParam: { scope: '/notification/' },
      serviceWorkerPath: '/notification/OneSignalSDKWorker.js'
    }).then(async () => {
      console.log('✅ OneSignal initialized successfully!');

      // Login user with external ID whenever app opens
      try {
        await this.oneSignal.login('dinh_anh_thi');
        console.log('✅ User logged in with external ID: dinh_anh_thi');
      } catch (error) {
        console.error('❌ Failed to login user:', error);
      }

      // Check service worker registration first
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log('Service Worker registrations:', registrations.length);
        registrations.forEach((reg, index) => {
          console.log(`SW ${index}:`, {
            scope: reg.scope,
            scriptURL: reg.active?.scriptURL || 'N/A',
            state: reg.installing ? 'installing' : reg.waiting ? 'waiting' : reg.active ? 'active' : 'unknown'
          });
        });
      }

      // Set up user change listener to track subscription changes
      this.oneSignal.User.PushSubscription.addEventListener('change', (event) => {
        console.log('Push subscription changed:', event);
        console.log('New subscription ID:', this.oneSignal.User.PushSubscription.id);
        console.log('Opted in:', this.oneSignal.User.PushSubscription.optedIn);
      });

      // Check initial subscription status (will be null/undefined initially)
      const initialSubscriptionId = this.oneSignal.User.PushSubscription.id;
      console.log('Initial subscription ID (expected to be undefined):', initialSubscriptionId);

      // await this.requestNotificationPermission();
    });
  }

  onButtonClick(framework: string): void {
    console.log(framework);
    this.oneSignal.User.addTag("framework", framework);
    console.log('✅ Tag added:', framework);
  }

  async requestNotificationPermission(): Promise<void> {
    try {
      console.log('🔔 Requesting notification permission...');

      // Check if user is already subscribed
      const isSubscribed = this.oneSignal.User.PushSubscription.optedIn;
      console.log('User already subscribed:', isSubscribed);
      let subscriptionId = this.oneSignal.User.PushSubscription.id;
      console.log('User subscription id:', subscriptionId);

      if (isSubscribed) {
        console.log('✅ User is already subscribed to notifications');
        return;
      }

      // Request permission using OneSignal v5 API
      const permission = await this.oneSignal.Notifications.requestPermission();
      console.log('Permission request completed:', permission);

      // Check subscription status after permission request
      subscriptionId = this.oneSignal.User.PushSubscription.id;
      const optedIn = this.oneSignal.User.PushSubscription.optedIn;

      console.log('Subscription details:', {
        subscriptionId,
        optedIn
      });

      if (optedIn) {
        console.log('✅ Notification permission granted and subscribed');
      } else {
        console.log('❌ Notification permission denied or not subscribed');
      }

    } catch (error) {
      console.error('❌ Permission request failed:', error);

      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }

      // Check if it's the specific AbortError
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('🚨 AbortError detected - this might be a push service registration issue');
        console.error('Possible causes:');
        console.error('1. Invalid OneSignal App ID');
        console.error('2. Network connectivity issues');
        console.error('3. Browser push service limitations');
        console.error('4. Service worker registration conflicts');
      }
    }
  }
}
