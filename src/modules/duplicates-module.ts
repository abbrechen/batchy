const addSuffixToDuplicates = (array: any, key: any) => {
  const frequencyMap: any = {};
  const occurrencesSeen: any = {};

  // First, count occurrences of each value for the specified key
  for (const obj of array) {
    const value = obj[key];
    if (value !== undefined) {
      frequencyMap[value] = (frequencyMap[value] || 0) + 1;
    }
  }

  // Modify objects with suffixes for duplicate values
  for (const obj of array) {
    const value = obj[key];
    if (frequencyMap[value] > 1) { // Only modify if there are duplicates
      occurrencesSeen[value] = (occurrencesSeen[value] || 0) + 1;
      obj[key] = `${value}_${occurrencesSeen[value]}`;
    }
  }

  return array;
}

export default addSuffixToDuplicates;
