import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await cloudinary.uploader.upload(
      body.file,
      {
        folder: "lifeos-documents",
        resource_type: "auto",
      }
    );

    return Response.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}