import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Application from "@/models/Application";
import mongoose from "mongoose";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const mobile = formData.get("mobile") as string;
    const linkedin = formData.get("linkedin") as string;
    const role = formData.get("role") as string;
    const about = formData.get("about") as string;
    const portfolioFile = formData.get("portfolio") as File | null;

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

    let portfolioFileId: mongoose.Types.ObjectId | null = null;
    let portfolioFileName: string | undefined;
    let portfolioFileSize: number | undefined;

    // Handle PDF file upload using GridFS
    if (portfolioFile && portfolioFile.size > 0) {
      // Validate file type
      if (portfolioFile.type !== "application/pdf") {
        return NextResponse.json(
          { error: "Only PDF files are allowed" },
          { status: 400 }
        );
      }

      // Validate file size
      if (portfolioFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "File size must be less than 10MB" },
          { status: 400 }
        );
      }

      try {
        const db = mongoose.connection.db;
        if (!db) {
          throw new Error("Database connection not available");
        }

        // Use mongoose's GridFSBucket which is compatible with mongoose connection
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "portfolios" });
        const uploadStream = bucket.openUploadStream(portfolioFile.name, {
          contentType: "application/pdf",
        });

        const fileBuffer = Buffer.from(await portfolioFile.arrayBuffer());
        uploadStream.end(fileBuffer);

        await new Promise<void>((resolve, reject) => {
          uploadStream.on("finish", () => {
            const fileId = uploadStream.id;
            if (fileId) {
              portfolioFileId = fileId as mongoose.Types.ObjectId;
            }
            portfolioFileName = portfolioFile.name;
            portfolioFileSize = portfolioFile.size;
            resolve();
          });
          uploadStream.on("error", reject);
        });
      } catch (fileError: any) {
        console.error("Error uploading file:", fileError);
        return NextResponse.json(
          { error: "Failed to upload portfolio file. Please try again." },
          { status: 500 }
        );
      }
    }

    // Create application document
    const applicationData: {
      fullName: string;
      email: string;
      mobile: string;
      linkedin: string;
      role: string;
      about: string;
      portfolioFileId?: string;
      portfolioFileName?: string;
      portfolioFileSize?: number;
    } = {
      fullName,
      email,
      mobile,
      linkedin,
      role,
      about,
    };

    if (portfolioFileId !== null) {
      applicationData.portfolioFileId = String(portfolioFileId);
    }
    if (portfolioFileName) {
      applicationData.portfolioFileName = portfolioFileName;
    }
    if (portfolioFileSize !== undefined) {
      applicationData.portfolioFileSize = portfolioFileSize;
    }

    const application = await Application.create(applicationData);

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

