export const useSearchFilter = <T extends {}, K extends keyof T>(
  searchText: string,
  array: T[],
  properties: K[]
): T[] => {
  if (!searchText) {
    return array;
  }

  return array.filter((item) => {
    for (let i = 0; i < properties.length; i++) {
      if (typeof item[properties[i]] !== "string") continue;
      if (
        (item[properties[i]] as any)
          ?.toLocaleLowerCase()
          .split(" ")
          .join("")
          .includes(searchText.toLocaleLowerCase().split(" ").join(""))
      ) {
        return true;
      }
    }
  });
};
