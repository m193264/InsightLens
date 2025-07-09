import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const surveys = pgTable("surveys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  focusAreas: jsonb("focus_areas").$type<string[]>().notNull(),
  aiMentor: text("ai_mentor").notNull(),
  status: text("status").notNull().default("setup"), // setup, collecting, analyzing, completed
  selfAssessment: jsonb("self_assessment").$type<Record<string, any>>(),
  reportData: jsonb("report_data").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").notNull().references(() => surveys.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  relationship: text("relationship").notNull(),
  token: uuid("token").defaultRandom().notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  sentAt: timestamp("sent_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  invitationId: integer("invitation_id").notNull().references(() => invitations.id),
  questionId: text("question_id").notNull(),
  answer: jsonb("answer").$type<any>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  surveys: many(surveys),
}));

export const surveysRelations = relations(surveys, ({ one, many }) => ({
  user: one(users, {
    fields: [surveys.userId],
    references: [users.id],
  }),
  invitations: many(invitations),
}));

export const invitationsRelations = relations(invitations, ({ one, many }) => ({
  survey: one(surveys, {
    fields: [invitations.surveyId],
    references: [surveys.id],
  }),
  responses: many(responses),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  invitation: one(invitations, {
    fields: [responses.invitationId],
    references: [invitations.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSurveySchema = createInsertSchema(surveys).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertInvitationSchema = createInsertSchema(invitations).omit({
  id: true,
  token: true,
  sentAt: true,
  completedAt: true,
  createdAt: true,
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = z.infer<typeof insertSurveySchema>;
export type Invitation = typeof invitations.$inferSelect;
export type InsertInvitation = z.infer<typeof insertInvitationSchema>;
export type Response = typeof responses.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
