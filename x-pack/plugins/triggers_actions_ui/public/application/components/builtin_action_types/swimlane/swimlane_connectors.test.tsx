/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React from 'react';
import { mountWithIntl, nextTick } from '@kbn/test/jest';
import { act } from 'react-dom/test-utils';
import { SwimlaneActionConnector } from '../types';
import SwimlaneActionConnectorFields from './swimlane_connectors';

describe('SwimlaneActionConnectorFields renders', () => {
  test('all connector fields is rendered', async () => {
    const actionConnector = {
      secrets: {
        apiToken: 'test',
      },
      id: 'test',
      actionTypeId: '.swimlane',
      name: 'swimlane',
      config: {
        apiUrl: 'http:\\test',
        appId: '1234567asbd32',
        username: 'username',
      },
    } as SwimlaneActionConnector;

    const wrapper = mountWithIntl(
      <SwimlaneActionConnectorFields
        action={actionConnector}
        errors={{ index: [], apiToken: [] }}
        editActionConfig={() => {}}
        editActionSecrets={() => {}}
        readOnly={false}
      />
    );

    await act(async () => {
      await nextTick();
      wrapper.update();
    });

    expect(wrapper.find('[data-test-subj="swimlaneApiUrlInput"]').length > 0).toBeTruthy();
    expect(wrapper.find('[data-test-subj="swimlaneApiUrlInput"]').first().prop('value')).toBe(
      'http:\\test'
    );
    expect(wrapper.find('[data-test-subj="swimlaneAppIdInput"]').length > 0).toBeTruthy();
    expect(wrapper.find('[data-test-subj="swimlaneUsernameInput"]').length > 0).toBeTruthy();
    expect(wrapper.find('[data-test-subj="swimlaneApiTokenInput"]').length > 0).toBeTruthy();
  });

  test('should display a message on create to remember credentials', () => {
    const actionConnector = {
      actionTypeId: '.swimlane',
      secrets: {},
      config: {},
    } as SwimlaneActionConnector;

    const wrapper = mountWithIntl(
      <SwimlaneActionConnectorFields
        action={actionConnector}
        errors={{ index: [], apiToken: [] }}
        editActionConfig={() => {}}
        editActionSecrets={() => {}}
        readOnly={false}
      />
    );
    expect(wrapper.find('[data-test-subj="rememberValuesMessage"]').length).toBeGreaterThan(0);
    expect(wrapper.find('[data-test-subj="reenterValuesMessage"]').length).toEqual(0);
  });

  test('should display a message on edit to re-enter credentials', () => {
    const actionConnector = {
      secrets: {
        apiToken: 'test',
      },
      id: 'test',
      actionTypeId: '.swimlane',
      name: 'swimlane',
      config: {
        apiUrl: 'http:\\test',
        appId: '1234567asbd32',
        username: 'username',
      },
    } as SwimlaneActionConnector;

    const wrapper = mountWithIntl(
      <SwimlaneActionConnectorFields
        action={actionConnector}
        errors={{ index: [], apiToken: [] }}
        editActionConfig={() => {}}
        editActionSecrets={() => {}}
        readOnly={false}
      />
    );
    expect(wrapper.find('[data-test-subj="reenterValuesMessage"]').length).toBeGreaterThan(0);
    expect(wrapper.find('[data-test-subj="rememberValuesMessage"]').length).toEqual(0);
  });
});
