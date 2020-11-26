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
const conversation_1 = require("../conversation");
const __1 = require("..");
const common_1 = require("../../../../common");
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
ava_1.default('conv.screen is true when screen capability exists', t => {
    const conv = new conversation_1.Conversation({
        request: {
            surface: {
                capabilities: [
                    {
                        name: 'actions.capability.SCREEN_OUTPUT',
                    },
                ],
            },
        },
    });
    t.true(conv.screen);
});
ava_1.default('conv.screen is false when screen capability does not exist', t => {
    const conv = new conversation_1.Conversation({
        request: {
            surface: {
                capabilities: [],
            },
        },
    });
    t.false(conv.screen);
});
ava_1.default('ask with simple text', t => {
    const appRequest = buildRequest('ACTIVE', 'example.foo');
    const conv = new conversation_1.Conversation({
        request: appRequest,
    });
    conv.ask('hello');
    t.true(conv.expectUserResponse);
    t.is(conv.responses.length, 1);
    t.false(conv.digested);
    t.true(conv._responded);
});
ava_1.default('ask with multiple responses', t => {
    const appRequest = buildRequest('ACTIVE', 'example.foo');
    const conv = new conversation_1.Conversation({
        request: appRequest,
    });
    conv.ask('hello', 'world', '<speak>hello world</speak>');
    t.true(conv.expectUserResponse);
    t.is(conv.responses.length, 3);
    t.false(conv.digested);
    t.true(conv._responded);
});
ava_1.default('close with multiple responses', t => {
    const appRequest = buildRequest('ACTIVE', 'example.foo');
    const conv = new conversation_1.Conversation({
        request: appRequest,
    });
    conv.close('hello', 'world', '<speak>hello world</speak>');
    t.false(conv.expectUserResponse);
    t.is(conv.responses.length, 3);
    t.false(conv.digested);
    t.true(conv._responded);
});
ava_1.default('basic conversation response', t => {
    const appRequest = buildRequest('ACTIVE', 'example.foo');
    const conv = new conversation_1.Conversation({
        request: appRequest,
    });
    conv.ask('hello', '<speak>world</speak>');
    const response = conv.response();
    t.is(response.richResponse.items.length, 2);
    t.deepEqual(response.richResponse.items[0].simpleResponse.textToSpeech, 'hello');
    t.deepEqual(response.richResponse.items[1].simpleResponse.textToSpeech, '<speak>world</speak>');
    t.true(response.expectUserResponse);
    t.true(conv.digested);
    t.true(conv._responded);
});
ava_1.default('basic card with suggestions conversation response', t => {
    const appRequest = buildRequest('ACTIVE', 'example.foo');
    const conv = new conversation_1.Conversation({
        request: appRequest,
    });
    conv.ask('hello', new __1.BasicCard({
        title: 'Title',
        subtitle: 'This is a subtitle',
        text: 'This is a sample text',
        image: {
            url: 'http://url/to/image',
            height: 200,
            width: 300,
        },
        buttons: new __1.Button({
            title: 'Learn more',
            url: 'http://url/to/open',
        }),
    }), new __1.Suggestions('suggestion one', 'suggestion two'));
    const response = conv.response();
    t.is(response.richResponse.items.length, 2);
    t.deepEqual(response.richResponse.items[1].basicCard.formattedText, 'This is a sample text');
    t.deepEqual(response.richResponse.suggestions[0].title, 'suggestion one');
    t.true(response.expectUserResponse);
    t.true(conv.digested);
    t.true(conv._responded);
});
ava_1.default('basic conversation response with reprompts', t => {
    const appRequest = buildRequest('ACTIVE', 'example.foo');
    const conv = new conversation_1.Conversation({
        request: appRequest,
    });
    conv.ask('hello');
    conv.noInputs = ['reprompt1', new __1.SimpleResponse('reprompt2')];
    const response = conv.response();
    t.is(response.richResponse.items.length, 1);
    t.deepEqual(response.richResponse.items[0].simpleResponse.textToSpeech, 'hello');
    t.deepEqual(response.noInputPrompts[0].textToSpeech, 'reprompt1');
    t.deepEqual(response.noInputPrompts[1].textToSpeech, 'reprompt2');
    t.true(response.expectUserResponse);
    t.true(conv.digested);
    t.true(conv._responded);
});
ava_1.default('conv parses a valid user storage', t => {
    const data = {
        a: '1',
        b: '2',
        c: {
            d: '3',
            e: '4',
        },
    };
    const conv = new conversation_1.Conversation({
        request: {
            user: {
                userStorage: JSON.stringify({ data }),
            },
        },
    });
    t.deepEqual(conv.user.storage, data);
});
ava_1.default('conv generate an empty user storage as empty string', t => {
    const response = `What's up?`;
    const conv = new conversation_1.Conversation();
    t.deepEqual(conv.user.storage, {});
    conv.ask(response);
    t.deepEqual(common_1.clone(conv.response()), {
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
        userStorage: '',
    });
});
ava_1.default('conv generates first user storage replaced correctly', t => {
    const response = `What's up?`;
    const data = {
        a: '1',
        b: '2',
        c: {
            d: '3',
            e: '4',
        },
    };
    const conv = new conversation_1.Conversation();
    conv.ask(response);
    conv.user.storage = data;
    t.deepEqual(common_1.clone(conv.response()), {
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
    });
});
ava_1.default('conv generates first user storage mutated correctly', t => {
    const response = `What's up?`;
    const conv = new conversation_1.Conversation();
    conv.ask(response);
    const a = '1';
    conv.user.storage.a = a;
    t.deepEqual(common_1.clone(conv.response()), {
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
        userStorage: JSON.stringify({ data: { a } }),
    });
});
ava_1.default('conv generates different user storage correctly', t => {
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
    const conv = new conversation_1.Conversation({
        request: {
            user: {
                userStorage: JSON.stringify({ data }),
            },
        },
    });
    t.deepEqual(conv.user.storage, data);
    conv.ask(response);
    conv.user.storage.c.e = e;
    t.deepEqual(common_1.clone(conv.response()), {
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
        userStorage: JSON.stringify({
            data: {
                a: '1',
                b: '2',
                c: {
                    d: '3',
                    e,
                },
            },
        }),
    });
});
ava_1.default('conv generates same user storage as empty string', t => {
    const response = `What's up?`;
    const data = {
        a: '1',
        b: '2',
        c: {
            d: '3',
            e: '4',
        },
    };
    const conv = new conversation_1.Conversation({
        request: {
            user: {
                userStorage: JSON.stringify({ data }),
            },
        },
    });
    t.deepEqual(conv.user.storage, data);
    conv.ask(response);
    t.deepEqual(common_1.clone(conv.response()), {
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
        userStorage: '',
    });
});
ava_1.default('conv.response throws error when no response has been set', t => {
    const conv = new conversation_1.Conversation();
    t.throws(() => conv.response(), 'No response has been set. ' +
        'Is this being used in an async call that was not ' +
        'returned as a promise to the intent handler?');
});
ava_1.default('conv.response throws error when response has been digested twice', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(`What's up?`);
    conv.response();
    t.throws(() => conv.response(), 'Response has already been digested');
});
ava_1.default('conv.response throws error when only one helper has been sent', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.Carousel({
        items: [],
    }));
    t.throws(() => conv.response(), 'A simple response is required in addition to this type of response');
});
ava_1.default('conv.response does not throws error when only one SoloHelper has been sent', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.Permission({
        permissions: 'NAME',
    }));
    t.deepEqual(common_1.clone(conv.response()), {
        expectUserResponse: true,
        expectedIntent: {
            intent: 'actions.intent.PERMISSION',
            inputValueData: {
                '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                permissions: ['NAME'],
            },
        },
        richResponse: {
            items: [],
        },
        userStorage: '',
    });
});
ava_1.default('conv.response throws error when only one rich response has been sent', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.Image({
        url: 'url',
        alt: 'alt',
    }));
    t.throws(() => conv.response(), 'A simple response is required in addition to this type of response');
});
ava_1.default('conv sends speechBiasingHints when set', t => {
    const response = 'What is your favorite color out of red, blue, and green?';
    const biasing = ['red', 'blue', 'green'];
    const conv = new conversation_1.Conversation();
    conv.speechBiasing = biasing;
    conv.ask(response);
    t.deepEqual(common_1.clone(conv.response()), {
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
        userStorage: '',
        speechBiasingHints: biasing,
    });
});
ava_1.default('conv throws error when conv.add is used after response already been sent', t => {
    const conv = new conversation_1.Conversation();
    conv.ask('hello');
    t.is(typeof conv.response(), 'object');
    t.throws(() => conv.add('test'), 'Response has already been sent. ' +
        'Is this being used in an async call that was not ' +
        'returned as a promise to the intent handler?');
});
ava_1.default('conv enforces simple response for non SoloHelper Helper classes', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.List({ items: [] }));
    t.throws(() => conv.response(), 'A simple response is required in addition to this type of response');
});
ava_1.default('conv does not enforce simple response for SoloHelper classes', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.Permission({ permissions: 'NAME' }));
    t.is(typeof conv.response(), 'object');
});
ava_1.default('conv does not enforce simple response for a raw RichResponse input', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.RichResponse());
    t.is(typeof conv.response(), 'object');
});
ava_1.default('conv enforces simple response for Suggestions', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.Suggestions());
    t.throws(() => conv.response(), 'A simple response is required in addition to this type of response');
});
ava_1.default('conv enforces simple response for Image', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.Image({ url: '', alt: '' }));
    t.throws(() => conv.response(), 'A simple response is required in addition to this type of response');
});
ava_1.default('conv enforces simple response for MediaObject', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.MediaObject({ url: '' }));
    t.throws(() => conv.response(), 'A simple response is required in addition to this type of response');
});
ava_1.default('conv enforces simple response for BasicCard', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.BasicCard({}));
    t.throws(() => conv.response(), 'A simple response is required in addition to this type of response');
});
ava_1.default('conv enforces simple response for Table', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.Table({ rows: [] }));
    t.throws(() => conv.response(), 'A simple response is required in addition to this type of response');
});
ava_1.default('conv enforces simple response for BrowseCarousel', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.BrowseCarousel());
    t.throws(() => conv.response(), 'A simple response is required in addition to this type of response');
});
ava_1.default('conv enforces simple response for MediaResponse', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.MediaResponse());
    t.throws(() => conv.response(), 'A simple response is required in addition to this type of response');
});
ava_1.default('conv enforces simple response for OrderUpdate', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.OrderUpdate({}));
    t.throws(() => conv.response(), 'A simple response is required in addition to this type of response');
});
ava_1.default('conv enforces simple response for LinkOutSuggestion', t => {
    const conv = new conversation_1.Conversation();
    conv.ask(new __1.LinkOutSuggestion({ url: '', name: '' }));
    t.throws(() => conv.response(), 'A simple response is required in addition to this type of response');
});
ava_1.default('conv does not enforce simple response for raw RichResponse item', t => {
    const conv = new conversation_1.Conversation();
    conv.ask({ basicCard: {} });
    t.is(typeof conv.response(), 'object');
});
ava_1.default('surface capability shortcut works', t => {
    const conv = new conversation_1.Conversation({
        request: {
            surface: {
                capabilities: [
                    {
                        name: 'actions.capability.SCREEN_OUTPUT',
                    },
                    {
                        name: 'actions.capability.MEDIA_RESPONSE_AUDIO',
                    },
                    {
                        name: 'actions.capability.AUDIO_OUTPUT',
                    },
                ],
            },
        },
    });
    t.true(conv.surface.has('actions.capability.AUDIO_OUTPUT'));
    t.false(conv.surface.has('actions.capability.WEB_BROWSER'));
});
ava_1.default('available surface capability shortcut works', t => {
    const conv = new conversation_1.Conversation({
        request: {
            availableSurfaces: [
                {
                    capabilities: [
                        {
                            name: 'actions.capability.SCREEN_OUTPUT',
                        },
                        {
                            name: 'actions.capability.MEDIA_RESPONSE_AUDIO',
                        },
                    ],
                },
                {
                    capabilities: [
                        {
                            name: 'actions.capability.AUDIO_OUTPUT',
                        },
                    ],
                },
            ],
        },
    });
    t.true(conv.available.surfaces.has('actions.capability.AUDIO_OUTPUT'));
    t.false(conv.available.surfaces.has('actions.capability.WEB_BROWSER'));
});
//# sourceMappingURL=conversation.test.js.map