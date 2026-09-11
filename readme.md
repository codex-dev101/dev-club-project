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