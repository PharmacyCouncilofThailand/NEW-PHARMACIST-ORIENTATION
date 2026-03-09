import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST /api/auth/register
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, thaiId, licenseId, organization, university, phone } = body;

    // ── Validation ────────────────────────────────
    if (!email || !password || !firstName || !lastName || !thaiId) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Minimum 6 characters" },
        { status: 400 }
      );
    }

    // ── Hash password ─────────────────────────────
    const passwordHash = await bcrypt.hash(password, 10); 

    // ── Create user ──
    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName, thaiId, licenseId: licenseId || null, organization: organization || null, university: university || null, phone: phone || null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        thaiId: true,
        licenseId: true,
        organization: true,
        university: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "Email or Thai ID already registered" },
        { status: 409 }
      );
    }
    
    console.error("[register]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
