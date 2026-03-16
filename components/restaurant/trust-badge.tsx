"use client";

export function TrustBadge({
  isVerified,
  hasPendingReports,
}: {
  isVerified: boolean;
  hasPendingReports?: boolean;
}) {
  if (hasPendingReports) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        Needs Review
      </span>
    );
  }

  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Verified
      </span>
    );
  }

  return null;
}
