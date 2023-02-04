import { Font } from "opentype.js";
import { FONT_SIZE, SVG_X_POSITION } from "@/libs/opentype/config";

const getBoundingBox = (text: string, font: Font) => {
  const textPath = font.getPath(text, SVG_X_POSITION, 14, FONT_SIZE);
  return textPath.getBoundingBox();
};

export default getBoundingBox;
