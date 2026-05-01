# 🚀 Vercel Deployment Guide

This guide will walk you through pushing the OnlyAI HR Assistant to GitHub and deploying it on Vercel, the native platform for Next.js applications.

---

## Step 1: Push the Project to GitHub

Before deploying to Vercel, your code needs to be hosted on a Git repository (GitHub is recommended).

1. **Initialize Git (if not already done):**
   Open your terminal in the project root and run:
   ```bash
   git init
   ```

2. **Stage and Commit Your Files:**
   ```bash
   git add .
   git commit -m "Initial commit: Ready for deployment"
   ```

3. **Create a Repository on GitHub:**
   - Go to [GitHub](https://github.com/) and create a new, empty repository.
   - Do **not** initialize it with a README, `.gitignore`, or License.

4. **Push to GitHub:**
   Link your local project to the GitHub repo and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Deploy on Vercel

Vercel provides a seamless, zero-config deployment experience for Next.js.

1. **Log in to Vercel:**
   Go to [Vercel](https://vercel.com/) and log in using your GitHub account.

2. **Import Your Project:**
   - Click the **"Add New..."** button and select **"Project"**.
   - Find the repository you just created in the list and click **"Import"**.

3. **Configure the Build Settings:**
   Vercel will automatically detect that this is a Next.js project. You do not need to change the Build Command (`next build`) or Output Directory (`.next`).

4. **Add Environment Variables (CRITICAL):**
   Before clicking "Deploy", expand the **Environment Variables** section. You must manually copy and paste every variable from your local `.env` file here.
   
   > [!WARNING]
   > **The Firebase Private Key Issue**
   > Your `FIREBASE_PRIVATE_KEY` contains literal newline characters (`\n`). When pasting this into Vercel, it often breaks parsing. 
   > **Fix:** When pasting the `FIREBASE_PRIVATE_KEY` into Vercel, make sure it is wrapped in double quotes exactly as it is in your `.env` file, or manually replace the `\n` characters with actual physical line breaks in the input field.

   Make sure to include:
   - `NEXT_PUBLIC_FIREBASE_*` (All Firebase public configs)
   - `FIREBASE_CLIENT_EMAIL` & `FIREBASE_PRIVATE_KEY`
   - `GROQ_API_KEY`
   - `PINECONE_API_KEY` & `PINECONE_INDEX`
   - `SMTP_*` (Email credentials)

5. **Deploy:**
   Click the **Deploy** button. Vercel will build your project. Once finished, you will receive a live production URL!

---

## Step 3: Post-Deployment Best Practices

### 1. Vector Database Seeding
Remember that the Vercel deployment will **not** seed your Pinecone database. The data seeding (`npx tsx scripts/seed-pinecone.ts`) should be done from your local machine. Since the vector database lives in the cloud (Pinecone), the Vercel app will simply query the data you seeded locally.

### 2. SMTP in Serverless Environments
You are currently using **Ethereal** (Nodemailer) for testing emails. 
> [!NOTE]
> Serverless platforms like Vercel sometimes block standard SMTP outbound ports (like port 587 or 25) to prevent spam.
> If your emails stop sending in production, you should switch from Nodemailer to a modern API-based provider like **[Resend](https://resend.com/)**, **SendGrid**, or **Postmark**. Resend is particularly recommended for Next.js as it uses standard HTTPS to send emails, completely bypassing SMTP port restrictions.
