/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as Api from '../api/v1';
import { Headers } from '../../../framework';
export declare const SYNC_REQUEST: Api.SmartHomeV1SyncRequest;
export declare const SYNC_RESPONSE: Api.SmartHomeV1SyncResponse;
export declare const QUERY_REQUEST: Api.SmartHomeV1QueryRequest;
export declare const QUERY_RESPONSE: Api.SmartHomeV1QueryResponse;
export declare const EXECUTE_REQUEST: Api.SmartHomeV1ExecuteRequest;
export declare const EXECUTE_RESPONSE: Api.SmartHomeV1ExecuteResponse;
export declare const EXECUTE_REQUEST_2FA_ACK: Api.SmartHomeV1ExecuteRequest;
export declare const EXECUTE_RESPONSE_2FA_ACK: Api.SmartHomeV1ExecuteResponse;
export declare const EXECUTE_REQUEST_2FA_PIN: Api.SmartHomeV1ExecuteRequest;
export declare const EXECUTE_RESPONSE_2FA_PIN_FAIL: Api.SmartHomeV1ExecuteResponse;
export declare const DISCONNECT_REQUEST: Api.SmartHomeV1DisconnectRequest;
export declare const DISCONNECT_RESPONSE: Api.SmartHomeV1DisconnectResponse;
export declare const REPORT_STATE_REQUEST: Api.SmartHomeV1ReportStateRequest;
export declare const SMART_HOME_HEADERS: Headers;
export declare const FRAMEWORK_METADATA: {
    custom: {
        request: string;
    };
};
export declare const REPORT_STATE_RESPONSE_SUCCESS: {
    requestId: string;
};
export declare const REPORT_STATE_RESPONSE_ERROR: {
    error: {
        code: number;
        message: string;
        status: string;
        details: {
            '@type': string;
            links: {
                description: string;
                url: string;
            }[];
        }[];
    };
};
