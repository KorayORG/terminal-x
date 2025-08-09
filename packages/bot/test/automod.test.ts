import { checkMessage } from '../src/automod';

describe('automod', () => {
  it('detects profanity', () => {
    expect(checkMessage('badword here')).toBe('profanity');
  });

  it('detects link', () => {
    expect(checkMessage('http://example.com')).toBe('link');
  });
});
