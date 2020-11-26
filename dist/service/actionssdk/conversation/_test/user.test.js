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
const sinon = require("sinon");
const common = require("../../../../common");
const user_1 = require("../user");
ava_1.default('user creates profile object', t => {
    const user = new user_1.User();
    t.true(user.profile instanceof user_1.Profile);
});
ava_1.default('profile reads idToken', t => {
    const token = 'test';
    const profile = new user_1.Profile({
        idToken: token,
    });
    t.is(profile.token, token);
});
ava_1.default('user profile reads idToken', t => {
    const token = 'test';
    const user = new user_1.User({
        idToken: token,
    });
    t.is(user.profile.token, token);
});
ava_1.default('user reads userId', t => {
    const id = 'test';
    const user = new user_1.User({
        userId: id,
    });
    const stub = sinon.stub(common, 'deprecate');
    t.is(user.id, id);
    t.true(stub.called);
    stub.restore();
});
//# sourceMappingURL=user.test.js.map