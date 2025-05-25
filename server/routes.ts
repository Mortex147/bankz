import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { depositSchema, withdrawalSchema, type InsertTransaction } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User balance and stats
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Transactions
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { type, status, limit = 10, offset = 0 } = req.query;
      
      const transactions = await storage.getUserTransactions(userId, {
        type: type as string,
        status: status as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Deposit funds
  app.post('/api/deposit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = depositSchema.parse(req.body);
      
      const transaction = await storage.createTransaction({
        userId,
        type: 'deposit',
        amount: validatedData.amount.toString(),
        status: 'completed', // Simulated instant completion
        method: validatedData.method,
        description: `Deposit via ${validatedData.method}`,
      });

      // Update user balance
      await storage.updateUserBalance(userId, validatedData.amount);
      
      res.json({ 
        message: 'Deposit successful',
        transaction 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: error.errors 
        });
      }
      console.error("Error processing deposit:", error);
      res.status(500).json({ message: "Failed to process deposit" });
    }
  });

  // Request withdrawal
  app.post('/api/withdrawal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = withdrawalSchema.parse(req.body);
      
      // Check if user has sufficient balance
      const user = await storage.getUser(userId);
      if (!user || parseFloat(user.balance) < validatedData.amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      
      const transaction = await storage.createTransaction({
        userId,
        type: 'withdrawal',
        amount: validatedData.amount.toString(),
        status: 'pending',
        method: validatedData.method,
        description: `Withdrawal request via ${validatedData.method}`,
      });
      
      res.json({ 
        message: 'Withdrawal request submitted for approval',
        transaction 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: error.errors 
        });
      }
      console.error("Error processing withdrawal:", error);
      res.status(500).json({ message: "Failed to process withdrawal" });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const { search, limit = 20, offset = 0 } = req.query;
      const users = await storage.getAllUsers({
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/pending-withdrawals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const withdrawals = await storage.getPendingWithdrawals();
      res.json(withdrawals);
    } catch (error) {
      console.error("Error fetching pending withdrawals:", error);
      res.status(500).json({ message: "Failed to fetch pending withdrawals" });
    }
  });

  app.patch('/api/admin/withdrawal/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['completed', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const transaction = await storage.updateTransactionStatus(
        parseInt(id), 
        status, 
        userId
      );
      
      // If approved, deduct from user balance
      if (status === 'completed' && transaction) {
        await storage.updateUserBalance(
          transaction.userId, 
          -parseFloat(transaction.amount)
        );
      }
      
      res.json({ 
        message: `Withdrawal ${status}`,
        transaction 
      });
    } catch (error) {
      console.error("Error updating withdrawal:", error);
      res.status(500).json({ message: "Failed to update withdrawal" });
    }
  });

  app.patch('/api/admin/user/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const adminUserId = req.user.claims.sub;
      const adminUser = await storage.getUser(adminUserId);
      
      if (!adminUser || adminUser.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const { id } = req.params;
      const { isActive } = req.body;
      
      await storage.updateUserStatus(id, isActive);
      
      res.json({ 
        message: `User ${isActive ? 'activated' : 'suspended'}` 
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
