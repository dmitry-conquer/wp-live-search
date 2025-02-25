export const highlight = (string: string, substring: string): string => {
  return string.replace(new RegExp(substring, "gi"), match => `<b style="color: red;">${match}</b>`);
};