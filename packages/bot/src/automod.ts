const bannedWords = ['badword'];

export function checkMessage(content: string) {
  const lowered = content.toLowerCase();
  if (bannedWords.some((w) => lowered.includes(w))) {
    return 'profanity';
  }
  const linkRegex = /https?:\/\//i;
  if (linkRegex.test(content)) {
    return 'link';
  }
  return null;
}
