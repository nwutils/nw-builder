import { describe, expect, it } from 'vitest';

import util from '../../src/util.js';

describe('util/log', function () {

  it('shows only error message if log level is error', async function () {
    expect(util.log('error', 'error', 'Sample message with severity of error')).toBe('[ ERROR ] Sample message with severity of error');
  });

  it('shows only error message if log level is debug', async function () {
    expect(util.log('debug', 'error', 'Sample message with severity of error')).toBe('');
  });
});
