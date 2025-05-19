import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import AgencyManager from "@/lib/managers/agencyManager";
import SubscriptionManager from "@/lib/managers/subscriptionManager";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { type NextRequest, NextResponse } from "next/server";
import { head, del } from "@vercel/blob";
import { type AgencyFilesResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const agencyMember = await AgencyManager.findUserAgency(user.email);
  if (!agencyMember) {
    throw new Error("Not part of any agency");
  }

  // const fileName = request.nextUrl.searchParams.get("fileName");
  const cursorParam = request.nextUrl.searchParams.get("cursor");
  const cursor = cursorParam ? cursorParam : undefined;
  const takeLimit = 10;

  const files = await prisma.agencyFile.findMany({
    take: takeLimit,
    skip: cursor ? 1 : undefined,
    cursor: cursor
      ? {
          key: cursor,
        }
      : undefined,
    where: {
      agencyId: agencyMember.agencyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalFiles = await prisma.agencyFile.count({
    where: {
      agencyId: agencyMember.agencyId,
    },
  });

  const nextCursor = totalFiles > takeLimit ? files.at(-1)?.key : undefined;
  return NextResponse.json({
    items: files,
    nextCursor,
  } satisfies AgencyFilesResponse);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.

        const session = await getSession();
        const user = session?.user;

        if (!user) {
          throw new Error("Unauthorized");
        }

        const agencyMember = await AgencyManager.findUserAgency(user.email);
        if (!agencyMember) {
          throw new Error("Not part of any agency");
        }

        // Check if the user is allowed to upload files
        const subscription = await SubscriptionManager.findByAgency(
          agencyMember.agencyId
        );
        if (!subscription) {
          throw new Error("No subscription found");
        }

        const fileStorageFeature = subscription.package.features.find(
          (f) => f.code === "FILE_STORAGE"
        );
        if (
          !fileStorageFeature ||
          !fileStorageFeature.hasAccess ||
          !fileStorageFeature.maxLimit ||
          fileStorageFeature.maxLimit <= 0
        ) {
          throw new Error("No file storage feature found");
        }

        // Check if the user has reached the file storage limit
        const fileStorageUsage = await prisma.agencyFile.aggregate({
          _sum: {
            size: true,
          },
          where: {
            agencyId: agencyMember.agencyId,
          },
        });

        if (
          fileStorageUsage._sum.size &&
          fileStorageUsage._sum.size >= fileStorageFeature.maxLimit
        ) {
          throw new Error("File storage limit reached");
        }

        return {
          // allowedContentTypes: ["image/jpeg", "image/png", "image/gif", ""],
          allowOverwrite: false,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            agencyId: agencyMember.agencyId,
            userId: user.id,
            // clientPayload,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        console.log("blob upload completed", blob, tokenPayload);

        if (!tokenPayload) {
          del(blob.url).catch((error) =>
            console.error("Error deleting blob", error)
          );

          console.error("No token payload");
          return;
        }

        let parsedTokenPayload: {
          agencyId: string;
          userId: string;
        } | null = null;
        try {
          parsedTokenPayload = JSON.parse(tokenPayload);

          del(blob.url).catch((error) =>
            console.error("Error deleting blob", error)
          );
        } catch (error) {
          console.error("Error parsing token payload", error);
        }

        if (!parsedTokenPayload) {
          console.error("No parsed token payload");

          del(blob.url).catch((error) =>
            console.error("Error deleting blob", error)
          );
          return;
        }

        try {
          const headResponse = await head(blob.url);

          await prisma.agencyFile.create({
            data: {
              createdAt: new Date(),
              key: headResponse.url,
              name: blob.pathname,
              size: headResponse.size,
              agencyId: parsedTokenPayload.agencyId,
            },
          });
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Error uploading file"
          );
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    // The webhook will retry 5 times waiting for a 200
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
