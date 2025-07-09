# InsightEngine - 360° Feedback Platform

## Overview

InsightEngine is a modern web application that provides 360-degree feedback insights through AI-powered analysis. The platform allows users to collect anonymous feedback from their circle of colleagues, friends, and mentors, then generates comprehensive reports analyzed by AI mentors with different perspectives and wisdom styles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack architecture with a clear separation between frontend and backend components:

- **Frontend**: React-based single-page application built with Vite
- **Backend**: Node.js/Express API server
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom design system using CSS variables
- **shadcn/ui** component library for consistent UI patterns
- **TanStack Query** for server state management and caching
- **React Hook Form** with Zod validation for form handling
- **Wouter** for lightweight client-side routing

### Backend Architecture
- **Express.js** server with TypeScript
- **Drizzle ORM** for type-safe database operations
- **Neon Database** (PostgreSQL) for data persistence
- **RESTful API** design with clear resource endpoints
- **Middleware** for request logging and error handling

### Database Schema
The application uses four main entities:
- **Users**: User accounts with email and name
- **Surveys**: 360° feedback surveys with focus areas and AI mentor selection
- **Invitations**: Tokenized invitations sent to feedback providers
- **Responses**: Anonymous feedback responses linked to invitations

### External Integrations
- **OpenAI API**: For AI-powered report generation with different mentor personalities
- **SendGrid**: For email delivery of invitations and reminders
- **Neon Database**: Cloud PostgreSQL database hosting
- **PDFKit**: For generating downloadable PDF reports

## Data Flow

1. **User Onboarding**: Users create accounts and set up surveys by selecting focus areas, AI mentors, and adding contacts
2. **Invitation Process**: System generates unique tokens and sends email invitations to feedback providers
3. **Feedback Collection**: Anonymous respondents complete surveys through tokenized links
4. **AI Analysis**: Once sufficient responses are collected, OpenAI analyzes feedback using selected AI mentor personality
5. **Report Generation**: Comprehensive insights are generated with personality analysis, strengths, growth areas, and mentor-specific advice
6. **Report Delivery**: Users can view reports online or download as PDFs

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **@sendgrid/mail**: Email delivery service
- **openai**: AI-powered report generation
- **wouter**: Lightweight React routing

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives for complex components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety across the application
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

The application is designed for modern deployment platforms:

### Build Process
- **Frontend**: Vite builds the React application to static assets
- **Backend**: esbuild bundles the Express server for production
- **Database**: Drizzle migrations manage schema changes

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **OPENAI_API_KEY**: AI service authentication
- **SENDGRID_API_KEY**: Email service authentication
- **BASE_URL**: Application base URL for email links
- **FROM_EMAIL**: Sender email address for invitations

### Development Workflow
- **Local Development**: `npm run dev` starts both frontend and backend in development mode
- **Type Checking**: `npm run check` validates TypeScript across the codebase
- **Database Management**: `npm run db:push` applies schema changes

The architecture prioritizes type safety, developer experience, and scalability while maintaining a clear separation of concerns between data, business logic, and presentation layers.