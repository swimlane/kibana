/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { shallowWithIntl } from '@kbn/test/jest';
import { PingList } from '../ping_list';
import { Ping, PingsResponse } from '../../../../../common/runtime_types';
import { ExpandedRowMap } from '../../../overview/monitor_list/types';
import { rowShouldExpand, toggleDetails } from '../columns/expand_row';
import * as pingListHook from '../use_pings';
import { mockReduxHooks } from '../../../../lib/helper/test_helpers';

mockReduxHooks();

describe('PingList component', () => {
  let response: PingsResponse;

  beforeAll(() => {
    response = {
      total: 9231,
      pings: [
        {
          docId: 'fewjio21',
          timestamp: '2019-01-28T17:47:08.078Z',
          error: {
            message: 'dial tcp 127.0.0.1:9200: connect: connection refused',
            type: 'io',
          },
          monitor: {
            duration: { us: 1430 },
            id: 'auto-tcp-0X81440A68E839814F',
            ip: '127.0.0.1',
            name: '',
            status: 'down',
            type: 'tcp',
          },
        },
        {
          docId: 'fewjoo21',
          timestamp: '2019-01-28T17:47:09.075Z',
          error: {
            message: 'dial tcp 127.0.0.1:9200: connect: connection refused',
            type: 'io',
          },
          monitor: {
            duration: { us: 1370 },
            id: 'auto-tcp-0X81440A68E839814D',
            ip: '127.0.0.1',
            name: '',
            status: 'down',
            type: 'tcp',
          },
        },
      ],
    };

    jest.spyOn(pingListHook, 'usePingsList').mockReturnValue({
      ...response,
      error: undefined,
      loading: false,
      failedSteps: { steps: [], checkGroup: '1-f-4d-4f' },
    });
  });

  it('renders sorted list without errors', () => {
    const component = shallowWithIntl(<PingList />);
    expect(component).toMatchSnapshot();
  });

  describe('toggleDetails', () => {
    let itemIdToExpandedRowMap: ExpandedRowMap;
    let pings: Ping[];

    const setItemIdToExpandedRowMap = (update: ExpandedRowMap) => (itemIdToExpandedRowMap = update);

    beforeEach(() => {
      itemIdToExpandedRowMap = {};
      pings = response.pings;
    });

    it('should expand an item if empty', () => {
      const ping = pings[0];
      toggleDetails(ping, itemIdToExpandedRowMap, setItemIdToExpandedRowMap);
      expect(itemIdToExpandedRowMap).toMatchInlineSnapshot(`
        Object {
          "fewjio21": <PingListExpandedRowComponent
            ping={
              Object {
                "docId": "fewjio21",
                "error": Object {
                  "message": "dial tcp 127.0.0.1:9200: connect: connection refused",
                  "type": "io",
                },
                "monitor": Object {
                  "duration": Object {
                    "us": 1430,
                  },
                  "id": "auto-tcp-0X81440A68E839814F",
                  "ip": "127.0.0.1",
                  "name": "",
                  "status": "down",
                  "type": "tcp",
                },
                "timestamp": "2019-01-28T17:47:08.078Z",
              }
            }
          />,
        }
      `);
    });

    it('should un-expand an item if clicked again', () => {
      const ping = pings[0];
      toggleDetails(ping, itemIdToExpandedRowMap, setItemIdToExpandedRowMap);
      toggleDetails(ping, itemIdToExpandedRowMap, setItemIdToExpandedRowMap);
      expect(itemIdToExpandedRowMap).toEqual({});
    });

    it('should expand the new row and close the old when when a new row is clicked', () => {
      const pingA = pings[0];
      const pingB = pings[1];
      toggleDetails(pingA, itemIdToExpandedRowMap, setItemIdToExpandedRowMap);
      toggleDetails(pingB, itemIdToExpandedRowMap, setItemIdToExpandedRowMap);
      expect(pingA.docId).not.toEqual(pingB.docId);
      expect(itemIdToExpandedRowMap[pingB.docId]).toMatchInlineSnapshot(`
        <PingListExpandedRowComponent
          ping={
            Object {
              "docId": "fewjoo21",
              "error": Object {
                "message": "dial tcp 127.0.0.1:9200: connect: connection refused",
                "type": "io",
              },
              "monitor": Object {
                "duration": Object {
                  "us": 1370,
                },
                "id": "auto-tcp-0X81440A68E839814D",
                "ip": "127.0.0.1",
                "name": "",
                "status": "down",
                "type": "tcp",
              },
              "timestamp": "2019-01-28T17:47:09.075Z",
            }
          }
        />
      `);
    });

    describe('rowShouldExpand', () => {
      // TODO: expand for all cases
      it('returns true for browser monitors', () => {
        const ping = pings[0];
        ping.monitor.type = 'browser';
        expect(rowShouldExpand(ping)).toBe(true);
      });
    });
  });
});
