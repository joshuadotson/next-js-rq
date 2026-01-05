import { NextResponse } from "next/server";
import { mockProducts, type Product } from "@/lib/mock-data/products";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

  const { id } = await params;
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

  const { id } = await params;
  const productIndex = mockProducts.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields: name, description" },
        { status: 400 }
      );
    }

    const existingProduct = mockProducts[productIndex];
    const now = new Date().toISOString();

    const updatedProduct: Product = {
      ...existingProduct,
      name: name.trim(),
      description: description.trim(),
      updatedAt: now,
    };

    mockProducts[productIndex] = updatedProduct;

    return NextResponse.json(updatedProduct);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Simulate API delay (100-500ms)
  await delay(Math.random() * 400 + 100);

  const { id } = await params;
  const productIndex = mockProducts.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  mockProducts.splice(productIndex, 1);

  return NextResponse.json({ success: true }, { status: 200 });
}

