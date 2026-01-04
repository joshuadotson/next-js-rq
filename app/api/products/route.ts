import { NextResponse } from "next/server";
import { mockProducts, type Product } from "@/lib/mock-data/products";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  // Apply pagination
  const offsetNum = offset ? parseInt(offset, 10) : 0;
  const limitNum = limit ? parseInt(limit, 10) : mockProducts.length;
  const paginatedProducts = mockProducts.slice(offsetNum, offsetNum + limitNum);

  return NextResponse.json({
    products: paginatedProducts,
    total: mockProducts.length,
    limit: limitNum,
    offset: offsetNum,
  });
}

export async function POST(request: Request) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields: name, description" },
        { status: 400 }
      );
    }

    // Generate new product ID (increment from highest existing ID)
    const maxId = Math.max(
      ...mockProducts.map((product) => parseInt(product.id, 10)),
      0
    );
    const newId = (maxId + 1).toString();

    // Create new product with current timestamp
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: newId,
      name: name.trim(),
      description: description.trim(),
      createdAt: now,
      updatedAt: now,
    };

    // Add to mockProducts array (in-memory, won't persist across server restarts)
    mockProducts.unshift(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

