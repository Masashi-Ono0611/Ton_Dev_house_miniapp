import { NextResponse } from "next/server";
import pkg from "../../../../package.json" assert { type: "json" };

export async function GET() {
  return NextResponse.json({
    name: pkg.name,
    version: pkg.version,
    time: new Date().toISOString(),
  });
}
