import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import AgencyManager from "@/lib/managers/agencyManager";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type NextRequest, NextResponse } from "next/server";

const R2_BUCKET = process.env.R2_BUCKET!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_ENDPOINT = process.env.R2_ENDPOINT!;

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const agencyMember = await AgencyManager.findUserAgency(user.email);
    if (!agencyMember) {
      return NextResponse.json(
        { error: "Not part of any agency" },
        { status: 403 }
      );
    }

    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { error: "File key is required" },
        { status: 400 }
      );
    }

    // Verify that the file belongs to the user's agency
    const file = await prisma.agencyFile.findFirst({
      where: {
        key,
        agencyId: agencyMember.agencyId,
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: "File not found or access denied" },
        { status: 404 }
      );
    }

    // Generate presigned URL with 1 hour expiration
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600, // 1 hour in seconds
    });

    return NextResponse.json({
      success: true,
      url: presignedUrl,
      filename: file.name,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const agencyMember = await AgencyManager.findUserAgency(user.email);
    if (!agencyMember) {
      return NextResponse.json(
        { error: "Not part of any agency" },
        { status: 403 }
      );
    }

    const key = request.nextUrl.searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "File key is required" },
        { status: 400 }
      );
    }

    // Verify that the file belongs to the user's agency
    const file = await prisma.agencyFile.findFirst({
      where: {
        key,
        agencyId: agencyMember.agencyId,
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: "File not found or access denied" },
        { status: 404 }
      );
    }

    // Generate presigned URL with 1 hour expiration
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600, // 1 hour in seconds
    });

    return NextResponse.json({
      success: true,
      url: presignedUrl,
      filename: file.name,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );
  }
}
