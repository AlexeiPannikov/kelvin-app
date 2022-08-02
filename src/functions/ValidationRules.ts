export const isEmail = (value: string) => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(value) || "Invalid e-mail.";
};

export const minLength = (min: number = 8) => {
  return (value: string) =>
    value.length >= min || value.length === 0 || `Min ${min} characters`;
};

export const required = (value: string) => {
  return !!value || "Required field";
};

export const isMatchPass = (str: string) => {
  return (value: string) => {
    return value === str || "Passwords do no match";
  };
};
