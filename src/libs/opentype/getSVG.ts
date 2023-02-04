import { Font } from "opentype.js";

import { DECIMAL_PLACES, FONT_SIZE } from "@/libs/opentype/config";

const getSVG = (text: string, font: Font) => {
  const textPath = font.getPath(text, 18.6, 14, FONT_SIZE);
  return textPath.toSVG(DECIMAL_PLACES);
};

export default getSVG;
