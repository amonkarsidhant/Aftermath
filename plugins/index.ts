import { readdir } from 'fs/promises';
import path from 'path';

export interface Plugin {
  name: string;
  register: (registry: PluginRegistry) => void;
}

export type PluginRegistry = Record<string, unknown>;

export async function loadPlugins(registry: PluginRegistry = {}): Promise<PluginRegistry> {
  const files = await readdir(__dirname);
  for (const file of files) {
    if (file === 'index.ts' || file === 'index.js') continue;
    if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;
    const modulePath = path.join(__dirname, file);
    const { default: plugin } = await import(modulePath);
    if (plugin && typeof plugin.register === 'function') {
      plugin.register(registry);
    }
  }
  return registry;
}

if (require.main === module) {
  loadPlugins().then((registry) => {
    // Demonstrate usage of registered values/functions
    for (const [key, value] of Object.entries(registry)) {
      if (typeof value === 'function') {
        console.log(`${key}:`, (value as () => unknown)());
      } else {
        console.log(`${key}:`, value);
      }
    }
  });
}
