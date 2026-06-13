# TaskDuty

A task management web app for capturing, prioritising, and tracking your work. Built with React, TypeScript, Tailwind CSS on the frontend and Node.js, Express, MongoDB on the backend.

![TaskDuty](./public/cover-preview.png)

---

## Tech Stack

### Frontend
| | |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Bundler | Vite |
| HTTP Client | Axios |

### Backend
| | |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | MongoDB |
| ODM | Mongoose |

---

## Prerequisites

Before running this project, make sure you have the following installed on your computer:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A code editor like [VS Code](https://code.visualstudio.com/)

---

## Setup Instructions

### Step 1 — Clone the repository

```bash
git clone https://github.com/Ozcar-dev/TASK-MANAGER.git
cd taskduty
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Start the app

```bash
npm run dev
```

### Step 4 — Open the app in your browser
http://localhost:5173

---

## Production Build

```bash
npm run build
npm run preview
```

---

## Project Structure
src/

├── api/

│   ├── axios.ts             # Axios instance with base URL

│   └── taskService.ts       # All API calls (fetch, create, update, delete)

├── pages/

│   ├── HomePage.tsx         # Landing page with hero and task stats

│   ├── MyTasks.tsx      # Task list with priority filters

│   ├── NewTask.tsx      # Create a new task

│   └── EditTask.tsx     # Edit an existing task

│   └── NavBar.tsx              # Shared navigation bar


│── index.ts             # Global TypeScript types

├── App.tsx                  # Page routing

└── index.css                # Tailwind directives

---

## Pages

### Cover
Hero section with a headline, CTA buttons, live task stats (All, completed, urgent), and a preview of active task cards.

### My Tasks
Full task list with filter chips (All, Urgent, Important, Completed), colour-coded priority bars, inline complete toggle, and edit/delete actions per task.

### New Task
Form with floating label inputs for title, description, and due date, a tag dropdown, and a Done button that saves to the database.

### Edit Task
Same layout as New Task, pre-filled with the existing task data fetched from the database.

---

## Types

```ts
type Priority = "Urgent" | "Important" | "Completed";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  category: Priority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NewTaskFormValues {
  title: string;
  description: string;
  tags: Priority[];
}
```
## Props

### `NewTaskPage` / `EditTaskPage`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSave` | `(values: NewTaskFormValues) => void` | Yes | Fires on Done with form values |
| `onAllTasks` | `() => void` | Yes | Fires on the nav All Tasks link |
| `task` | `Task` | Edit only | Pre-fills the form with existing task data |







# TaskDuty - Task Manager API

This is the backend for TaskDuty, a simple task management app. It handles creating, reading, updating, and deleting tasks.

---

## What You Need Before Starting

Make sure these are installed on your computer:

- [Node.js](https://nodejs.org/) — download and install the LTS version
- [MongoDB](https://www.mongodb.com/) — the database the app uses
- A code editor like [VS Code](https://code.visualstudio.com/)

---

## How To Run The Project

### Step 1 — Download the project
```bash
git clone https://github.com/your-username/task-manager-backend.git
cd task-manager-backend
```

### Step 2 — Install the required packages
```bash
npm install
```

### Step 3 — Create a `.env` file

In the root folder of the project, create a file called `.env` and paste this inside: