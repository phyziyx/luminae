"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>Not authenticated!</div>;
  }

  return (
    <div>
      <h1>Workspace: {id}</h1>
    </div>
  );
}
