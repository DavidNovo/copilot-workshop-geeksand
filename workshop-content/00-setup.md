# Setup

## 1. Install Node.js

Download and install Node.js from https://nodejs.org/en/download

## 2. Install/update VS Code

If you don't have VS Code yet, install it here: https://code.visualstudio.com/

If you already have VS Code installed, make sure it's updated by going to the bottom-left gear > Check for Updates

## 3. Sign Up for GitHub Copilot

Create an account at https://github.com/features/copilot/plans. Free option available

## 4. Install the GitHub Copilot CLI

**Recommended (all platforms, requires Node.js)**
```
npm install -g @github/copilot
```

**macOS/Linux (Homebrew):**
```
brew install copilot-cli
```

**Windows (WinGet):**
```
winget install GitHub.Copilot
```

**macOS/Linux (Install Script):**
```
curl -fsSL https://gh.io/copilot-install | bash
```

## 5. Open a Terminal

Open a terminal at the root of this repo.

## 6. Trust the Folder

Run `copilot` and trust the folder when prompted.

## 7. Log In

Run `/login` and sign in with your GitHub account.

## 8. Test Copilot

Ask Copilot: "What is this repo?"

## 9. Make sure you can run the app

Run `npm install`, `npm run dev`, then navigate to the localhost url