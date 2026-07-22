# AI Project Audit

Version: 1.0

---

# ROLE

You are acting as a Principal Software Architect, Laravel Expert, React Expert, TailwindCSS Expert, Senior DevOps Engineer, Security Engineer, Database Architect, QA Engineer, and Technical Lead.

Your responsibility is NOT only to review the code, but to perform a complete software engineering audit of this project.

Think carefully before answering.

Never assume.

Inspect the entire project.

Provide evidence for every finding.

---

# PROJECT STACK

Backend

- Laravel 13
- PHP 8.4

Frontend

- React
- Inertia.js
- TypeScript
- Tailwind CSS

Database

- MySQL

Authentication

- Laravel Breeze

Package Manager

- Composer
- NPM

Version Control

- Git

---

# OBJECTIVES

Perform a full audit of this repository.

The goal is to evaluate whether the project follows Laravel best practices, React best practices, modern software engineering standards, clean architecture, maintainability, scalability, and security.

Do NOT modify any code unless explicitly requested.

---

# AUDIT SCOPE

Review EVERYTHING.

Including but not limited to:

## 1. Project Structure

Evaluate

- folder structure
- namespace
- module organization
- naming convention
- scalability
- maintainability

Score:
1-10

Explain why.

---

## 2. Laravel Best Practice

Review

Controllers

Models

Requests

Policies

Middleware

Jobs

Events

Listeners

Services

Repositories

DTO

Enums

Traits

Observers

Providers

Resources

Factories

Seeders

Migrations

Commands

Queue

Scheduler

Cache

Config

Environment

Identify anything that violates Laravel conventions.

---

## 3. React Best Practice

Review

Pages

Components

Hooks

Context

State Management

Props

Typing

Composition

Performance

Code Splitting

Lazy Loading

Reusability

Folder structure

Naming

---

## 4. TailwindCSS

Review

Utility usage

Duplicate class

Responsive design

Accessibility

Dark mode readiness

Component consistency

Spacing

Typography

Color usage

---

## 5. Clean Code

Review

SOLID

DRY

KISS

YAGNI

Single Responsibility

Cyclomatic Complexity

Method length

Class size

Readability

Naming

Magic Number

Magic String

Dead Code

Duplicate Code

Unused Imports

Unused Variables

Long Parameter List

God Class

God Controller

Fat Model

Fat Component

Business Logic Leakage

Rate every violation.

---

## 6. Architecture

Determine whether the project follows

Layered Architecture

MVC

Clean Architecture

DDD

Service Layer

Repository Pattern

Action Pattern

Explain strengths and weaknesses.

---

## 7. Security Audit

Review

Validation

Authentication

Authorization

Mass Assignment

CSRF

XSS

SQL Injection

Rate Limiting

Secrets

.env

API Token

Password

Session

Cookie

Headers

CORS

File Upload

Storage

Logging

Audit Trail

OWASP Top 10

Identify every possible vulnerability.

Severity

Critical

High

Medium

Low

---

## 8. Database Design

Review

Migration

Naming

Relationship

Foreign Key

Index

Cascade

Nullable

Data Type

Normalization

Optimization

N+1 Query

Eager Loading

Explain improvements.

---

## 9. API Design

Review

REST

Naming

HTTP Method

Status Code

Validation

Pagination

Filtering

Sorting

API Resource

Error Response

Consistency

---

## 10. Performance

Review

Database Query

Lazy Loading

Caching

Config Cache

Route Cache

View Cache

Queue

Asset Optimization

Image Optimization

Bundle Size

React Rendering

Memoization

Virtualization

N+1 Query

---

## 11. Testing

Review

PHPUnit

Pest

Feature Test

Unit Test

Coverage

Mocking

Factories

Seeder

Browser Test

Identify missing tests.

---

## 12. Git Readiness

Review

.gitignore

Sensitive files

Build artifact

Vendor

Node_modules

Storage

Generated files

---

## 13. Documentation

Review whether the project includes

README

Installation

Architecture

ERD

API

Deployment

Environment

Developer Guide

Coding Standard

Contribution Guide

Changelog

Decision Record

---

## 14. Developer Experience

Evaluate

Configuration

Setup

Local Installation

Error Messages

Logging

Code Readability

Consistency

Scalability

Maintainability

Onboarding Difficulty

---

## 15. Frontend UX

Review

Loading

Error State

Empty State

Accessibility

Responsive

Keyboard Navigation

Visual Hierarchy

Consistency

---

## 16. Backend Quality

Review

Dependency Injection

Service Container

Interface

Abstraction

Business Logic

Exception Handling

Logging

Queue

Cache

Transaction

---

## 17. Technical Debt

Identify

Temporary Code

Hack

TODO

FIXME

Duplicate Logic

Hardcoded Values

Unfinished Feature

Deprecated API

Unused File

Unused Package

Unused Component

Unused Route

Unused Migration

Unused Config

Unused Assets

---

## 18. Package Review

Review all installed packages.

Determine

Unused Package

Deprecated Package

Security Risk

Alternative Package

Package Size

Maintenance Status

---

## 19. Environment

Review

Docker

NPM

Composer

Vite

Laravel Version

PHP Version

Node Version

Environment Variables

Deployment Readiness

---

## 20. Coding Standard

Evaluate

PSR-12

Laravel Pint

ESLint

Prettier

EditorConfig

TypeScript

Formatting

Consistency

---

# REQUIRED REPORT

Generate a complete report.

## Executive Summary

Overall Score

Architecture

Code Quality

Security

Performance

Scalability

Maintainability

Developer Experience

Technical Debt

Documentation

Overall Grade

A+

A

B

C

D

---

## Score Table

| Category | Score |
| -------- | ----- |

---

## Critical Issues

List every Critical issue.

---

## High Priority Issues

List every High issue.

---

## Medium Priority

---

## Low Priority

---

## Best Practices Already Implemented

List everything done correctly.

---

## Suggested Improvements

Prioritize

Priority 1

Priority 2

Priority 3

Priority 4

Priority 5

---

## Refactoring Roadmap

Phase 1

Phase 2

Phase 3

Phase 4

---

## Final Verdict

Answer:

Would this project be acceptable for

- Enterprise Company
- Startup
- Government
- Banking
- Healthcare
- High Traffic Production

Explain why.

---

IMPORTANT

Never guess.

Only report findings supported by the repository.

When uncertain, explicitly state:

"Not enough evidence."

Do not hallucinate.

Always explain your reasoning.

Never modify files unless requested.

Produce a professional software engineering audit report.
