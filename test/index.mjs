import TestDirector from 'test-director';
import testWaterfallRenderContext from './WaterfallRenderContext.test.mjs';
import testBundle from './bundle.test.mjs';
import testWaterfallRender from './waterfallRender.test.mjs';

const tests = new TestDirector();

testWaterfallRender(tests);
testWaterfallRenderContext(tests);
testBundle(tests);

tests.run();
