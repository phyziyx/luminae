"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

const Dashboard = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>Not authenticated!</div>;
  }

  return <>Dashboard</>;
};

export default Dashboard;
