import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
} from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const snapshot = await getDocs(
      collection(db, "documents")
    );

    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const found = docs.find((doc: any) =>
      doc.documentName
        ?.toLowerCase()
        .includes(query.toLowerCase())
    );

    if (!found) {
      return Response.json({
        found: false,
        message: "Document not found",
      });
    }

    return Response.json({
      found: true,
      document: found,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        found: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}