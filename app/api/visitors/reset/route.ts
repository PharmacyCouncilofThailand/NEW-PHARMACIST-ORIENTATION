import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function DELETE() {
  try {
    await prisma.dailyVisitor.deleteMany();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/visitors/reset error:", err);
    return NextResponse.json({ error: "Failed to reset" }, { status: 500 });
  }
}
