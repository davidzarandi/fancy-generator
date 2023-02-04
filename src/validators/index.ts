import isValidURL from "@/validators/isURL";

const validatorFns = {
  text: (value: string) => {
    if (value.length === 0) {
      return "Please fill out this field.";
    }

    return null;
  },
  URL: (value: string) => {
    if (value.length === 0) {
      return "Please fill out this field.";
    }

    if (!isValidURL(value)) {
      return "Invalid format.";
    }

    return null;
  },
  hex: (value: string) => {
    if (!/^.[0-9a-fA-F]+$/.test(value) || (value.length !== 3 && value.length !== 6)) {
      return "Invalid format.";
    }

    return null;
  },
};

export default validatorFns;
