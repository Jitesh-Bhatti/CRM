# 🚀 AgencyOS — SaaS CRM for Agencies & Development Teams

AgencyOS is a **multi-tenant SaaS platform** designed to help development agencies and freelance teams manage their entire workflow in one unified system.

Instead of juggling multiple tools for CRM, project management, task tracking, documentation, team capacity, and billing — AgencyOS provides a **single integrated operating system for agencies**.

Built with a **scalable SaaS architecture**, the platform enables organizations to manage clients, projects, teams, tasks, files, and billing — while maintaining complete tenant isolation.

---

# 🎥 Pitch & Demo

📌 **Pitch Video**

https://drive.google.com/drive/u/0/folders/1qPUta0pDZX-oR969iLn7x6v2f8KFxCEH

📌 **Demo Video**

https://drive.google.com/drive/u/0/folders/1qPUta0pDZX-oR969iLn7x6v2f8KFxCEH

---

# 📌 Problem Statement

Modern agencies manage work across fragmented tools:

• Client communication in emails or messaging apps
• Project tracking in tools like Trello or Jira
• Tasks in separate systems
• Documentation in shared drives
• Billing in spreadsheets

This fragmentation creates several problems:

• Lack of operational visibility
• Difficult project coordination
• Inefficient team management
• Poor scalability for growing teams

Agencies spend more time managing tools than delivering value.

---

# 💡 Our Solution

AgencyOS provides a **unified SaaS platform** that integrates all essential agency operations:

• CRM for managing clients and leads
• Project and task management
• Team capacity tracking
• File and documentation management
• Notifications and activity logs
• Time tracking and project notes
• Billing and subscription management
• Super admin SaaS control panel

All organizations operate in **isolated multi-tenant environments**, ensuring security and scalability.

---

# 🧩 Core Features

### CRM System

Manage leads, clients, contacts, and relationships.

### Project Management

Create projects, milestones, requirements, and change requests.

### Task Management

Assign tasks, track progress, and collaborate with comments.

### Workforce Management

Track team skills, availability, and workload capacity.

### File & Documentation

Attach files, maintain project notes, and organize documentation.

### Notifications & Activity Logs

Real-time alerts and full audit trail of system activity.

### Billing & Subscriptions

SaaS plans, subscriptions, invoices, and payment tracking.

### Platform Admin

Global control panel to manage tenants, plans, and platform activity.

---

# 🏗 System Architecture

The system is designed using a **modular SaaS architecture**.

Frontend Layer
React + Vite + TypeScript

Backend Layer
Node.js + Express + TypeScript

Database
PostgreSQL (Multi-tenant schema)

Infrastructure

Docker
Nginx
WebSocket server
Background workers

---

# 🧠 High Level Architecture

Client Applications

Web CRM (Agency Users)
Admin Dashboard (Platform Owner)

↓

API Layer

Node.js + Express Modular Backend

↓

Core Modules

Auth
Users
Organizations
CRM
Projects
Tasks
Workforce
Notifications
Billing
Platform Admin

↓

Database Layer

PostgreSQL Multi-Tenant Schema

---

# 🗄 Database Overview

The database follows a **multi-tenant design** where each organization is isolated by `organization_id`.

Main entities include:

Organizations
Users
Roles & Permissions

CRM

Leads
Clients
Client Contacts

Projects

Projects
Milestones
Requirements
Change Requests

Tasks

Tasks
Task Comments

Operations

Files
Time Entries
Project Notes

Workforce

User Skills
User Availability

Platform

Notifications
Activity Logs
API Keys

Billing

Plans
Subscriptions
Invoices
Payment Transactions

Admin

Super Admins
Platform Logs

---

# 📂 Monorepo Architecture

The project follows a **Turborepo-style monorepo architecture**.

crm-saas/

apps/

api → Main backend API
web → CRM frontend application
admin → Platform admin dashboard
websocket → Real-time event server
worker → Background job processors

packages/

auth → Shared authentication utilities
config → Environment configuration
database → Database client & migrations
events → Event system utilities
types → Shared TypeScript types
ui → Shared UI components
utils → Logging, helpers, responses
validation → Schema validation utilities

infrastructure/

docker → Container definitions
compose → Docker compose setup
nginx → Reverse proxy configuration

scripts/

Database migrations
Seeding
Development utilities

---

# ⚙️ Backend Architecture

The backend follows a **modular service architecture**.

Each module contains:

controllers → HTTP request handlers
services → business logic
repositories → database queries
validators → input validation
routes → API route definitions
types → module-specific TypeScript types

Example module:

modules/projects/

controllers
services
repositories
validators
routes
types

---

# 💻 Frontend Architecture

Frontend is built using **React + Vite + TypeScript**.

Structure:

src/

components → reusable UI components
layouts → application layout components
contexts → React context providers
hooks → custom React hooks
router → application routing
services → API communication layer
store → state management
types → shared frontend types
utils → helper functions

features/

auth
clients
leads
projects
tasks
notifications
billing

pages/

dashboard
clients
leads
projects
tasks
workforce
billing
notifications
settings

---

# ⚡ Project Setup Guide

## 1️⃣ Clone Repository

branch - main

git clone https://github.com/your-repo/crm-saas.git

cd crm-saas

---

## 2️⃣ Install Dependencies

Using pnpm workspaces

pnpm install

---

## 3️⃣ Configure Environment Variables

Create `.env` file in project root:

DATABASE_URL=postgresql://postgres:root@localhost:5432/postgres

JWT_SECRET=<enter your 32 character secret string>
JWT_REFRESH_SECRET=<enter your 32 character secret string>

PORT=4000

---

## 4️⃣ Run Database Migrations

pnpm run db:migrate

or 

CRM\crm-saas\packages\database\migrations\script.txt
contains full database schema run them in postgresSQL

---

## 5️⃣ Start Development Servers

Start All : 

at dir : CRM/crm-saas>
pnpm run dev 

Start backend:

pnpm --filter api dev

Start frontend:

pnpm --filter web dev

---

# 🔮 Future Improvements

• AI-powered task prioritization
• Advanced analytics dashboards
• Third-party integrations
• Mobile application
• Workflow automation

---

# 👥 Team

THREESTACK

Team Members:

Hitarth Hindocha
Manav Jungi
Jitesh Bhatti

---

# 📜 License

This project was built as part of a Elite Hack 1.0 hackathon submission.
