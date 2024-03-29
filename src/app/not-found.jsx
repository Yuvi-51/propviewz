import ProfileHeader from "@/components/header/profile-header/ProfileHeader";
import Link from "next/link";

export default async function NotFound() {
  return (
    <>
      <ProfileHeader />
      <div class="min-h-[calc(100vh-400px)] flex flex-grow items-center justify-center bg-gray-50">
        <div class="rounded-lg bg-white p-8 text-center shadow-xl">
          <h1 class="mb-4 text-4xl font-bold">404</h1>
          <p class="text-gray-600">
            Oops! The page you are looking for could not be found.
          </p>
          <Link
            href="/"
            class="mt-4 inline-block rounded bg-[#f1592a] px-4 py-2 font-semibold text-white hover:bg-[#ce502a]"
          >
            {" "}
            Go back to Home{" "}
          </Link>
        </div>
      </div>
    </>
  );
}
