# Plugin Interface

Plugins extend Aftermath by exporting a default object that matches the `Plugin` interface. Each plugin is placed in this directory and will be loaded automatically.

```ts
export interface Plugin {
  /** Unique name used to identify the plugin */
  name: string;
  /** Called by the loader to let the plugin register itself */
  register: (registry: PluginRegistry) => void;
}

export type PluginRegistry = Record<string, unknown>;
```

The `registry` object is shared between all plugins. Plugins can attach any values or functions to it for the application to consume.

## Creating a Plugin
1. Create a new `.ts` file in this folder.
2. Export a default object that implements `Plugin`.
3. Attach your features to the provided registry inside the `register` function.

See `examplePlugin.ts` for a working example.
