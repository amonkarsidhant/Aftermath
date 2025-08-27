# Integration Connectors

This document outlines conventions for building connectors in the `integrations` package and provides a minimal example.

## General Guidelines

- Each connector lives in `integrations/src` and is written in TypeScript.
- Implement the `Integration` interface which requires `fetchIncident` and `createAction` methods.
- Configuration such as API endpoints and tokens should be read from environment variables.
- Keep network calls asynchronous and return plain JavaScript objects.

## Sample Connector

```ts
import { Integration, Incident, Action, ActionResponse } from './types';

export class ExampleIntegration implements Integration {
  private endpoint: string;
  private token: string;

  constructor() {
    this.endpoint = process.env.EXAMPLE_ENDPOINT ?? 'https://api.example.com';
    this.token = process.env.EXAMPLE_TOKEN ?? '';
  }

  async fetchIncident(id: string): Promise<Incident> {
    // Replace with real API request
    console.log(`fetchIncident called with id=${id}`);
    return { id, source: 'Example' };
  }

  async createAction(item: Action): Promise<ActionResponse> {
    // Replace with real API request
    console.log('createAction called with', item);
    return { success: true, message: 'Action created' };
  }
}
```

Use this structure as a template when adding new connectors.
