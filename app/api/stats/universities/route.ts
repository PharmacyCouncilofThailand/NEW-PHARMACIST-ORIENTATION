import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const counts = await prisma.user.groupBy({
      by: ['university'],
      _count: {
        id: true,
      },
      where: {
        university: {
          not: null
        }
      }
    });

    const formattedData = counts.map((item) => ({
      university: item.university,
      count: item._count.id,
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error: any) {
    console.error("Failed to fetch university stats:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
