import { Product, InsertProduct } from "@shared/schema";

const API_BASE = "";

export async function fetchProducts(params?: URLSearchParams): Promise<Product[]> {
  const url = `${API_BASE}/api/products${params ? `?${params.toString()}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/api/categories`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  return response.json();
}

export async function createProduct(product: InsertProduct): Promise<Product> {
  const response = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create product: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE}/api/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`);
  }
  return response.json();
}
