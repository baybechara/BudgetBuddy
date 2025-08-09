import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products with optional filtering
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search, minPrice, maxPrice } = req.query;
      
      let products = await storage.getProducts();
      
      // Apply filters
      if (category && typeof category === "string") {
        products = products.filter(p => 
          p.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (search && typeof search === "string") {
        const searchTerm = search.toLowerCase();
        products = products.filter(p => 
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        );
      }
      
      if (minPrice && typeof minPrice === "string") {
        const min = parseInt(minPrice);
        if (!isNaN(min)) {
          products = products.filter(p => p.price >= min);
        }
      }
      
      if (maxPrice && typeof maxPrice === "string") {
        const max = parseInt(maxPrice);
        if (!isNaN(max)) {
          products = products.filter(p => p.price <= max);
        }
      }
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get unique categories
  app.get("/api/categories", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const categories = Array.from(new Set(products.map(p => p.category))).sort();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Create new product (used by Telegram bot)
  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid product data", errors: error.errors });
      } else {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Failed to create product" });
      }
    }
  });

  // Get product statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayAdded = products.filter(p => 
        new Date(p.createdAt) >= today
      ).length;
      
      const categories = Array.from(new Set(products.map(p => p.category)));
      
      res.json({
        totalProducts: products.length,
        todayAdded,
        categoriesCount: categories.length,
        botStatus: "online" // This would be dynamic in real implementation
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
