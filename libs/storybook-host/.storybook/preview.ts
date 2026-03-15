import type { Preview } from '@storybook/angular';
import '../../util/styles/src/index.scss';

const preview: Preview = {
  parameters: {
    // Accessibility: axe-core runs via addon-a11y
    a11y: {
      config: {},
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'best-practice'],
        },
      },
    },
    // Respect user preferences (project context: prefers-reduced-motion, prefers-color-scheme)
    layout: 'centered',
  },
};

export default preview;
