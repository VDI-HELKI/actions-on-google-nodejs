"use strict";
/**
 * Copyright 2019 Google Inc. All Rights Reserved.
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
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const common = require("../../../../../common");
const html_1 = require("../html");
const rich_1 = require("../rich");
const dialogflow_1 = require("../../../../dialogflow");
const conv_1 = require("../../../conv");
ava_1.default('basic complete use case works', t => {
    const immersive = new html_1.HtmlResponse({
        url: 'https://example.com',
        data: { test: 'abc' },
        suppress: true,
    });
    const raw = {
        url: 'https://example.com',
        updatedState: { test: 'abc' },
        suppressMic: true,
    };
    t.deepEqual(common.clone(immersive), raw);
});
ava_1.default('basic complete non aliased use case works', t => {
    const immersive = new html_1.HtmlResponse({
        url: 'https://example.com',
        updatedState: { test: 'abc' },
        suppressMic: true,
    });
    const raw = {
        url: 'https://example.com',
        updatedState: { test: 'abc' },
        suppressMic: true,
    };
    t.deepEqual(common.clone(immersive), raw);
});
ava_1.default('only url works', t => {
    const immersive = new html_1.HtmlResponse({
        url: 'https://example.com',
    });
    const raw = {
        url: 'https://example.com',
    };
    t.deepEqual(common.clone(immersive), raw);
});
ava_1.default('only data works', t => {
    const immersive = new html_1.HtmlResponse({
        data: { test: 'abc' },
    });
    const raw = {
        updatedState: { test: 'abc' },
    };
    t.deepEqual(common.clone(immersive), raw);
});
ava_1.default('changing aliased suppress works', t => {
    const immersive = new html_1.HtmlResponse();
    immersive.suppress = true;
    t.is(immersive.suppress, true);
    const raw = {
        suppressMic: true,
    };
    t.deepEqual(common.clone(immersive), raw);
});
ava_1.default('changing aliased data works', t => {
    const immersive = new html_1.HtmlResponse();
    immersive.data = { test: 'abc' };
    t.deepEqual(immersive.data, { test: 'abc' });
    const raw = {
        updatedState: { test: 'abc' },
    };
    t.deepEqual(common.clone(immersive), raw);
});
ava_1.default('works in RichResponse', t => {
    const rich = new rich_1.RichResponse();
    rich.add(new html_1.HtmlResponse({
        url: 'https://example.com',
    }));
    const raw = {
        items: [
            {
                htmlResponse: {
                    url: 'https://example.com',
                },
            },
        ],
    };
    t.deepEqual(common.clone(rich), raw);
});
ava_1.default('DialogflowConversation serialized correctly', t => {
    const conv = new dialogflow_1.DialogflowConversation();
    conv.ask(new html_1.HtmlResponse({
        url: 'https://example.com',
    }));
    const raw = {
        payload: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            htmlResponse: {
                                url: 'https://example.com',
                            },
                        },
                    ],
                },
            },
        },
    };
    t.deepEqual(common.clone(conv.serialize()), raw);
});
ava_1.default('ActionsSdkConversation serialized correctly', t => {
    const conv = new conv_1.ActionsSdkConversation();
    conv.ask(new html_1.HtmlResponse({
        url: 'https://example.com',
    }));
    const raw = {
        expectUserResponse: true,
        expectedInputs: [
            {
                possibleIntents: [
                    {
                        intent: 'actions.intent.TEXT',
                    },
                ],
                inputPrompt: {
                    richInitialPrompt: {
                        items: [
                            {
                                htmlResponse: {
                                    url: 'https://example.com',
                                },
                            },
                        ],
                    },
                },
            },
        ],
    };
    t.deepEqual(common.clone(conv.serialize()), raw);
});
//# sourceMappingURL=html.test.js.map