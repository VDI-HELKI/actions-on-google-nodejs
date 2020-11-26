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
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const conv_1 = require("../conv");
const common_1 = require("../../../common");
const actionssdk_1 = require("../../actionssdk");
const test = ava_1.default;
test.beforeEach(t => {
    t.context.conv = new conv_1.DialogflowConversation({
        body: {
            result: {},
            originalRequest: {
                data: {},
            },
        },
        headers: {},
    });
});
test('conv can be instantiated', t => {
    t.true(t.context.conv instanceof conv_1.DialogflowConversation);
});
test('conv.serialize returns the raw json when set with conv.json', t => {
    const json = {
        a: '1',
        b: '2',
        c: {
            d: '3',
            e: '4',
        },
    };
    t.context.conv.json(json);
    t.deepEqual(t.context.conv.serialize(), json);
});
test('conv.serialize returns the correct response with simple response string', t => {
    const response = 'abc123';
    const conv = t.context.conv;
    conv.add(response);
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
            },
        },
    });
});
const simulatorConv = () => new conv_1.DialogflowConversation({
    body: {
        id: 'idRandom',
        timestamp: 'timestampRandom',
        lang: 'en',
        result: {
            source: 'agent',
            resolvedQuery: 'test',
            speech: '',
            action: 'input.unknown',
            actionIncomplete: false,
            parameters: {},
            contexts: [],
            metadata: {
                intentId: 'intentIdRandom',
                webhookUsed: 'true',
                webhookForSlotFillingUsed: 'false',
                isFallbackIntent: 'true',
                intentName: 'Default Fallback Intent',
            },
            fulfillment: {
                speech: "Sorry, I didn't get that.",
                messages: [
                    {
                        type: 0,
                        speech: 'What was that?',
                    },
                ],
            },
            score: 1,
        },
        status: {
            code: 200,
            errorType: 'success',
        },
        sessionId: 'sessionIdRandom',
    },
    headers: {},
});
test('conv.serialize w/ simple response has fulfillmentText when from simulator', t => {
    const response = 'abc123';
    const conv = simulatorConv();
    conv.add(response);
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
            },
        },
        speech: response,
    });
});
test('conv.serialize w/ simple response text has fulfillmentText when from simulator', t => {
    const speech = 'abc123';
    const text = 'abcd1234';
    const conv = simulatorConv();
    conv.add(new actionssdk_1.SimpleResponse({
        speech,
        text,
    }));
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: speech,
                                displayText: text,
                            },
                        },
                    ],
                },
            },
        },
        speech: text,
    });
});
test('conv.serialize w/ two simple responses has fulfillmentText warning for simulator', t => {
    const response = 'abc123';
    const response2 = 'abcd1234';
    const conv = simulatorConv();
    conv.add(response);
    conv.add(response2);
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                        {
                            simpleResponse: {
                                textToSpeech: response2,
                            },
                        },
                    ],
                },
            },
        },
        speech: 'Cannot display response in Dialogflow simulator. ' +
            'Please test on the Google Assistant simulator instead.',
    });
});
test('conv.serialize w/ solo helper has fulfillmentText warning for simulator', t => {
    const permission = 'NAME';
    const context = 'To read your mind';
    const conv = simulatorConv();
    conv.ask(new actionssdk_1.Permission({
        permissions: permission,
        context,
    }));
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                systemIntent: {
                    data: {
                        '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                        optContext: context,
                        permissions: [
                            permission,
                        ],
                    },
                    intent: 'actions.intent.PERMISSION',
                },
            },
        },
        speech: 'Cannot display response in Dialogflow simulator. ' +
            'Please test on the Google Assistant simulator instead.',
    });
});
test('conv.serialize w/ non solo helper has fulfillmentText warning for simulator', t => {
    const response = 'abc123';
    const conv = simulatorConv();
    conv.ask(response);
    conv.ask(new actionssdk_1.List({
        items: {
            one: {
                title: 'one1',
                synonyms: ['one11', 'one12'],
            },
            two: {
                title: 'two1',
                synonyms: ['two11', 'two12'],
            },
        },
    }));
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
                systemIntent: {
                    data: {
                        '@type': 'type.googleapis.com/google.actions.v2.OptionValueSpec',
                        listSelect: {
                            items: [
                                {
                                    optionInfo: {
                                        key: 'one',
                                        synonyms: [
                                            'one11',
                                            'one12',
                                        ],
                                    },
                                    title: 'one1',
                                },
                                {
                                    optionInfo: {
                                        key: 'two',
                                        synonyms: [
                                            'two11',
                                            'two12',
                                        ],
                                    },
                                    title: 'two1',
                                },
                            ],
                        },
                    },
                    intent: 'actions.intent.OPTION',
                },
            },
        },
        speech: 'Cannot display response in Dialogflow simulator. ' +
            'Please test on the Google Assistant simulator instead.',
    });
});
test('conv.serialize w/ image has fulfillmentText warning for simulator', t => {
    const response = 'abc123';
    const image = 'abcd1234';
    const alt = 'abcde12345';
    const conv = simulatorConv();
    conv.add(response);
    conv.add(new actionssdk_1.Image({
        url: image,
        alt,
    }));
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                        {
                            basicCard: {
                                image: {
                                    accessibilityText: alt,
                                    url: image,
                                },
                            },
                        },
                    ],
                },
            },
        },
        speech: 'Cannot display response in Dialogflow simulator. ' +
            'Please test on the Google Assistant simulator instead.',
    });
});
test('conv.data is parsed correctly', t => {
    const data = {
        a: '1',
        b: '2',
        c: {
            d: '3',
            e: '4',
        },
    };
    const conv = new conv_1.DialogflowConversation({
        body: {
            result: {
                contexts: [
                    {
                        name: '_actions_on_google',
                        parameters: {
                            data: JSON.stringify(data),
                        },
                    },
                ],
            },
        },
    });
    t.deepEqual(conv.data, data);
});
test('conv generates no contexts from empty conv.data', t => {
    const response = `What's up?`;
    const conv = new conv_1.DialogflowConversation({
        body: {
            result: {},
            originalRequest: {
                data: {},
            },
        },
    });
    t.deepEqual(conv.data, {});
    conv.ask(response);
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
            },
        },
    });
});
test('conv generates first conv.data replaced correctly', t => {
    const response = `What's up?`;
    const data = {
        a: '1',
        b: '2',
        c: {
            d: '3',
            e: '4',
        },
    };
    const conv = new conv_1.DialogflowConversation({
        body: {
            result: {},
            originalRequest: {
                data: {},
            },
        },
    });
    t.deepEqual(conv.data, {});
    conv.ask(response);
    conv.data = data;
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
            },
        },
        contextOut: [
            {
                name: '_actions_on_google',
                lifespan: 99,
                parameters: {
                    data: JSON.stringify(data),
                },
            },
        ],
    });
});
test('conv generates first conv.data mutated correctly', t => {
    const response = `What's up?`;
    const a = '7';
    const conv = new conv_1.DialogflowConversation({
        body: {
            result: {},
            originalRequest: {
                data: {},
            },
        },
    });
    t.deepEqual(conv.data, {});
    conv.ask(response);
    conv.data.a = a;
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
            },
        },
        contextOut: [
            {
                name: '_actions_on_google',
                lifespan: 99,
                parameters: {
                    data: JSON.stringify({ a }),
                },
            },
        ],
    });
});
test('conv generates different conv.data correctly', t => {
    const response = `What's up?`;
    const data = {
        a: '1',
        b: '2',
        c: {
            d: '3',
            e: '4',
        },
    };
    const e = '6';
    const conv = new conv_1.DialogflowConversation({
        body: {
            result: {
                contexts: [
                    {
                        name: '_actions_on_google',
                        parameters: {
                            data: JSON.stringify(data),
                        },
                    },
                ],
            },
            originalRequest: {
                data: {},
            },
        },
    });
    t.deepEqual(conv.data, data);
    conv.ask(response);
    conv.data.c.e = e;
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
            },
        },
        contextOut: [
            {
                name: '_actions_on_google',
                lifespan: 99,
                parameters: {
                    data: JSON.stringify({
                        a: '1',
                        b: '2',
                        c: {
                            d: '3',
                            e,
                        },
                    }),
                },
            },
        ],
    });
});
test('conv generates same conv.data as no output contexts', t => {
    const response = `What's up?`;
    const data = {
        a: '1',
        b: '2',
        c: {
            d: '3',
            e: '4',
        },
    };
    const conv = new conv_1.DialogflowConversation({
        body: {
            result: {
                contexts: [
                    {
                        name: '_actions_on_google',
                        parameters: {
                            data: JSON.stringify(data),
                        },
                    },
                ],
            },
            originalRequest: {
                data: {},
            },
        },
    });
    t.deepEqual(conv.data, data);
    conv.ask(response);
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
            },
        },
    });
});
test('conv sends userStorage when it is not empty', t => {
    const response = `What's up?`;
    const data = {
        a: '1',
        b: '2',
        c: {
            d: '3',
            e: '4',
        },
    };
    const conv = new conv_1.DialogflowConversation({
        body: {
            result: {},
            originalRequest: {
                data: {},
            },
        },
    });
    t.deepEqual(conv.data, {});
    conv.user.storage = data;
    conv.ask(response);
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
                userStorage: JSON.stringify({ data }),
            },
        },
    });
});
test('conv does not send userStorage when it is empty', t => {
    const response = `What's up?`;
    const conv = new conv_1.DialogflowConversation({
        body: {
            result: {},
            originalRequest: {
                data: {},
            },
        },
    });
    t.deepEqual(conv.user.storage, {});
    conv.ask(response);
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
            },
        },
    });
});
test('conv does not error out when simple response is after image', t => {
    const response = 'How are you?';
    const conv = new conv_1.DialogflowConversation({
        body: {
            result: {},
            originalRequest: {
                data: {},
            },
        },
    });
    conv.ask(new actionssdk_1.Image({ url: '', alt: '' }));
    conv.ask(response);
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            basicCard: {
                                image: {
                                    url: '',
                                    accessibilityText: '',
                                },
                            },
                        },
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
            },
        },
    });
});
test('conv w/ simple response after image has fulfillmentText warning for simulator', t => {
    const response = 'abc123';
    const image = 'abcd1234';
    const alt = 'abcde12345';
    const conv = simulatorConv();
    conv.add(new actionssdk_1.Image({
        url: image,
        alt,
    }));
    conv.add(response);
    t.deepEqual(common_1.clone(conv.serialize()), {
        data: {
            google: {
                expectUserResponse: true,
                richResponse: {
                    items: [
                        {
                            basicCard: {
                                image: {
                                    accessibilityText: alt,
                                    url: image,
                                },
                            },
                        },
                        {
                            simpleResponse: {
                                textToSpeech: response,
                            },
                        },
                    ],
                },
            },
        },
        speech: 'Cannot display response in Dialogflow simulator. ' +
            'Please test on the Google Assistant simulator instead.',
    });
});
//# sourceMappingURL=conv.v1.test.js.map