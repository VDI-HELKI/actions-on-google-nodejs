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
const lambda_1 = require("../lambda");
const test = ava_1.default;
test.beforeEach(t => {
    t.context.lambda = new lambda_1.Lambda();
});
test('checks against valid mock request', t => {
    t.true(t.context.lambda.check({}, {
        succeed() { },
    }, (e, body) => {
    }));
});
test('checks against invalid context', t => {
    t.false(t.context.lambda.check({}, {
    // tslint:disable-next-line:no-any mocking context
    }, (e, body) => {
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
    t.context.lambda.handle((body, headers) => {
        t.deepEqual(body, sentBody);
        t.deepEqual(headers, sentHeaders);
        promise = Promise.resolve({
            body: expectedBody,
            status: expectedStatus,
        });
        return promise;
    })({
        body: JSON.stringify(sentBody),
        headers: sentHeaders,
    }, {
        succeed() { },
    }, (e, body) => {
        receivedStatus = body.statusCode;
        receivedBody = body.body;
    });
    yield promise;
    yield new Promise(resolve => setTimeout(resolve));
    // tslint:disable-next-line:no-any change to string even if null
    t.deepEqual(JSON.parse(receivedBody), expectedBody);
    t.is(receivedStatus, expectedStatus);
}));
test('converts headers to lower', (t) => __awaiter(this, void 0, void 0, function* () {
    const expectedBody = {
        prop: true,
    };
    const expectedStatus = 123;
    const sentBody = {
        a: '1',
    };
    const sentHeaders = {
        Key: 'value',
    };
    let receivedBody = null;
    let receivedStatus = -1;
    let promise = null;
    t.context.lambda.handle((body, headers) => {
        t.deepEqual(body, sentBody);
        t.deepEqual(headers, {
            key: 'value',
        });
        promise = Promise.resolve({
            body: expectedBody,
            status: expectedStatus,
        });
        return promise;
    })({
        body: JSON.stringify(sentBody),
        headers: sentHeaders,
    }, {
        succeed() { },
    }, (e, body) => {
        receivedStatus = body.statusCode;
        receivedBody = body.body;
    });
    yield promise;
    yield new Promise(resolve => setTimeout(resolve));
    // tslint:disable-next-line:no-any change to string even if null
    t.deepEqual(JSON.parse(receivedBody), expectedBody);
    t.is(receivedStatus, expectedStatus);
}));
test.serial('handles error', (t) => __awaiter(this, void 0, void 0, function* () {
    const expectedError = new Error('test');
    const sentBody = {
        a: '1',
    };
    const sentHeaders = {
        key: 'value',
    };
    let receivedError = null;
    let promise = null;
    const stub = sinon.stub(common, 'error');
    t.context.lambda.handle((body, headers) => {
        t.deepEqual(body, sentBody);
        t.deepEqual(headers, sentHeaders);
        promise = Promise.reject(expectedError);
        return promise;
    })({
        body: JSON.stringify(sentBody),
        headers: sentHeaders,
    }, {
        succeed() { },
    }, (e) => {
        receivedError = e;
    });
    // tslint:disable-next-line:no-any mocking promise
    yield promise.catch(() => { });
    yield new Promise(resolve => setTimeout(resolve));
    t.true(stub.called);
    stub.restore();
    t.is(receivedError, expectedError);
}));
test.serial('handles string error', (t) => __awaiter(this, void 0, void 0, function* () {
    const expectedError = 'test';
    const sentBody = {
        a: '1',
    };
    const sentHeaders = {
        key: 'value',
    };
    let receivedError = null;
    let promise = null;
    const stub = sinon.stub(common, 'error');
    t.context.lambda.handle((body, headers) => {
        t.deepEqual(body, sentBody);
        t.deepEqual(headers, sentHeaders);
        promise = Promise.reject(expectedError);
        return promise;
    })({
        body: JSON.stringify(sentBody),
        headers: sentHeaders,
    }, {
        succeed() { },
    }, (e) => {
        receivedError = e;
    });
    // tslint:disable-next-line:no-any mocking promise
    yield promise.catch(() => { });
    yield new Promise(resolve => setTimeout(resolve));
    t.true(stub.called);
    stub.restore();
    t.is(receivedError, expectedError);
}));
test('handles valid headers fine', (t) => __awaiter(this, void 0, void 0, function* () {
    const expectedHeaders = {
        header1: 'header2',
    };
    const expectedStatus = 123;
    let receivedHeaders = null;
    let receivedStatus = -1;
    let promise = null;
    t.context.lambda.handle((body, headers) => {
        promise = Promise.resolve({
            body: {},
            status: expectedStatus,
            headers: expectedHeaders,
        });
        return promise;
    })({
        body: JSON.stringify({}),
        headers: {},
    }, {
        succeed() { },
    }, (e, body) => {
        receivedStatus = body.statusCode;
        receivedHeaders = body.headers;
    });
    yield promise;
    yield new Promise(resolve => setTimeout(resolve));
    // tslint:disable-next-line:no-any change to string even if null
    t.is(receivedStatus, expectedStatus);
    t.is(receivedHeaders, expectedHeaders);
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
    const event = {
        body: JSON.stringify(sentBody),
        headers: sentHeaders,
    };
    // tslint:disable-next-line:no-any mocking context
    const context = {
        succeed() { },
    };
    t.context.lambda.handle((body, headers, metadata) => {
        t.deepEqual(body, sentBody);
        t.deepEqual(headers, sentHeaders);
        t.is(metadata.lambda.event, event);
        t.is(metadata.lambda.context, context);
        promise = Promise.resolve({
            body: expectedBody,
            status: expectedStatus,
        });
        return promise;
    })(event, context, (e, body) => {
        receivedStatus = body.statusCode;
        receivedBody = body.body;
    });
    yield promise;
    yield new Promise(resolve => setTimeout(resolve));
    // tslint:disable-next-line:no-any change to string even if null
    t.deepEqual(JSON.parse(receivedBody), expectedBody);
    t.is(receivedStatus, expectedStatus);
}));
test('returns back correctly when only the body is received', (t) => __awaiter(this, void 0, void 0, function* () {
    const expectedBody = {
        prop: true,
    };
    const expectedStatus = 123;
    const sentBody = {
        a: '1',
    };
    let receivedBody = null;
    let receivedStatus = -1;
    let promise = null;
    t.context.lambda.handle((body, headers) => {
        t.deepEqual(body, sentBody);
        t.deepEqual(headers, {});
        promise = Promise.resolve({
            body: expectedBody,
            status: expectedStatus,
        });
        return promise;
    })(sentBody, {
        succeed() { },
    }, (e, body) => {
        receivedStatus = body.statusCode;
        receivedBody = body.body;
    });
    yield promise;
    yield new Promise(resolve => setTimeout(resolve));
    // tslint:disable-next-line:no-any change to string even if null
    t.deepEqual(JSON.parse(receivedBody), expectedBody);
    t.is(receivedStatus, expectedStatus);
}));
test('parses body if it is an object', (t) => __awaiter(this, void 0, void 0, function* () {
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
    t.context.lambda.handle((body, headers) => {
        t.deepEqual(body, sentBody);
        t.deepEqual(headers, sentHeaders);
        promise = Promise.resolve({
            body: expectedBody,
            status: expectedStatus,
        });
        return promise;
    })({
        body: sentBody,
        headers: sentHeaders,
    }, {
        succeed() { },
    }, (e, body) => {
        receivedStatus = body.statusCode;
        receivedBody = body.body;
    });
    yield promise;
    yield new Promise(resolve => setTimeout(resolve));
    // tslint:disable-next-line:no-any change to string even if null
    t.deepEqual(JSON.parse(receivedBody), expectedBody);
    t.is(receivedStatus, expectedStatus);
}));
//# sourceMappingURL=lambda.test.js.map