# 🗄️ 06. Data Schemas (Firestore)

## 9.1 `users`
```json
{
  "id": "user_1",
  "email": "user@onlyai.com",
  "role": "employee",
  "leave_balance": 10,
  "department": "Engineering"
}
```

---

## 9.2 `leave_requests`
```json
{
  "user_id": "user_1",
  "start_date": "2024-05-10",
  "end_date": "2024-05-15",
  "status": "approved",
  "reason": "Family visit",
  "ai_explanation": "Request within balance and policy constraints."
}
```

---

## 9.3 `conversations`
```json
{
  "user_id": "user_1",
  "messages": [
    {"role": "user", "text": "..."},
    {"role": "assistant", "text": "..."}
  ],
  "updated_at": "..."
}
```
