# Creating Plugins

Plugins let you extend Aftermath without modifying core code. To add a plugin:

1. Create a new `.ts` file inside the `plugins/` directory.
2. Export a default object that implements the `Plugin` interface described in `plugins/README.md`.
3. Inside the `register` function, attach any values or functions to the provided registry object.
4. Run the loader to verify your plugin registers correctly:

```bash
# from the repository root
backend/node_modules/.bin/ts-node plugins/index.ts
```

The example plugin `plugins/examplePlugin.ts` registers a `greet` function. When the loader runs, it outputs the message returned by this function.
