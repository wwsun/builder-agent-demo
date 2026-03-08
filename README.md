# Builder Agent

A simple builder agent demo using Tauri and Gemini API.

![alt text](image.png)

## Run Locally

**Prerequisites:**

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install) (The `cargo` package manager)
- macOS/Windows/Linux native build dependencies (Xcode Command Line Tools on macOS)

### 1. Install Node Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory and add your Gemini API Key:

```bash
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 3. Run Development Server

To run the application in development mode (spins up both Vite and the Tauri desktop window):

```bash
npm run tauri:dev
```

_Note: The first time you run this command, it will take a few minutes to download and compile the Rust backend dependencies._

### 4. Build for Production

To build a standalone desktop application (e.g., a `.dmg` or `.app` on macOS):

```bash
npm run tauri:build
```

The compiled binaries will be available in the `src-tauri/target/release/bundle/` directory.
