"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const sinon = require("sinon");
const common = require("../../common");
const express_1 = require("../express");
const test = ava_1.default;
test.beforeEach(t => {
    t.context.express = new express_1.Express();
});
test('checks against valid mock request', t => {
    t.true(t.context.express.check({
        get() { },
    }, {
        status(status) { },
        send(body) { },
    }));
});
test('checks against invalid mock Express request', t => {
    t.false(t.context.express.check({
    // tslint:disable-next-line:no-any mocking request
    }, {
        status(status) { },
        send(body) { },
    }));
});
test('handles valid body fine', (t) => __awaiter(this, void 0, void 0, function* () {
    const expectedBody = {
        prop: true,
    };
    const expectedStatus = 123;
    const sentBody = {
        a: '1',
    };
    const sentHeaders = {
        key: 'value',
    };
    let receivedBody = null;
    let receivedStatus = -1;
    let promise = null;
    t.context.express.handle((body, headers) => {
        t.is(body, sentBody);
        t.is(headers, sentHeaders);
        promise = Promise.resolve({
            body: expectedBody,
            status: expectedStatus,
        });
        return promise;
    })({
        body: sentBody,
        headers: sentHeaders,
        get() { },
    }, {
        status(status) {
            receivedStatus = status;
            return this;
        },
        send(body) {
            receivedBody = body;
            return this;
        },
    });
    yield promise;
    t.is(receivedBody, expectedBody);
    t.is(receivedStatus, expectedStatus);
}));
test.serial('handles error', (t) => __awaiter(this, void 0, void 0, function* () {
    const expectedError = new Error('test');
    const expectedBody = {
        error: expectedError.message,
    };
    const expectedStatus = 500;
    const sentBody = {
        a: '1',
    };
    const sentHeaders = {
        key: 'value',
    };
    let receivedStatus = -1;
    let receivedBody = null;
    let promise = null;
    const stub = sinon.stub(common, 'error');
    t.context.express.handle((body, headers) => {
        t.is(body, sentBody);
        t.is(headers, sentHeaders);
        promise = Promise.reject(expectedError);
        return promise;
    })({
        body: sentBody,
        headers: sentHeaders,
        get() { },
    }, {
        status(status) {
            receivedStatus = status;
            return this;
        },
        send(body) {
            receivedBody = body;
            return this;
        },
    });
    // tslint:disable-next-line:no-any mocking promise
    yield promise.catch(() => { });
    t.true(stub.called);
    stub.restore();
    t.deepEqual(receivedBody, expectedBody);
    t.is(receivedStatus, expectedStatus);
}));
test.serial('handles string error', (t) => __awaiter(this, void 0, void 0, function* () {
    const expectedError = 'test';
    const expectedBody = {
        error: expectedError,
    };
    const expectedStatus = 500;
    const sentBody = {
        a: '1',
    };
    const sentHeaders = {
        key: 'value',
    };
    let receivedStatus = -1;
    let receivedBody = null;
    let promise = null;
    const stub = sinon.stub(common, 'error');
    t.context.express.handle((body, headers) => {
        t.is(body, sentBody);
        t.is(headers, sentHeaders);
        promise = Promise.reject(expectedError);
        return promise;
    })({
        body: sentBody,
        headers: sentHeaders,
        get() { },
    }, {
        status(status) {
            receivedStatus = status;
            return this;
        },
        send(body) {
            receivedBody = body;
            return this;
        },
    });
    // tslint:disable-next-line:no-any mocking promise
    yield promise.catch(() => { });
    t.true(stub.called);
    stub.restore();
    t.deepEqual(receivedBody, expectedBody);
    t.is(receivedStatus, expectedStatus);
}));
test('handles valid headers fine', (t) => __awaiter(this, void 0, void 0, function* () {
    const expectedHeaders = {
        header1: 'header2',
    };
    const expectedStatus = 123;
    const receivedHeaders = {};
    let receivedStatus = -1;
    let promise = null;
    t.context.express.handle((body, headers) => {
        promise = Promise.resolve({
            body: {},
            status: expectedStatus,
            headers: expectedHeaders,
        });
        return promise;
    })({
        body: {},
        headers: {},
        get() { },
    }, {
        status(status) {
            receivedStatus = status;
            return this;
        },
        setHeader(key, value) {
            receivedHeaders[key] = value;
        },
        send() {
            return this;
        },
    });
    yield promise;
    t.is(receivedStatus, expectedStatus);
    t.deepEqual(receivedHeaders, expectedHeaders);
}));
test('sends back metadata', (t) => __awaiter(this, void 0, void 0, function* () {
    const expectedBody = {
        prop: true,
    };
    const expectedStatus = 123;
    const sentBody = {
        a: '1',
    };
    const sentHeaders = {
        key: 'value',
    };
    let receivedBody = null;
    let receivedStatus = -1;
    let promise = null;
    // tslint:disable-next-line:no-any mocking request
    const request = {
        body: sentBody,
        headers: sentHeaders,
        get() { },
    };
    // tslint:disable-next-line:no-any mocking response
    const response = {
        status(status) {
            receivedStatus = status;
            return this;
        },
        send(body) {
            receivedBody = body;
            return this;
        },
    };
    t.context.express.handle((body, headers, metadata) => {
        t.is(metadata.express.request, request);
        t.is(metadata.express.response, response);
        t.is(body, sentBody);
        t.is(headers, sentHeaders);
        promise = Promise.resolve({
            body: expectedBody,
            status: expectedStatus,
        });
        return promise;
    })(request, response);
    yield promise;
    t.is(receivedBody, expectedBody);
    t.is(receivedStatus, expectedStatus);
}));
//# sourceMappingURL=express.test.js.map