# Overview

This is an automated trading platform that combines Telegram bot integration with AI-powered product parsing and a modern web interface. The system allows sellers to add products through a Telegram channel, where a bot processes messages using OpenAI API to extract structured product data, which is then displayed on a web marketplace interface for buyers.

The project consists of three main components:
1. A Telegram bot that processes product messages and extracts structured data using OpenAI
2. A REST API backend built with Express.js that manages product data
3. A React frontend with modern UI components for browsing and filtering products

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
- **Express.js API Server**: Handles HTTP requests for product management with RESTful endpoints
- **In-Memory Storage with File Persistence**: Uses a custom storage class that maintains data in memory while persisting to JSON files for durability
- **Telegram Bot Integration**: Node.js bot using `node-telegram-bot-api` that listens for messages and processes them through OpenAI
- **OpenAI Integration**: Uses GPT-4o model to parse unstructured product descriptions into structured JSON data

## Frontend Architecture
- **React with TypeScript**: Modern single-page application using functional components and hooks
- **Shadcn/ui Component Library**: Comprehensive UI component system built on Radix UI primitives with Tailwind CSS styling
- **React Query (TanStack Query)**: Handles server state management, caching, and data fetching
- **Wouter Routing**: Lightweight client-side routing solution
- **Responsive Design**: Mobile-first approach with Tailwind CSS for styling

## Database Design
- **PostgreSQL Schema**: Defined using Drizzle ORM with tables for users and products
- **Drizzle Configuration**: Set up for PostgreSQL with migrations support
- **Fallback Storage**: Currently using JSON file storage with in-memory caching as a fallback

## API Structure
- `GET /api/products` - Fetch products with optional filtering (category, search, price range)
- `POST /api/products` - Create new product (for bot integration)
- `GET /api/categories` - Fetch available product categories
- `GET /api/stats` - Fetch platform statistics

## Data Models
- **Product Model**: Contains title, category, price (in cents), description, image URL, and timestamps
- **User Model**: Basic user structure with username and password fields
- **Validation**: Zod schemas for input validation and type safety

## Build System
- **Vite**: Modern build tool for the frontend with React plugin
- **ESBuild**: Used for server-side bundling in production
- **TypeScript**: Full type safety across the entire application
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)

# External Dependencies

## Core Backend Services
- **OpenAI API**: GPT-4o model for parsing product descriptions into structured data
- **Telegram Bot API**: For receiving and processing messages from Telegram channels
- **PostgreSQL Database**: Primary data storage (configured via DATABASE_URL environment variable)
- **Neon Database**: Serverless PostgreSQL provider integration

## Frontend Libraries
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **TanStack React Query**: Server state management and data fetching
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hook Form**: Form state management and validation

## Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **Vite Plugins**: Runtime error overlay, Cartographer for Replit integration
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

## Authentication & Session Management
- **Connect PG Simple**: PostgreSQL session store for Express sessions

## Styling & Design System
- **Class Variance Authority**: For creating consistent component variants
- **clsx & tailwind-merge**: Utility for conditional and merged class names
- **Embla Carousel**: Carousel component for image galleries