/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { ActionTypeRegistry } from '../action_type_registry';
import { ActionsConfigurationUtilities } from '../actions_config';
import { Logger } from '../../../../../src/core/server';

import { getActionType as getEmailActionType } from './email';
import { getActionType as getIndexActionType } from './es_index';
import { getActionType as getPagerDutyActionType } from './pagerduty';
import { getActionType as getSwimlaneActionType } from './swimlane';
import { getActionType as getServerLogActionType } from './server_log';
import { getActionType as getSlackActionType } from './slack';
import { getActionType as getWebhookActionType } from './webhook';
import { getActionType as getServiceNowActionType } from './servicenow';
import { getActionType as getJiraActionType } from './jira';
import { getActionType as getResilientActionType } from './resilient';
import { getActionType as getTeamsActionType } from './teams';

export function registerBuiltInActionTypes({
  actionsConfigUtils: configurationUtilities,
  actionTypeRegistry,
  logger,
  publicBaseUrl,
}: {
  actionsConfigUtils: ActionsConfigurationUtilities;
  actionTypeRegistry: ActionTypeRegistry;
  logger: Logger;
  publicBaseUrl?: string;
}) {
  actionTypeRegistry.register(
    getEmailActionType({ logger, configurationUtilities, publicBaseUrl })
  );
  actionTypeRegistry.register(getIndexActionType({ logger }));
  actionTypeRegistry.register(getPagerDutyActionType({ logger, configurationUtilities }));
  actionTypeRegistry.register(getSwimlaneActionType({ logger, configurationUtilities }));
  actionTypeRegistry.register(getServerLogActionType({ logger }));
  actionTypeRegistry.register(getSlackActionType({ logger, configurationUtilities }));
  actionTypeRegistry.register(getWebhookActionType({ logger, configurationUtilities }));
  actionTypeRegistry.register(getServiceNowActionType({ logger, configurationUtilities }));
  actionTypeRegistry.register(getJiraActionType({ logger, configurationUtilities }));
  actionTypeRegistry.register(getResilientActionType({ logger, configurationUtilities }));
  actionTypeRegistry.register(getTeamsActionType({ logger, configurationUtilities }));
}
