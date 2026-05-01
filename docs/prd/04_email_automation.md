# 📧 04. Email & Automation System

## 3.4 Email Drafting with Confirmation
* **AI Generation**: Once a leave request is validated, the AI generates a professional email draft.
* **User Confirmation**: The draft is presented in the UI. The user can:
    * ✅ **Approve & Send**
    * ✏️ **Edit**
    * ❌ **Cancel**

---

## 3.5 SMTP Delivery
* **Delivery**: Emails are sent via SMTP (using services like Resend or Nodemailer).
* **Automated Responses**: Upon approval/rejection, the system automatically sends a notification email to the employee and HR.

---

## 6. Email Flow
```text
User confirms draft
      ↓
Decision engine runs
      ↓
Template selected (Approval/Rejection/Review)
      ↓
SMTP send
      ↓
Log status in Firestore
```
