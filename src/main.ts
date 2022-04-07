import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import '/@/design/index.less';
import 'virtual:windi-utilities.css';
// Register icon sprite
import 'virtual:svg-icons-register';
// @ts-ignore
import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '/@/logics/initAppConfig';
import { setupErrorHandle } from '/@/logics/error-handle';
import { router, setupRouter } from '/@/router';
import { setupRouterGuard } from '/@/router/guard';
import { setupStore } from '/@/store';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';
import { registerGlobComp } from '/@/components/registerGlobComp';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { setFingerprint } from '/@/utils/auth';

// const dev = true;
//
// (function () {
//   if (!dev) {
//     // @ts-ignore
//     console.log = new Function();
//     // @ts-ignore
//     console.info = new Function();
//   }
// })();

async function bootstrap() {
  if (location.hash.startsWith('#/module/')) {
    location.href = '#/dashboard';
  }

  const fpPromise = FingerprintJS.load();
  await (async () => {
    const fp = await fpPromise;
    const result = await fp.get();
    setFingerprint(result.visitorId);
  })();

  const app = createApp(App);

  // Configure store
  setupStore(app);

  // Initialize internal system configuration
  initAppConfigStore();

  // Register global components
  registerGlobComp(app);

  // Multilingual configuration
  // Asynchronous case: language files may be obtained from the server side
  await setupI18n(app);

  // Configure routing
  setupRouter(app);

  // router-guard
  setupRouterGuard(router);

  // Register global directive
  setupGlobDirectives(app);

  // Configure global error handling
  setupErrorHandle(app);

  // https://next.router.vuejs.org/api/#isready
  // await router.isReady();
  app.mount('#app');
}
bootstrap();
