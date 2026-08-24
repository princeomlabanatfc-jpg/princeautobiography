import tailwindcss from '@tailwindcss/postcss';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [
    tailwindcss(),
    postcssPresetEnv({
      stage: 2,
      features: {
        'cascade-layers': true,
        'oklab-function': true,
        'color-mix': true,
      },
      browsers: 'defaults, chrome >= 60, android >= 6, safari >= 12, edge >= 79, firefox >= 60',
    }),
  ],
};
