import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isApi = req.nextUrl.pathname.startsWith("/api");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

  // Skip protection for auth routes and custom overlays (token verified in component)
  if (isAuthRoute || req.nextUrl.pathname.startsWith("/overlay")) {
    return;
  }

  if ((isDashboard || isApi) && !isLoggedIn) {
     return Response.redirect(new URL("/api/auth/signin", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
