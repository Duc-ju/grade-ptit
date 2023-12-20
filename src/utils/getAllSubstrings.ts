export default function getAllSubstrings(input: string) {
  const result: string[] = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length + 1; j++) {
      let subStr = input.slice(i, j);
      if (subStr.replace(/\s/g, "").length)
        result.push(subStr.trim().toLowerCase());
    }
  }
  return Array.from(new Set<string>(result).values());
}
