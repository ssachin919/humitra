import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Application from "@/models/Application";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      fullName,
      email,
      mobile,
      linkedin,
      role,
      about,
      portfolioFileName,
      portfolioFileSize,
    } = body;

    // Validate required fields
    if (!fullName || !email || !mobile || !linkedin || !role || !about) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["Product", "Design", "Marketing", "Tech", "Operations", "Other"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role selected" },
        { status: 400 }
      );
    }

    // Create application document
    const application = await Application.create({
      fullName,
      email,
      mobile,
      linkedin,
      role,
      about,
      portfolioFileName,
      portfolioFileSize,
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        id: application._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting application:", error);

    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "An application with this email already exists" },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: errors.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}

