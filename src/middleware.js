import { NextResponse } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    const { pathname } = request.nextUrl

    const publicPaths = ["/login", "/signup", "/forgot-password", "/reset-password"]

    // Check if the path is public
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

    // Get authentication status
    //   const isAuthed = await isAuthenticated();
    const isAuthed = true

    // Redirect logic
    if (!isAuthed && !isPublicPath) {
        // Redirect to login if trying to access protected route while not authenticated
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (isAuthed && pathname === "/login") {
        // Redirect to parking if trying to access login while authenticated
        return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}
