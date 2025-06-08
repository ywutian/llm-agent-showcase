export const extractSecretNumber = (content) => {
  const matches = content.match(
    /(?:choose|secret|number|selected).*?(\d+)|(\d+).*?(?:secret|choose)/gi
  );
  if (matches && matches.length > 0) {
    const numbers = matches[0].match(/\d+/g);
    if (numbers) {
      const num = parseInt(numbers[0]);
      if (num >= 1 && num <= 100) return num;
    }
  }
  return null;
};
