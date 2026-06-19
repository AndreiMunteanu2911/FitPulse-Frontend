import type { CapacitorConfig } from "@capacitor/cli";
import {
  getAndroidDevHost,
  getAndroidDevServerUrl,
  getAppEnv,
  getProductionAppUrl,
  isProductionAppEnv,
} from "./src/config/app-env";

const appEnv = getAppEnv();
const productionUrl = getProductionAppUrl();
const devServerUrl = getAndroidDevServerUrl();
const allowNavigation = isProductionAppEnv()
  ? [
      new URL(productionUrl).host,
      "checkout.stripe.com",
      "*.stripe.com",
    ]
  : [getAndroidDevHost()];

const config: CapacitorConfig = {
  appId: "com.fitpulse.app",
  appName: "FitPulse",
  webDir: "capacitor-shell",
  backgroundColor: "#090b10",
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#090b10",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
  },
  server: {
    ...(isProductionAppEnv()
      ? {}
      : {
          url: devServerUrl,
          cleartext: true,
        }),
    allowNavigation,
  },
};

export default config;
