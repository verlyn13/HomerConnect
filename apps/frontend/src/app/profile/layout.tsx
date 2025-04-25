import Link from "next/link";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-gray-100 mb-6 py-4 px-6 border-b">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <div className="flex space-x-4">
            <Link
              href="/profile"
              className="px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
            >
              View Profile
            </Link>
            <Link
              href="/profile/edit"
              className="px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto">
        {children}
      </div>
    </div>
  );
}
