import { loadSync } from "opentype.js";
import path from "path";

import { CUSTOM_FONT_FILE_NAME } from "@/libs/opentype/config";

const getFont = () => {
  const fontPath = path.resolve("public", "fonts", CUSTOM_FONT_FILE_NAME);
  return loadSync(fontPath);
};

export default getFont;
