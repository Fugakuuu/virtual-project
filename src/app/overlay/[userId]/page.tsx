import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import OverlayClient from "./overlay-client";

interface OverlayPageProps {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ t?: string }>;
}

export default async function OverlayPage({ params, searchParams }: OverlayPageProps) {
  const { userId } = await params;
  const { t: token } = await searchParams;

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-500 font-mono text-sm p-4 text-center">
        ACCESS_DENIED // MISSING_TOKEN
      </div>
    );
  }

  // Find user and verify token
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { overlayToken: true }
  });

  if (!user || user.overlayToken !== token) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-500 font-mono text-sm p-4 text-center">
        ACCESS_DENIED // INVALID_TOKEN
      </div>
    );
  }

  return <OverlayClient userId={userId} />;
}
