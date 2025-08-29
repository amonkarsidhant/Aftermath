import {
  Integration,
  defaultPushPostmortem,
  defaultPollActionStatus,
} from './types';
import { ServiceNowIntegration } from './serviceNow';
import { PagerDutyIntegration } from './pagerDuty';
import { JiraIntegration } from './jira';
import { SlackIntegration } from './slack';

export function createIntegrations(): Record<string, Integration> {
  const integrations: Record<string, Integration> = {};

  const applyDefaults = (i: Integration): Integration => {
    i.pushPostmortem ??= defaultPushPostmortem;
    i.pollActionStatus ??= defaultPollActionStatus;
    return i;
  };

  if (process.env.SERVICENOW_TOKEN) {
    integrations.servicenow = applyDefaults(new ServiceNowIntegration());
  }

  if (process.env.PAGERDUTY_TOKEN) {
    integrations.pagerduty = applyDefaults(new PagerDutyIntegration());
  }

  if (process.env.JIRA_TOKEN) {
    integrations.jira = applyDefaults(new JiraIntegration());
  }

  if (process.env.SLACK_TOKEN) {
    integrations.slack = applyDefaults(new SlackIntegration());
  }

  return integrations;
}

export { ServiceNowIntegration, PagerDutyIntegration, JiraIntegration, SlackIntegration };
export * from './types';
