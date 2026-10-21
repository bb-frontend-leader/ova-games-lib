import { defineConfig } from 'unocss';

import { presetOVA } from './src/shared/theme/preset-ova'

export default defineConfig({
  presets: [presetOVA()]
});
