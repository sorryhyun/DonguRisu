import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sorryhyun.dongurisu',
  appName: 'DonguRisu',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
