import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "chattogram.html");
  if (!fs.existsSync(filePath)) {
    return new NextResponse("chattogram.html not found", { status: 404 });
  }

  const html = fs.readFileSync(filePath, "utf-8");
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
