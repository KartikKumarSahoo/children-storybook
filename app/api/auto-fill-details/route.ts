import { generateAgeAppropriateSuggestions } from "@/lib/predefined-values";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childAge = searchParams.get("childAge");

    if (!childAge) {
      return NextResponse.json(
        { success: false, error: "Child age is required" },
        { status: 400 }
      );
    }

    const age = parseInt(childAge);

    if (isNaN(age) || age < 3 || age > 12) {
      return NextResponse.json(
        { success: false, error: "Age must be between 3 and 12" },
        { status: 400 }
      );
    }

    const suggestions = generateAgeAppropriateSuggestions(age);

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("Error generating auto-fill suggestions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
