import { describe, expect, it } from 'vitest';

import util from '../../src/util.js';

describe('util/log', function () {

  it('shows only error message if log level is error', async function () {
    expect(util.log('error', 'error', 'Lorem ipsum')).toBe('[ ERROR ] Lorem ipsum');
  });

  it('shows only error message if log level is debug', async function () {
    expect(util.log('debug', 'error', 'Lorem ipsum')).toBe('');
  });

  it('throws error if message severity is invalid', async function () {
    expect(() => util.log('debuggy', 'error', 'Lorem ipsum')).toThrow();
  });

  it('throws error if user defined log level is invalid', async function () {
    expect(() => util.log('debug', 'errory', 'Lorem ipsum')).toThrow();
  });
  
});
