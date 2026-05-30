export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProfileClient } from "./profile-client";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id;

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!dbUser) {
    redirect("/");
  }

  return (
    <div className="w-full">
      <ProfileClient 
        user={{
          id: userId,
          name: dbUser.name,
          email: dbUser.email,
          image: dbUser.image,
          // @ts-ignore
          overlayToken: dbUser.overlayToken
        }} 
      />
    </div>
  );
}
