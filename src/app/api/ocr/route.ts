import Tesseract from "tesseract.js";

export async function POST(req: Request) {
  const data = await req.formData();

  const file = data.get("file") as File;

  const {
    data: { text },
  } = await Tesseract.recognize(file);

  return Response.json({
    text,
  });
}