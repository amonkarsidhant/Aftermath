import type { Plugin } from './index';

const examplePlugin: Plugin = {
  name: 'example',
  register(registry) {
    registry['greet'] = () => 'Hello from example plugin';
  },
};

export default examplePlugin;
