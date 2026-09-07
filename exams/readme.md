Here is a complete, industry-standard guide for how you and your team can collaborate smoothly using Git, GitHub, and VS Code.

By using Git and GitHub, each team member has a full local copy of the project on their computer, meaning their VS Code Live Server will run locally and open in their browser without issues.

🏗️ 1. The Recommended Branching Strategy (Stages)
Instead of everyone pushing directly to main, professional development teams use a 3-tier branch structure:

[ main ] <-- Production Stage (Live, stable code for users/presentation)
   ↑ (Merge when tested)
[ dev or staging ] <-- Development Stage (Where team members combine their features)
   ↑ (Pull Requests)
[ feature/your-name-feature ] <-- Individual work branches for each team member
main (Production): Clean, finished, working project.
dev (Development / Staging): The staging area where everyone merges their completed features together to test them before going live.
feature/<name>-<feature>: Temporary branches where each member writes code independently.
👥 2. Step 1: Add Your Teammates on GitHub (One-Time Setup)
To allow your team to clone and push:

Go to your GitHub repository: https://github.com/ilokaharrisonarinze/dev-club-project
Click Settings (top navigation tab).
Click Collaborators on the left sidebar.
Click Add people and enter each teammate's GitHub username or email address.
They will receive an email invitation to accept.
🌿 3. Step 2: Create the dev (Staging) Branch
You (the project lead) can create the dev branch and push it to GitHub:

Run this in your VS Code terminal:

bash
# Create and switch to the 'dev' branch
git checkout -b dev
# Push the 'dev' branch to GitHub
git push -u origin dev
Now you have both main and dev on GitHub.

💻 4. Step 3: How Your Teammates Get Started on Their Computers
Each team member does this once on their computer:

Open VS Code and open the Terminal (`Ctrl + ``).
Clone the repository:
bash
git clone https://github.com/ilokaharrisonarinze/dev-club-project.git
Open the project folder in VS Code:
File -> Open Folder -> select dev-club-project.
Switch to the dev branch:
bash
git checkout dev
Run Live Server:
Right-click index.html -> Open with Live Server.
It will run on their own browser at http://127.0.0.1:5500.
🔄 5. Step 4: The Daily Team Workflow (Feature Branching)
Every time a team member wants to work on a task (e.g., John adding a new sound effect or Sarah updating styles):

Step A: Get the Latest Code
Before starting any new work, update your local dev branch:

bash
git checkout dev
git pull origin dev
Step B: Create a Personal Feature Branch
Never write code directly on main or dev. Always create a new branch:

bash
# Format: git checkout -b feature/<yourname>-<feature-description>
git checkout -b feature/john-timer-audio
Step C: Code and Test with Live Server
Write code in VS Code.
Save files.
Inspect the changes in the browser via Live Server.
Step D: Save and Push Your Feature Branch
bash
# 1. Stage changes
git add .
# 2. Commit with a clear message
git commit -m "Add sound effect when timer reaches last minute"
# 3. Push your branch to GitHub
git push -u origin feature/john-timer-audio
🔀 6. Step 5: Merging via Pull Request (PR) on GitHub
Once a teammate has pushed their branch to GitHub:

Go to the repository on GitHub.
You will see a banner: "feature/john-timer-audio had recent pushes" -> Click Compare & pull request.
Set the base branch:
Base: dev $\leftarrow$ Compare: feature/john-timer-audio
The team or project lead reviews the code and clicks Merge pull request.
Once merged into dev, everyone runs git checkout dev && git pull origin dev to get the updated code.
🚀 7. Step 6: Promoting from Staging (dev) to Production (main)
When you have tested the project on dev and it's ready for final presentation:

On GitHub, create a Pull Request from dev into main:
Base: main $\leftarrow$ Compare: dev
Click Merge pull request.
Now your main branch holds the verified, production-ready release!
📋 Quick Cheat Sheet for Team Members
Goal	Command
Clone repo	git clone https://github.com/ilokaharrisonarinze/dev-club-project.git
Check current branch & status	git status
Switch to dev branch	git checkout dev
Pull latest updates	git pull origin dev
Create new feature branch	git checkout -b feature/my-feature-name
Save changes	git add . then git commit -m "Description of changes"
Push feature to GitHub	git push -u origin feature/my-feature-name
Would you like me to go ahead and create the dev branch and push it to GitHub for you right now so your team can start cloning and branching from it?

git branch -r