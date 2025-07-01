import PostManager from "@/lib/managers/postManager";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const sortType = request.nextUrl.searchParams.get("sortType");
  const cursorParam = request.nextUrl.searchParams.get("cursor");
  const cursor = cursorParam ? cursorParam : undefined;

  if (!id) {
    return NextResponse.json(
      {
        error: "Category id is required",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const response = await PostManager.getCategoryPosts({
      categoryId: id,
      sortType: sortType === "comments" ? "comments" : "latest",
      cursorId: cursor,
    });

    if (!response) {
      return NextResponse.json(
        {
          error: "Something went wrong while fetching posts",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching posts",
      },
      {
        status: 404,
      }
    );
  }
}
