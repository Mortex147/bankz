import {
  users,
  transactions,
  type User,
  type UpsertUser,
  type InsertTransaction,
  type Transaction,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count, sum } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Additional user operations
  getUserStats(userId: string): Promise<any>;
  getAllUsers(options: { search?: string; limit: number; offset: number }): Promise<User[]>;
  updateUserBalance(userId: string, amount: number): Promise<void>;
  updateUserStatus(userId: string, isActive: boolean): Promise<void>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string, options: { type?: string; status?: string; limit: number; offset: number }): Promise<Transaction[]>;
  updateTransactionStatus(transactionId: number, status: string, adminId: string): Promise<Transaction | undefined>;
  getPendingWithdrawals(): Promise<any[]>;
  
  // Admin operations
  getAdminStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Additional user operations
  async getUserStats(userId: string): Promise<any> {
    const [stats] = await db
      .select({
        totalEarnings: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'earning' AND ${transactions.status} = 'completed' THEN ${transactions.amount}::numeric ELSE 0 END), 0)`,
        pendingWithdrawals: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'withdrawal' AND ${transactions.status} = 'pending' THEN ${transactions.amount}::numeric ELSE 0 END), 0)`,
        pendingWithdrawalCount: sql<number>`COUNT(CASE WHEN ${transactions.type} = 'withdrawal' AND ${transactions.status} = 'pending' THEN 1 END)`,
        thisMonth: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'earning' AND ${transactions.status} = 'completed' AND DATE_TRUNC('month', ${transactions.createdAt}) = DATE_TRUNC('month', CURRENT_DATE) THEN ${transactions.amount}::numeric ELSE 0 END), 0)`,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId));

    return stats;
  }

  async getAllUsers(options: { search?: string; limit: number; offset: number }): Promise<User[]> {
    let conditions = [];
    
    if (options.search) {
      conditions.push(
        sql`${users.email} ILIKE ${'%' + options.search + '%'} OR ${users.firstName} ILIKE ${'%' + options.search + '%'} OR ${users.lastName} ILIKE ${'%' + options.search + '%'}`
      );
    }
    
    return await db
      .select()
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(options.limit)
      .offset(options.offset)
      .orderBy(desc(users.createdAt));
  }

  async updateUserBalance(userId: string, amount: number): Promise<void> {
    await db
      .update(users)
      .set({
        balance: sql`${users.balance}::numeric + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    await db
      .update(users)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Transaction operations
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getUserTransactions(userId: string, options: { type?: string; status?: string; limit: number; offset: number }): Promise<Transaction[]> {
    let conditions = [eq(transactions.userId, userId)];
    
    if (options.type) {
      conditions.push(eq(transactions.type, options.type));
    }
    
    if (options.status) {
      conditions.push(eq(transactions.status, options.status));
    }
    
    return await db
      .select()
      .from(transactions)
      .where(and(...conditions))
      .limit(options.limit)
      .offset(options.offset)
      .orderBy(desc(transactions.createdAt));
  }

  async updateTransactionStatus(transactionId: number, status: string, adminId: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set({
        status,
        adminId,
        updatedAt: new Date(),
      })
      .where(eq(transactions.id, transactionId))
      .returning();
    return transaction;
  }

  async getPendingWithdrawals(): Promise<any[]> {
    return await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        method: transactions.method,
        createdAt: transactions.createdAt,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(transactions)
      .leftJoin(users, eq(transactions.userId, users.id))
      .where(and(eq(transactions.type, 'withdrawal'), eq(transactions.status, 'pending')))
      .orderBy(desc(transactions.createdAt));
  }

  // Admin operations
  async getAdminStats(): Promise<any> {
    const [userStats] = await db
      .select({
        totalUsers: count(users.id),
        newUsersThisWeek: sql<number>`COUNT(CASE WHEN ${users.createdAt} >= DATE_TRUNC('week', CURRENT_DATE) THEN 1 END)`,
      })
      .from(users);

    const [transactionStats] = await db
      .select({
        pendingWithdrawalAmount: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'withdrawal' AND ${transactions.status} = 'pending' THEN ${transactions.amount}::numeric ELSE 0 END), 0)`,
        pendingWithdrawalCount: sql<number>`COUNT(CASE WHEN ${transactions.type} = 'withdrawal' AND ${transactions.status} = 'pending' THEN 1 END)`,
        totalPlatformBalance: sql<number>`COALESCE(SUM(${users.balance}::numeric), 0)`,
      })
      .from(transactions)
      .rightJoin(users, sql`true`);

    return {
      ...userStats,
      ...transactionStats,
      activeSessions: 42, // Mock value for now
    };
  }
}

export const storage = new DatabaseStorage();