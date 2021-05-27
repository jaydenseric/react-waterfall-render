import TestDirector from 'test-director';
import test_WaterfallRenderContext from './WaterfallRenderContext.test.mjs';
import test_bundle from './bundle.test.mjs';
import test_waterfallRender from './waterfallRender.test.mjs';

const tests = new TestDirector();

test_waterfallRender(tests);
test_WaterfallRenderContext(tests);
test_bundle(tests);

tests.run();
