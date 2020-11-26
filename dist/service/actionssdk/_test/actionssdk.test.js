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
const actionssdk_1 = require("../actionssdk");
const google_auth_library_1 = require("google-auth-library");
const common_1 = require("../../../common");
const conversation_1 = require("../conversation");
const CONVERSATION_ID = '1234';
const USER_ID = 'abcd';
function buildRequest(convType, intent, data) {
    const appRequest = {
        conversation: {
            conversationId: CONVERSATION_ID,
            type: convType,
            conversationToken: data,
        },
        user: {
            userId: USER_ID,
            locale: 'en_US',
        },
        inputs: [
            {
                intent,
                rawInputs: [
                    {
                        inputType: 'KEYBOARD',
                        query: 'Talk to my test app',
                    },
                ],
            },
        ],
        surface: {
            capabilities: [
                {
                    name: 'actions.capability.SCREEN_OUTPUT',
                },
                {
                    name: 'actions.capability.MEDIA_RESPONSE_AUDIO',
                },
                {
                    name: 'actions.capability.WEB_BROWSER',
                },
                {
                    name: 'actions.capability.AUDIO_OUTPUT',
                },
            ],
        },
        availableSurfaces: [
            {
                capabilities: [
                    {
                        name: 'actions.capability.SCREEN_OUTPUT',
                    },
                    {
                        name: 'actions.capability.AUDIO_OUTPUT',
                    },
                ],
            },
        ],
    };
    return appRequest;
}
ava_1.default('intent handler is invoked', (t) => {
    const app = actionssdk_1.actionssdk();
    let invoked = false;
    app.intent('intent.foo', (conv) => {
        invoked = true;
        return conv.ask('hello');
    });
    const promise = app.handler(buildRequest('NEW', 'intent.foo'), {});
    return promise.then((result) => {
        t.is(result.status, 200);
        t.true(invoked);
    });
});
ava_1.default('fallback handler is invoked', t => {
    const app = actionssdk_1.actionssdk();
    let intentInvoked = false;
    let fallbackInvoked = false;
    app.intent('intent.foo', (conv) => {
        intentInvoked = true;
        return conv.ask('hello');
    });
    app.intent('intent.bar', (conv) => {
        intentInvoked = true;
        return conv.ask('hello');
    });
    app.fallback((conv) => {
        fallbackInvoked = true;
        return conv.ask('fallback');
    });
    const promise = app.handler(buildRequest('NEW', 'some.other.intent'), {});
    return promise.then((result) => {
        t.is(result.status, 200);
        t.false(intentInvoked);
        t.true(fallbackInvoked);
    });
});
ava_1.default('middleware is used', t => {
    const app = actionssdk_1.actionssdk();
    let middlewareUsed = false;
    app.intent('intent.foo', (conv) => {
        return conv.close('hello');
    });
    app.use(() => {
        middlewareUsed = true;
    });
    const promise = app.handler(buildRequest('NEW', 'intent.foo'), {});
    return promise.then((result) => {
        t.is(result.status, 200);
        t.true(middlewareUsed);
    });
});
ava_1.default('app.intent using array sets intent handlers for each', t => {
    const app = actionssdk_1.actionssdk();
    const intents = ['intent1', 'intent2'];
    const handler = conv => {
    };
    app.intent(intents, handler);
    t.is(app._handlers.intents[intents[0]], handler);
    t.is(app._handlers.intents[intents[1]], handler);
});
ava_1.default('auth config is set correctly with clientId', t => {
    const id = 'test';
    const app = actionssdk_1.actionssdk({
        clientId: id,
    });
    t.true(app._client instanceof google_auth_library_1.OAuth2Client);
    t.is(app.auth.client.id, id);
});
ava_1.default('auth config is not set with no clientId', t => {
    const app = actionssdk_1.actionssdk();
    t.is(typeof app._client, 'undefined');
    t.is(typeof app.auth, 'undefined');
});
ava_1.default('app gives middleware framework metadata', (t) => __awaiter(this, void 0, void 0, function* () {
    const metadata = {
        custom: {
            request: 'test',
        },
    };
    const response = 'abcdefg1234567';
    let called = false;
    const middleware = (conv, framework) => {
        called = true;
        t.is(framework, metadata);
    };
    const app = actionssdk_1.actionssdk();
    app._middlewares.push(middleware);
    app.fallback(conv => {
        conv.ask(response);
    });
    yield app.handler(buildRequest('NEW', 'intent.foo'), {}, metadata);
    t.true(called);
}));
ava_1.default('app uses async middleware using Object.assign', (t) => __awaiter(this, void 0, void 0, function* () {
    const response = 'abcdefg1234567';
    const middleware = (conv) => __awaiter(this, void 0, void 0, function* () {
        return Object.assign(conv, {
            test() {
                conv.ask(response);
            },
        });
    });
    const app = actionssdk_1.actionssdk();
    app._middlewares.push(middleware);
    app.fallback(conv => {
        conv.test();
    });
    const res = yield app.handler({}, {});
    t.is(res.status, 200);
    t.deepEqual(common_1.clone(res.body), {
        expectUserResponse: true,
        expectedInputs: [
            {
                inputPrompt: {
                    richInitialPrompt: {
                        items: [
                            {
                                simpleResponse: {
                                    textToSpeech: response,
                                },
                            },
                        ],
                    },
                },
                possibleIntents: [
                    {
                        intent: 'actions.intent.TEXT',
                    },
                ],
            },
        ],
    });
}));
ava_1.default('app uses async middleware returning void', (t) => __awaiter(this, void 0, void 0, function* () {
    const response = 'abcdefg1234567';
    const middleware = (conv) => __awaiter(this, void 0, void 0, function* () {
        conv
            .test = () => conv.ask(response);
    });
    const app = actionssdk_1.actionssdk();
    app._middlewares.push(middleware);
    app.fallback(conv => {
        conv.test();
    });
    const res = yield app.handler({}, {});
    t.is(res.status, 200);
    t.deepEqual(common_1.clone(res.body), {
        expectUserResponse: true,
        expectedInputs: [
            {
                inputPrompt: {
                    richInitialPrompt: {
                        items: [
                            {
                                simpleResponse: {
                                    textToSpeech: response,
                                },
                            },
                        ],
                    },
                },
                possibleIntents: [
                    {
                        intent: 'actions.intent.TEXT',
                    },
                ],
            },
        ],
    });
}));
ava_1.default('app uses async middleware returning promise', (t) => __awaiter(this, void 0, void 0, function* () {
    const response = 'abcdefg1234567';
    const middleware = conv => Promise.resolve(Object.assign(conv, {
        test() {
            conv.ask(response);
        },
    }));
    const app = actionssdk_1.actionssdk();
    app._middlewares.push(middleware);
    app.fallback(conv => {
        conv.test();
    });
    const res = yield app.handler({}, {});
    t.is(res.status, 200);
    t.deepEqual(common_1.clone(res.body), {
        expectUserResponse: true,
        expectedInputs: [
            {
                inputPrompt: {
                    richInitialPrompt: {
                        items: [
                            {
                                simpleResponse: {
                                    textToSpeech: response,
                                },
                            },
                        ],
                    },
                },
                possibleIntents: [
                    {
                        intent: 'actions.intent.TEXT',
                    },
                ],
            },
        ],
    });
}));
ava_1.default('throwing an UnauthorizedError makes library respond with 401', (t) => __awaiter(this, void 0, void 0, function* () {
    const app = actionssdk_1.actionssdk();
    app.fallback(() => {
        throw new conversation_1.UnauthorizedError();
    });
    const result = yield app.handler({}, {});
    t.is(result.status, 401);
    t.deepEqual(result.body, {});
}));
ava_1.default('throwing an UnauthorizedError in catch makes library respond with 401', (t) => __awaiter(this, void 0, void 0, function* () {
    const app = actionssdk_1.actionssdk();
    app.fallback(() => {
        throw new Error();
    });
    app.catch(() => {
        throw new conversation_1.UnauthorizedError();
    });
    const result = yield app.handler({}, {});
    t.is(result.status, 401);
    t.deepEqual(result.body, {});
}));
ava_1.default('throwing an Error in catch makes library propogate error', (t) => __awaiter(this, void 0, void 0, function* () {
    const message = 'test';
    const app = actionssdk_1.actionssdk();
    app.fallback(() => {
        throw new Error();
    });
    app.catch(() => {
        throw new Error(message);
    });
    yield t.throwsAsync(app.handler({}, {}), message);
}));
//# sourceMappingURL=actionssdk.test.js.map