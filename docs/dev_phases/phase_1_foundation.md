# 🏗️ Phase 1: Foundation & Infrastructure

## 🎯 Goal
Set up the core environment and link all external services (Firebase, Groq).

## 📋 Tasks
1. **Next.js Initialization**:
   - Run `npx create-next-app@latest ./ --typescript --tailwind --eslint`.
   - Clean up boilerplate code.
2. **Dependency Installation**:
   - `firebase`, `firebase-admin`, `framer-motion`, `lucide-react`, `groq-sdk`.
3. **Firebase Configuration**:
   - Create `lib/firebase.ts` for Client SDK.
   - Create `lib/firebase-admin.ts` for Server SDK.
4. **Environment Setup**:
   - Configure `.env.local` with Firebase and Groq keys.

## ✅ Completion Criteria
- Next.js dev server running.
- Firebase initialized without errors.
- Folder structure created (`components`, `lib`, `app/api`).
