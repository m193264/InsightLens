import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSurveySchema, insertInvitationSchema, insertResponseSchema } from "@shared/schema";
import { generateReport } from "./services/openai";
import { sendInvitationEmail, sendReminderEmail } from "./services/email";
import { generatePDFReport } from "./services/pdf";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.json(existingUser);
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Survey routes
  app.post("/api/surveys", async (req, res) => {
    try {
      const surveyData = insertSurveySchema.parse(req.body);
      const survey = await storage.createSurvey(surveyData);
      res.json(survey);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/surveys/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const survey = await storage.getSurveyWithInvitations(id);
      
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      
      res.json(survey);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/surveys/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const survey = await storage.updateSurvey(id, updates);
      res.json(survey);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/surveys", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const surveys = await storage.getUserSurveys(userId);
      res.json(surveys);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Invitation routes
  app.post("/api/surveys/:surveyId/invitations", async (req, res) => {
    try {
      const surveyId = parseInt(req.params.surveyId);
      const invitationsData = z.array(insertInvitationSchema).parse(req.body);
      
      const invitations = [];
      for (const invitationData of invitationsData) {
        const invitation = await storage.createInvitation({
          ...invitationData,
          surveyId,
        });
        invitations.push(invitation);
      }
      
      res.json(invitations);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/surveys/:surveyId/send-invitations", async (req, res) => {
    try {
      const surveyId = parseInt(req.params.surveyId);
      console.log(`[email] Sending invitations for survey ${surveyId}`);
      
      const survey = await storage.getSurveyWithInvitations(surveyId);
      
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }

      const user = await storage.getUser(survey.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log(`[email] Found ${survey.invitations.length} invitations for user ${user.name}`);

      let emailsSent = 0;
      for (const invitation of survey.invitations) {
        if (invitation.status === "pending") {
          console.log(`[email] Sending email to ${invitation.email} (${invitation.name})`);
          const emailSuccess = await sendInvitationEmail(invitation, user.name);
          if (emailSuccess) {
            await storage.updateInvitation(invitation.id, {
              status: "pending",
              sentAt: new Date(),
            });
            emailsSent++;
            console.log(`[email] Email sent successfully to ${invitation.email}`);
          } else {
            console.error(`[email] Failed to send email to ${invitation.email}`);
          }
        }
      }
      
      console.log(`[email] Total emails sent: ${emailsSent}`);
      res.json({ message: `${emailsSent} invitations sent successfully` });
    } catch (error: any) {
      console.error('[email] Error sending invitations:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/invitations/:id/remind", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const invitation = await storage.getInvitation(id);
      
      if (!invitation) {
        return res.status(404).json({ message: "Invitation not found" });
      }

      const survey = await storage.getSurvey(invitation.surveyId);
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }

      const user = await storage.getUser(survey.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await sendReminderEmail(invitation, user.name);
      
      res.json({ message: "Reminder sent successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Anonymous survey routes
  app.get("/api/survey/:token", async (req, res) => {
    try {
      const token = req.params.token;
      const invitation = await storage.getInvitationByToken(token);
      
      if (!invitation) {
        return res.status(404).json({ message: "Survey not found" });
      }

      const survey = await storage.getSurvey(invitation.surveyId);
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }

      const user = await storage.getUser(survey.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        invitation,
        survey: {
          id: survey.id,
          title: survey.title,
          focusAreas: survey.focusAreas,
        },
        userName: user.name,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/survey/:token/responses", async (req, res) => {
    try {
      const token = req.params.token;
      const invitation = await storage.getInvitationByToken(token);
      
      if (!invitation) {
        return res.status(404).json({ message: "Survey not found" });
      }

      const responseData = insertResponseSchema.parse({
        ...req.body,
        invitationId: invitation.id,
      });
      
      const response = await storage.createResponse(responseData);
      
      // Update invitation status
      await storage.updateInvitation(invitation.id, {
        status: "in_progress",
      });
      
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/survey/:token/complete", async (req, res) => {
    try {
      const token = req.params.token;
      const invitation = await storage.getInvitationByToken(token);
      
      if (!invitation) {
        return res.status(404).json({ message: "Survey not found" });
      }

      await storage.updateInvitation(invitation.id, {
        status: "completed",
        completedAt: new Date(),
      });
      
      res.json({ message: "Survey completed successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Report generation
  app.post("/api/surveys/:id/generate-report", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const survey = await storage.getSurveyWithInvitations(id);
      
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }

      const user = await storage.getUser(survey.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get all responses for this survey
      const responses = await storage.getSurveyResponses(id);
      
      // Check if we have enough responses
      const completedInvitations = survey.invitations.filter(inv => inv.status === "completed");
      if (completedInvitations.length < 3) {
        return res.status(400).json({ message: "Need at least 3 completed responses to generate report" });
      }

      // Generate AI report
      const reportData = await generateReport(survey, responses, user.name);
      
      // Update survey with report data
      await storage.updateSurvey(id, {
        reportData,
        status: "completed",
        completedAt: new Date(),
      });
      
      res.json({ reportData });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/surveys/:id/report/pdf", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const survey = await storage.getSurvey(id);
      
      if (!survey || !survey.reportData) {
        return res.status(404).json({ message: "Report not found" });
      }

      const user = await storage.getUser(survey.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const pdfBuffer = await generatePDFReport(survey.reportData, user.name);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="360-insight-report-${user.name.replace(/\s+/g, '-').toLowerCase()}.pdf"`);
      res.send(pdfBuffer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
