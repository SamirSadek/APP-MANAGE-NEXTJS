import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "data.json");

export async function POST(req: Request) {
  try {
    const newEntry = await req.json();

    let existingData = [];
    if (fs.existsSync(DATA_FILE_PATH)) {
      const rawData = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      existingData = JSON.parse(rawData);
    }

    // Find existing entry by ID
    const existingIndex = existingData.findIndex((entry) => entry.id === newEntry.id);

    if (existingIndex !== -1) {
      // Update existing entry
      existingData[existingIndex] = { ...existingData[existingIndex], ...newEntry };
    } else {
      // Add new entry if ID not found
      existingData.push(newEntry);
    }

    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(existingData, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: existingIndex !== -1 ? "Data updated successfully!" : "Data saved successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error saving data", error },
      { status: 500 }
    );
  }
}
