export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DashboardClient } from "./dashboard-client";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id;

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { assets: { orderBy: { order: 'asc' } } },
  });

  if (!dbUser) {
    redirect("/");
  }

  return (
    <div className="mx-auto">
      <DashboardClient 
        initialAssets={dbUser.assets as any} 
        userId={userId} 
        user={{ 
          name: dbUser.name, 
          image: dbUser.image,
        }} 
      />
    </div>
  );
}
