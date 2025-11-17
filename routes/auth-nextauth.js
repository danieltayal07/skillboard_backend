import { NextAuthHandler } from "next-auth";
import { authOptions } from "../config/auth.js";

// Create a handler for NextAuth API routes
export default async function handler(req, res) {
  return NextAuthHandler(req, res, authOptions);
}

