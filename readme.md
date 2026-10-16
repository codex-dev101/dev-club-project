Step 1 — Get your teammate's latest branch

In VS Code, open your project folder and open the terminal.

First:

git fetch origin

Then:

git branch -a

You should see something like:

* main
  remotes/origin/main
  remotes/origin/instructions
  remotes/origin/exam

Your teammate's branch might be called instructions or something else.

Step 2 — Get his Instructions page into your project

If his branch is called instructions, run:

git switch instructions

If Git says the branch doesn't exist locally, run:

git switch -c instructions origin/instructions

Now check your VS Code Explorer.

You should see his files, including something like:

instructions.html
Step 3 — Go back to your branch

Now switch back to the branch you're using for the front page.

For example:

git switch your-branch-name

Your front-page files will come back.

But here's the important part 👇

You need your teammate's instructions.html to eventually be part of the combined project.

The clean way is for your team to eventually merge everyone's completed work into a common branch, usually main or a develop branch.

Step 4 — Put the link on your Start button

Once instructions.html is part of the same project, your front page could look like:

<a href="instructions.html" class="start-btn">Start Exam</a>

Now clicking:

START EXAM

will open:

instructions.html
Step 5 — Your teammate does the same thing

On his Instructions page, he can have a button like:

<a href="exam.html" class="start-btn">Start Exam</a>

So the complete flow becomes:

index.html
     ↓
Start Exam
     ↓
instructions.html
     ↓
Start Exam
     ↓
exam.html
Step 6 — How you two combine your work

This is the part that's important for your team.

Let's say:

You → front page
Teammate → instructions page
Another teammate → exam page

Each person works on their own branch:

main
 ├── your-front-page
 ├── instructions
 └── exam-page

When someone's work is ready, they push their branch to GitHub.

For example, you:

git add .
git commit -m "Added CBT front page"
git push origin your-branch-name

Your teammate:

git add .
git commit -m "Added instructions page"
git push origin instructions

Then you guys create Pull Requests on GitHub to bring those branches into the shared branch.

## Running locally

The pages use native JavaScript ES modules. Serve the project over HTTP (for example, open `index.html` with the VS Code Live Server extension) instead of opening it directly with a `file://` URL, which blocks module imports in browsers.

## Sign-in setup

Sign in with the account email and password using Supabase Auth. Email confirmation is enabled for this project, so new accounts must confirm their email before email sign-in works.

Username sign-in uses the `username-signin` Supabase Edge Function configured in `auth.js`. If that function is missing or temporarily unavailable, an account cached in the current browser can still sign in locally. That local fallback does not sync between browsers or devices; use email sign-in there, or deploy and configure the username Edge Function for cross-device username sign-in.

## Password recovery setup

The recovery pages use the existing Supabase Auth client. The recovery request redirects to `app/authentication/reset-password/reset-password.html` on the same origin that is serving the website. No service-role key or additional database is needed.

Before using recovery on the deployed site:

1. In the Supabase Dashboard, open **Authentication → URL Configuration**. Set **Site URL** to the deployed website's real base URL (not the Supabase project URL). Add the exact deployed reset page to **Redirect URLs**, for example `https://your-real-domain.example/app/authentication/reset-password/reset-password.html`. For GitHub Pages, include the repository path in both URLs if the site is hosted below one.
2. Add the local development reset page separately to **Redirect URLs** only if you use it, for example `http://localhost:5500/app/authentication/reset-password/reset-password.html`. Do not use localhost as the production Site URL.
3. In **Authentication → Email Templates → Reset Password**, use the subject `Reset Your Smart CBT Examination Password` and a body that links to Supabase's `{{ .ConfirmationURL }}`. Example:

   ```html
   <h2>Reset your Smart CBT Examination password</h2>
   <p>We received a request to reset the password for your Smart CBT Examination account.</p>
   <p><a href="{{ .ConfirmationURL }}">Reset my password</a></p>
   <p>If you did not request this change, you can ignore this email. The link expires according to your Supabase email/OTP expiry setting and can only be used once.</p>
   ```

4. For reliable delivery, configure a custom SMTP provider in the Supabase project's email/SMTP settings. Verify the sender domain and its SPF/DKIM records with that provider. Supabase's default mail service may be restricted or rate-limited; a successful recovery request from the website does not by itself prove that an email was delivered.
5. Review the email OTP expiry setting under **Authentication → Providers → Email** and choose an appropriate short lifetime. Supabase validates and consumes the recovery token; the reset page additionally requires the resulting recovery session before it calls `updateUser`.

The project's public Auth settings currently report email authentication enabled and email confirmation required. SMTP configuration, the deployed website hostname, redirect allowlisting, and actual mailbox delivery are not available through the public client configuration and must be verified in the Dashboard.