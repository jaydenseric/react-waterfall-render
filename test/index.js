'use strict';

const { TestDirector } = require('test-director');

const tests = new TestDirector();

require('./waterfallRender.test')(tests);
require('./WaterfallRenderContext.test')(tests);
require('./bundle.test')(tests);

tests.run();
