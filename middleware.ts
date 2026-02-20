import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // เดิม: บังคับ Login
    // ตอนนี้: ปล่อยผ่านทั้งหมด (Public Access)
    
    // เรายังสามารถอ่าน session ได้ถ้าต้องการทำ logic อื่นๆ ในอนาคต
    // const session = request.cookies.get('pharma-session')

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
