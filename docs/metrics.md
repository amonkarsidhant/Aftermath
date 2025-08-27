# Metrics API

The `/metrics` endpoint exposes system and team performance statistics.

```
GET /metrics
```

## Response

```json
{
  "metrics": {
    "percentPostmortemsCompleted": 50.0,
    "percentActionsClosed": 66.67,
    "avgTimeToPostmortemHours": 24,
    "avgTimeToCloseActionsHours": 1,
    "teamMetrics": {
      "Database": {
        "percentPostmortemsCompleted": 100,
        "percentActionsClosed": 50,
        "avgTimeToPostmortemHours": 24,
        "avgTimeToCloseActionsHours": 1
      },
      "Networking": {
        "percentPostmortemsCompleted": 0,
        "percentActionsClosed": 100,
        "avgTimeToPostmortemHours": 0,
        "avgTimeToCloseActionsHours": 1
      }
    }
  }
}
```

### Fields

- `percentPostmortemsCompleted` – percentage of incidents that have a completed postmortem.
- `percentActionsClosed` – percentage of actions that are closed.
- `avgTimeToPostmortemHours` – average hours from incident creation to postmortem completion.
- `avgTimeToCloseActionsHours` – average hours from action creation to closure.
- `teamMetrics` – object keyed by team name containing the above metrics for each team.
