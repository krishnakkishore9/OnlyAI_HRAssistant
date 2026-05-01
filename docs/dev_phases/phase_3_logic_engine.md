# ⚙️ Phase 3: Logic Engine & Data Modeling

## 🎯 Goal
Build the deterministic system for leave validation and Firestore storage.

## 📋 Tasks
1. **Firestore Schema Implementation**:
   - Initialize `users` and `leave_requests` collections.
2. **Decision Engine Logic**:
   - Create `lib/logic/decision-engine.ts`.
   - Implement functions for balance check, policy validation, and tenure check.
3. **Leave Request API**:
   - Create route to handle structured leave request submissions.
   - Link request flow to the Decision Engine.

## ✅ Completion Criteria
- System can approve or reject a leave request based on mock user data.
- Leave requests are correctly stored in Firestore with status.
