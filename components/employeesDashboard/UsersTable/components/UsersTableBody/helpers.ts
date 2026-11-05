export function splitOnCapital(str: string) {
  const match = str.trim().match(/([A-Z]?[^A-Z]*)/g)!;
  if (match) {
    const array = match.map((element) => element.trim()).filter((element) => element);
    return array.join(' ');
  } else {
    return str;
  }
}
