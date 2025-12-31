# 📝 Todo App

A modern, feature-rich todo application built with Next.js, Material-UI, and Prisma Postgres. Track your daily tasks, monitor your progress, and stay organized!

## ✨ Features

- ✅ **Daily Task Management** - Add, complete, and delete tasks for each day
- 📅 **Date Selection** - Schedule tasks for specific dates
- ⏱️ **Duration Tracking** - Set estimated duration for each task (in minutes)
- ✔️ **Checkbox Completion** - Mark tasks as complete with a simple click
- 📊 **Weekly Statistics** - View your productivity stats:
  - Total tasks for the week
  - Completed tasks count
  - Remaining tasks count
  - Total time spent on completed tasks
- 📱 **Responsive Design** - Works beautifully on desktop and mobile devices
- 🎨 **Modern UI** - Clean interface built with Material-UI components

## 🚀 Getting Started

The app is already set up and running! Access it at [http://localhost:3000](http://localhost:3000)

To run the development server:

```bash
npm run dev
```

### Prerequisites Installed

- Next.js 16 with TypeScript
- Material-UI (@mui/material)
- Prisma with Prisma Postgres (free cloud database)
- date-fns for date handling

### Database Setup

- Created a free Prisma Postgres database (`todo-app-db`)
- Configured database schema with Todo model
- Applied migrations to set up the database structure

## 🎯 How to Use

### Adding a Task

1. Fill in the **Task** field (e.g., "Complete project proposal")
2. Select the **Date** (defaults to today)
3. Enter the **Duration** in minutes (e.g., 30, 60, 120)
4. Click **Add Task**

### Managing Tasks

- **Complete a Task**: Click the checkbox next to the task
- **Delete a Task**: Click the delete icon (🗑️) on the right
- **View Different Periods**:
  - Switch between "Today's Tasks" and "This Week" tabs
  - See tasks organized by time period

### Weekly Progress

The dashboard shows:

- **Total Tasks**: All tasks scheduled for this week
- **Completed**: Tasks you've finished (green)
- **Remaining**: Tasks still to do (orange)
- **Time**: Total minutes spent on completed tasks (blue)

Week runs from Sunday to Saturday.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript
- **UI Framework**: Material-UI (MUI)
- **Database**: Prisma Postgres (Free Cloud PostgreSQL)
- **ORM**: Prisma
- **Date Handling**: date-fns
- **Styling**: Material-UI with Emotion

## 📁 Project Structure

```
todo-app/
├── app/
│   ├── api/
│   │   └── todos/
│   │       ├── route.ts          # GET all todos, POST new todo
│   │       ├── [id]/route.ts     # PATCH, DELETE todo by ID
│   │       └── weekly/route.ts   # GET weekly statistics
│   ├── layout.tsx                # Root layout with MUI theme
│   ├── page.tsx                  # Main todo app page
│   └── theme.ts                  # MUI theme configuration
├── lib/
│   └── prisma.ts                 # Prisma client instance
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
└── package.json
```

## 🔌 API Endpoints

### GET `/api/todos`

Get all todos or filter by date range

### POST `/api/todos`

Create a new todo

```json
{
  "task": "Task description",
  "date": "2025-12-30",
  "duration": 30
}
```

### PATCH `/api/todos/[id]`

Update a todo (e.g., toggle completion)

### DELETE `/api/todos/[id]`

Delete a todo

### GET `/api/todos/weekly`

Get weekly statistics for the current week

## 🗄️ Database Management

View your database in Prisma Studio:

```bash
npx prisma studio
```

Apply new migrations:

```bash
npx prisma migrate dev --name migration_name
```

## 🎉 Next Steps

You can enhance the app by adding:

- User authentication
- Categories/tags for tasks
- Task priorities
- Recurring tasks
- Export data functionality
- Dark mode toggle
- Task notes/descriptions

---

Built with ❤️ using Next.js, Material-UI, and Prisma
