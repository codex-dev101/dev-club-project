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

## Creator Insight Dashboard sign-in

The dashboard is plain HTML, CSS, and JavaScript. It loads the official Supabase JavaScript client from the CDN; no build tool or package installation is required.

1. Create `supabase-config.js` by copying `supabase-config.example.js`.
2. In Supabase **Project Settings → API** (or **API Keys**), copy the Project URL and the publishable key (or legacy anon key) into `projectUrl` and `anonKey`.
3. In the Supabase SQL Editor, run [`supabase/creator-access.sql`](./supabase/creator-access.sql) to create the RLS-protected creator authorization list.
4. In **Authentication → Users**, create or invite your account, then copy its user UUID.
5. In the SQL Editor, authorize that account explicitly:

   ```sql
   insert into public.creator_access (user_id)
   values ('YOUR_CREATOR_AUTH_USER_UUID');
   ```

6. Disable public sign-ups in Supabase Authentication settings if users should not create accounts in this project. If sign-ups remain enabled, new users can register, but receive no creator access unless an administrator explicitly adds their UUID to `creator_access`.
7. Serve the project over HTTP (for example, with VS Code Live Server) and open `creator-dashboard.html`.

`supabase-config.js` is ignored by Git. Never put a Supabase service-role or secret key in this file; the publishable/anon key is intended for browser use. Supabase Auth manages passwords and sessions. Registration saves only `full_name` as user metadata; it never accepts a role. Email confirmation must be enabled in Supabase Authentication settings if you want new users to verify their address.

The `creator_access` row is the authorization source, not the frontend. Its RLS policy allows a signed-in user to read only their own authorization row; browser clients have no insert, update, or delete permission. Provision creator access only from the SQL Editor or trusted server-side code. Any creator-data tables added later must also have RLS enabled and policies that check membership in `creator_access`, for example:

```sql
alter table public.creator_questions enable row level security;

create policy "Creators can manage questions"
on public.creator_questions
for all
to authenticated
using (
    exists (
        select 1
        from public.creator_access
        where creator_access.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.creator_access
        where creator_access.user_id = auth.uid()
    )
);
```

Apply equivalent policies to every creator-only table. The current question packs and creator profile are still saved in browser `localStorage`, not Supabase; local data cannot be protected by RLS. Move those records to RLS-protected Supabase tables before relying on backend security for creator content.