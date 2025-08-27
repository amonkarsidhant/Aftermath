import { Integration } from './types';
import { ServiceNowIntegration } from './serviceNow';
import { PagerDutyIntegration } from './pagerDuty';
import { JiraIntegration } from './jira';
import { SlackIntegration } from './slack';

export function createIntegrations(): Record<string, Integration> {
  const integrations: Record<string, Integration> = {};

  if (process.env.SERVICENOW_TOKEN) {
    integrations.servicenow = new ServiceNowIntegration();
  }

  if (process.env.PAGERDUTY_TOKEN) {
    integrations.pagerduty = new PagerDutyIntegration();
  }

  if (process.env.JIRA_TOKEN) {
    integrations.jira = new JiraIntegration();
  }

  if (process.env.SLACK_TOKEN) {
    integrations.slack = new SlackIntegration();
  }

  return integrations;
}

export { ServiceNowIntegration, PagerDutyIntegration, JiraIntegration, SlackIntegration };
export * from './types';
