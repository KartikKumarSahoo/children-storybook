import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const storyId = searchParams.get("id");

  if (!storyId) {
    return NextResponse.json(
      { error: "Story ID is required" },
      { status: 400 }
    );
  }

  // Since IndexedDB is client-side only, we'll return instructions for the client
  return NextResponse.json({
    message: "Use client-side IndexedDB to retrieve story",
    storyId,
    instructions: "Call storyStorage.getStory(id) from the client",
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const storyId = searchParams.get("id");

  if (!storyId) {
    return NextResponse.json(
      { error: "Story ID is required" },
      { status: 400 }
    );
  }

  // Since IndexedDB is client-side only, we'll return instructions for the client
  return NextResponse.json({
    message: "Use client-side IndexedDB to delete story",
    storyId,
    instructions: "Call storyStorage.deleteStory(id) from the client",
  });
}
