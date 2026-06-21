# Personal Portfolio & Blog Platform - Project Specification

## Project Overview

Build a modern, production-ready personal portfolio, blog, and content platform for a senior full-stack software engineer.

The website should showcase:

* Professional profile
* Portfolio projects
* Technical blog articles
* Courses (YouTube-based)
* Books and digital products
* Contact information
* Future content expansion

The platform must include a secure admin dashboard for managing all content.

This project should be implemented using modern engineering best practices and production-grade architecture.

---

# Core Technology Stack

## Frontend

* Next.js 15+ (App Router)
* TypeScript
* React Server Components where appropriate
* Tailwind CSS
* shadcn/ui (customized heavily, not default appearance)
* Framer Motion (subtle animations only)

## Backend

Use Next.js as a full-stack framework.

* Server Actions
* Route Handlers
* Middleware
* API Routes where needed

No separate backend service.

---

## Database

* PostgreSQL
* Prisma ORM

Database provider:

* Neon PostgreSQL

---

## Authentication

* Auth.js (NextAuth)

Requirements:

* Admin-only authentication
* Single admin account
* Protected dashboard routes
* Secure session management

---

## Storage

* Cloudinary

Used for:

* Blog cover images
* Project screenshots
* Book covers
* Media assets

---

## Deployment

* Vercel

Application must be optimized for Vercel deployment.

---

# Approved Technology Stack (Mandatory)

## Critical Rule

The AI agent MUST ONLY use the technologies listed below.

Do NOT introduce additional frameworks, UI kits, state management libraries, ORMs, authentication libraries, styling libraries, validation libraries, editors, or utility packages unless absolutely necessary and explicitly approved.

Favor fewer dependencies and long-term maintainability.

Every dependency added must have a clear purpose.

---

# Core Stack

## Framework

Next.js 15+

Requirements:

* App Router
* Server Components by default
* Server Actions where appropriate
* Route Handlers
* TypeScript Strict Mode

Use the latest stable Next.js version available during implementation.

Do NOT use Pages Router.

---

## Language

TypeScript

Requirements:

* Strict mode enabled
* No `any`
* Strong typing everywhere

---

## Styling

Tailwind CSS v4+

Requirements:

* Utility-first styling
* Design tokens
* Consistent spacing scale
* Mobile-first development

Do not use:

* Styled Components
* Emotion
* CSS-in-JS solutions

---

## Component System

shadcn/ui

Requirements:

* Use as a foundation only
* Customize heavily
* Create unique design language
* Avoid default shadcn appearance

The final UI must not look like a standard shadcn demo.

---

## ORM

Prisma ORM

Requirements:

* PostgreSQL
* Typed queries
* Proper schema design
* Database migrations

---

## Database

PostgreSQL

Provider:

* Neon

---

## Authentication

Auth.js (NextAuth)

Requirements:

* Credentials provider
* Single admin account
* Protected admin routes
* JWT strategy

Do NOT introduce alternative auth providers.

---

## Validation

Zod

Requirements:

* Form validation
* API validation
* Environment validation
* Database input validation

All user input must be validated.

---

## State Management

Zustand

Requirements:

Use ONLY when global state is necessary.

Examples:

* Theme state
* UI preferences
* Dashboard state

Do NOT use Zustand for server data.

Use:

* Server Components
* Server Actions
* React Query when needed

before introducing global state.

---

## Data Fetching

Preferred order:

1. Server Components
2. Server Actions
3. Route Handlers

Only use React Query when client-side caching is genuinely needed.

Do not fetch everything on the client.

---

## Forms

React Hook Form

Combined with:

* Zod

Requirements:

* Type-safe forms
* Reusable form components

---

## File Uploads

Cloudinary

Requirements:

* Secure uploads
* Image optimization
* Responsive images

Do not store files locally.

---

## Rich Text Editor

Tiptap

Requirements:

* Blog writing
* Code blocks
* Tables
* Images
* Headings
* Lists

Store editor content in structured format.

---

## Animations

Framer Motion

Requirements:

* Subtle animations only
* Performance first
* No excessive motion

Avoid flashy interactions.

---

## Icons

Lucide React

Use consistently across the application.

Do not mix icon libraries.

---

## Theme Support

next-themes

Requirements:

* Dark mode
* Light mode
* System preference support

---

## Utility Libraries

Allowed:

* date-fns
* clsx
* tailwind-merge

Avoid adding utility libraries without necessity.

---

# Project Setup

## Create Application

```bash
npx create-next-app@latest portfolio-platform \
--typescript \
--tailwind \
--eslint \
--app \
--src-dir \
--import-alias "@/*"
```

---

## Install Core Dependencies

```bash
npm install prisma @prisma/client

npm install next-auth

npm install zod

npm install zustand

npm install react-hook-form

npm install @hookform/resolvers

npm install next-themes

npm install framer-motion

npm install lucide-react

npm install date-fns

npm install clsx

npm install tailwind-merge

npm install @tiptap/react
npm install @tiptap/starter-kit

npm install cloudinary
```

---

## Install shadcn

```bash
npx shadcn@latest init
```

Use only required components.

Avoid generating unnecessary components.

---

## Install Prisma

```bash
npx prisma init
```

---

## Configure Environment Variables

Create:

```env
DATABASE_URL=

AUTH_SECRET=

NEXTAUTH_URL=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

Validate all environment variables with Zod.

---

# Architecture Rules

## Feature-Based Structure

Use:

src/

app/
components/
features/
actions/
lib/
hooks/
server/
services/
types/
validators/

---

## Component Rules

Maximum responsibilities:

* One purpose per component
* Small reusable components
* Avoid giant files

Preferred:

* Under 200 lines per component

---

## Server First

Default mindset:

Server Component first.

Only use Client Components when necessary.

---

## Performance Rules

Always:

* Optimize images
* Use lazy loading
* Use dynamic imports
* Reduce bundle size
* Avoid unnecessary re-renders

Target Lighthouse score:

95+

---

# Forbidden Technologies

Do NOT use:

* Redux
* MobX
* Recoil
* Styled Components
* Material UI
* Chakra UI
* Bootstrap
* jQuery
* Firebase
* Supabase
* MongoDB
* Express
* NestJS
* GraphQL
* Apollo
* tRPC

This project should remain a clean, modern, maintainable Next.js application.

---

# Engineering Quality Standards

Every implementation must follow:

* SOLID principles
* Clean Architecture principles
* Separation of concerns
* Reusable code
* Type safety
* Accessibility
* Security best practices
* SEO best practices
* Production readiness

Code generated should be maintainable by senior engineers and suitable for long-term growth.


# Design Philosophy

## Extremely Important

Do NOT generate generic AI SaaS UI.

Avoid:

* Typical dashboard templates
* Cookie-cutter landing pages
* Excessive gradients
* Overused glassmorphism
* Startup-looking hero sections
* Generic card grids

The design should feel:

* Crafted
* Intentional
* Personal
* Memorable
* Editorial
* Developer-focused
* Premium
* Elegant

Think:

"A senior engineer's digital studio"

rather than

"another AI-generated portfolio."

---

## Visual Direction

### Style

Blend:

* Modern editorial magazine
* Personal knowledge garden
* High-end design portfolio
* Minimal developer aesthetic

### Characteristics

* Strong typography
* Generous whitespace
* Unique layouts
* Large headings
* Clean hierarchy
* Subtle motion
* Carefully chosen accent color

---

## Color System

Primary:

* Near-black
* Off-white

Accent:

* Deep blue
* Emerald
* Copper

Choose one accent system and use consistently.

No rainbow gradients.

No flashy colors.

---

## Typography

Prioritize typography as the primary design element.

Use:

* Large display headings
* Excellent reading experience
* Beautiful article layouts

The blog experience should feel similar to a premium publication.

---

# Public Website Pages

## Home Page

Sections:

### Hero

Display:

* Name
* Title
* Short introduction
* Current focus

Avoid generic:

"Hi, I'm John"

Create a distinctive presentation.

---

### Featured Projects

Show:

* 3–6 featured projects

Each project should have:

* Title
* Description
* Technology stack
* Live link
* GitHub link

---

### Latest Articles

Show latest blog posts.

---

### Courses

Featured YouTube courses.

---

### Books

Featured books.

---

### About Preview

Short biography.

---

### Contact CTA

Professional call-to-action.

---

# About Page

Include:

* Biography
* Career journey
* Skills
* Technologies
* Philosophy
* Experience timeline

---

# Projects Page

Features:

* Filtering
* Search
* Categories

Project details:

* Cover image
* Description
* Technologies
* Challenges
* Solutions
* Lessons learned
* Screenshots
* Links

---

# Blog Page

Requirements:

* Pagination
* Search
* Categories
* Tags
* Reading time
* SEO optimization

---

# Blog Detail Page

Must support:

* Rich content
* Code blocks
* Syntax highlighting
* Tables
* Images
* Videos
* Quotes

Additional:

* Related posts
* Share links
* Table of contents

---

# Courses Page

Each course contains:

* Title
* Description
* Thumbnail
* YouTube Playlist URL

Display:

* Featured courses
* Course details

Embed YouTube playlists.

Do not host videos.

---

# Books Page

Display:

* Cover image
* Description
* Purchase links
* Reviews

External purchase platforms supported.

No payment processing inside website.

---

# Contact Page

Include:

* Contact form
* Social links
* GitHub
* LinkedIn
* X/Twitter
* YouTube

Form submissions should be stored.

---

# Admin Dashboard

## Dashboard Overview

Display:

* Total posts
* Total projects
* Total courses
* Total books

Recent activity.

---

## Blog Management

CRUD operations.

Fields:

* Title
* Slug
* Content
* Cover image
* Category
* Tags
* Published status

---

## Project Management

CRUD operations.

Fields:

* Title
* Description
* Technologies
* GitHub URL
* Live URL
* Screenshots
* Featured flag

---

## Course Management

CRUD operations.

Fields:

* Title
* Description
* Thumbnail
* Playlist URL

---

## Book Management

CRUD operations.

Fields:

* Title
* Description
* Cover
* Purchase URL

---

## Media Management

Upload and manage media assets.

---

# Database Models

Required Models:

## User

Single admin.

---

## Post

Blog content.

---

## Category

Blog categories.

---

## Tag

Blog tags.

---

## Project

Portfolio projects.

---

## Course

Course listings.

---

## Book

Book listings.

---

## ContactMessage

Contact submissions.

---

# SEO Requirements

Implement:

* Dynamic metadata
* Open Graph images
* Sitemap
* Robots.txt
* Canonical URLs
* Structured data
* RSS feed

Every blog post must be SEO optimized.

---

# Performance Requirements

Target:

* Lighthouse 95+

Requirements:

* Server-side rendering
* Static generation where possible
* Image optimization
* Lazy loading
* Code splitting
* Font optimization

---

# Accessibility Requirements

Must meet:

* WCAG standards
* Keyboard navigation
* Screen reader support
* Proper semantic HTML

---

# Security Requirements

Implement:

* Secure authentication
* CSRF protection
* Input validation
* Rate limiting
* Secure file uploads
* Environment variable protection

Use Zod for validation.

---

# Code Quality Standards

Requirements:

* Strict TypeScript
* Modular architecture
* Reusable components
* Clean folder structure
* SOLID principles
* Proper error handling
* Logging
* Maintainable code

Avoid:

* Spaghetti code
* Massive components
* Duplicate logic
* Unnecessary abstractions

---

# Folder Structure

src/

app/
components/
features/
lib/
hooks/
services/
server/
actions/
types/
validators/

---

# Animation Guidelines

Animations should be:

* Minimal
* Smooth
* Purposeful

Use motion only to enhance UX.

Avoid flashy effects.

---

# Future Expansion Support

Design architecture to support future additions:

* Newsletter
* Memberships
* Premium content
* Podcast section
* Events
* Digital products
* Documentation section
* Community features

Future expansion should not require major restructuring.

---

# Final Deliverable Expectations

Produce:

1. Production-ready code
2. Clean architecture
3. Excellent SEO
4. Elegant custom UI
5. Responsive design
6. Accessible design
7. High performance
8. Secure admin dashboard
9. Scalable architecture
10. Professional developer experience

The final result should feel like a premium personal platform built by an experienced software engineer, not a generic portfolio template or AI-generated website.
