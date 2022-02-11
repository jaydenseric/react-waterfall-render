// @ts-check

import TestDirector from "test-director";

import test_waterfallRender from "./waterfallRender.test.mjs";
import test_WaterfallRenderContext from "./WaterfallRenderContext.test.mjs";

const tests = new TestDirector();

test_waterfallRender(tests);
test_WaterfallRenderContext(tests);

tests.run();
