import { Stage } from "konva/lib/Stage";

export async function exportCanvasToImage(stage: Stage): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const dataURL = stage.toDataURL({
        pixelRatio: 2, // better quality
        mimeType: "image/png",
      });
      resolve(dataURL);
    } catch (err) {
      reject(err);
    }
  });
}
