import {
  users,
  surveys,
  invitations,
  responses,
  type User,
  type InsertUser,
  type UpsertUser,
  type Survey,
  type InsertSurvey,
  type Invitation,
  type InsertInvitation,
  type Response,
  type InsertResponse,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Survey operations
  getSurvey(id: number): Promise<Survey | undefined>;
  getSurveyWithInvitations(id: number): Promise<(Survey & { invitations: Invitation[] }) | undefined>;
  getUserSurveys(userId: string): Promise<Survey[]>;
  createSurvey(survey: InsertSurvey): Promise<Survey>;
  updateSurvey(id: number, updates: Partial<Survey>): Promise<Survey>;
  
  // Invitation operations
  getInvitation(id: number): Promise<Invitation | undefined>;
  getInvitationByToken(token: string): Promise<Invitation | undefined>;
  getSurveyInvitations(surveyId: number): Promise<Invitation[]>;
  createInvitation(invitation: InsertInvitation): Promise<Invitation>;
  updateInvitation(id: number, updates: Partial<Invitation>): Promise<Invitation>;
  
  // Response operations
  getInvitationResponses(invitationId: number): Promise<Response[]>;
  getSurveyResponses(surveyId: number): Promise<Response[]>;
  createResponse(response: InsertResponse): Promise<Response>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
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

  // Survey operations
  async getSurvey(id: number): Promise<Survey | undefined> {
    const [survey] = await db.select().from(surveys).where(eq(surveys.id, id));
    return survey;
  }

  async getSurveyWithInvitations(id: number): Promise<(Survey & { invitations: Invitation[] }) | undefined> {
    const survey = await this.getSurvey(id);
    if (!survey) return undefined;
    
    const surveyInvitations = await this.getSurveyInvitations(id);
    return { ...survey, invitations: surveyInvitations };
  }

  async getUserSurveys(userId: string): Promise<Survey[]> {
    return await db
      .select()
      .from(surveys)
      .where(eq(surveys.userId, userId))
      .orderBy(desc(surveys.createdAt));
  }

  async createSurvey(insertSurvey: InsertSurvey): Promise<Survey> {
    const [survey] = await db
      .insert(surveys)
      .values(insertSurvey)
      .returning();
    return survey;
  }

  async updateSurvey(id: number, updates: Partial<Survey>): Promise<Survey> {
    const [survey] = await db
      .update(surveys)
      .set(updates)
      .where(eq(surveys.id, id))
      .returning();
    return survey;
  }

  // Invitation operations
  async getInvitation(id: number): Promise<Invitation | undefined> {
    const [invitation] = await db.select().from(invitations).where(eq(invitations.id, id));
    return invitation;
  }

  async getInvitationByToken(token: string): Promise<Invitation | undefined> {
    const [invitation] = await db.select().from(invitations).where(eq(invitations.token, token));
    return invitation;
  }

  async getSurveyInvitations(surveyId: number): Promise<Invitation[]> {
    return await db
      .select()
      .from(invitations)
      .where(eq(invitations.surveyId, surveyId))
      .orderBy(desc(invitations.createdAt));
  }

  async createInvitation(insertInvitation: InsertInvitation): Promise<Invitation> {
    const [invitation] = await db
      .insert(invitations)
      .values(insertInvitation)
      .returning();
    return invitation;
  }

  async updateInvitation(id: number, updates: Partial<Invitation>): Promise<Invitation> {
    const [invitation] = await db
      .update(invitations)
      .set(updates)
      .where(eq(invitations.id, id))
      .returning();
    return invitation;
  }

  // Response operations
  async getInvitationResponses(invitationId: number): Promise<Response[]> {
    return await db
      .select()
      .from(responses)
      .where(eq(responses.invitationId, invitationId))
      .orderBy(desc(responses.createdAt));
  }

  async getSurveyResponses(surveyId: number): Promise<Response[]> {
    const result = await db
      .select({
        id: responses.id,
        invitationId: responses.invitationId,
        questionId: responses.questionId,
        answer: responses.answer,
        createdAt: responses.createdAt,
      })
      .from(responses)
      .innerJoin(invitations, eq(responses.invitationId, invitations.id))
      .where(eq(invitations.surveyId, surveyId))
      .orderBy(desc(responses.createdAt));
    return result;
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const [response] = await db
      .insert(responses)
      .values(insertResponse)
      .returning();
    return response;
  }
}

export const storage = new DatabaseStorage();