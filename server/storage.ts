import { type User, type InsertUser, type Product, type InsertProduct } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  getProductsByCategory(category: string): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private productsFile: string;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.productsFile = path.join(process.cwd(), "products.json");
    this.loadProductsFromFile();
  }

  private async loadProductsFromFile() {
    try {
      const data = await fs.readFile(this.productsFile, "utf-8");
      const productsArray: Product[] = JSON.parse(data);
      for (const product of productsArray) {
        this.products.set(product.id, product);
      }
      console.log(`Loaded ${productsArray.length} products from file`);
    } catch (error) {
      console.log("No existing products file found, starting with empty products");
      await this.saveProductsToFile();
    }
  }

  private async saveProductsToFile() {
    try {
      const productsArray = Array.from(this.products.values());
      await fs.writeFile(this.productsFile, JSON.stringify(productsArray, null, 2));
    } catch (error) {
      console.error("Error saving products to file:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date(),
      image: insertProduct.image || null
    };
    this.products.set(id, product);
    await this.saveProductsToFile();
    console.log(`Product created: ${product.title}`);
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const storage = new MemStorage();
