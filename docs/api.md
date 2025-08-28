# API

## GET /timeline

Returns merged timeline events from connected integrations such as Slack, PagerDuty, and ServiceNow.

### Query Parameters
- `start`: ISO8601 timestamp to filter events after this time.
- `end`: ISO8601 timestamp to filter events before this time.
- `providers`: Comma-separated list of providers to include (`slack`, `pagerduty`, `servicenow`).
- `category`: Filter by event category (`human` or `system`).

### Response
```json
{
  "events": [
    {
      "source": "slack",
      "timestamp": "2024-01-01T00:00:00Z",
      "description": "Message posted",
      "category": "human"
    }
  ]
}
```
