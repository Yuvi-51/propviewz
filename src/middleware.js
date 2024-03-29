import { NextResponse } from "next/server";

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const cityID = request.cookies?.get("cityID")?.value;

  //INFO: if user goes to root url send him to previous city or by default pune

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${cityID == 2126 ? "mumbai" : "pune"}`, request.url)
    );
  }

  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const pathname = request.nextUrl.pathname;
//   const cityID = request.cookies?.get("cityID")?.value;
//   const response = NextResponse.next();

//   //INFO: if user goes to root url send him to previous city or by default pune
//   if (pathname == "/mumbai") {
//     response.cookies.set("cityID", 2126);
//     return NextResponse.redirect(new URL(`/mumbai`, request.url));
//   } else if (pathname == "/pune") {
//     response.cookies.set("cityID", 2209);
//     return NextResponse.redirect(new URL(`/pune`, request.url));
//   } else if (pathname === "/") {
//     return NextResponse.redirect(
//       new URL(`/${cityID == 2126 ? "mumbai" : "pune"}`, request.url)
//     );
//   }

//   return response;
// }

// export const config = {
//   matcher: ["/:path*", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
