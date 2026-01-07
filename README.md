# 📝 Todo App with Learning Tracker

A modern, full-featured productivity application built with Next.js, Material-UI, and Prisma Postgres. Track your daily tasks, manage learning topics across multiple tracks, take notes, and monitor your progress!

## ✨ Features

### 📋 Classic Todo Management
- ✅ **Daily Task Management** - Add, complete, and delete tasks for each day
- 📅 **Date Selection** - Schedule tasks for specific dates
- ⏱️ **Duration Tracking** - Set estimated duration for each task (in minutes)
- ✔️ **Checkbox Completion** - Mark tasks as complete with a simple click
- 📊 **Weekly Statistics** - View your productivity stats

### 🎓 Learning Tracker (NEW!)
- **📚 Multi-Track Organization** - Create custom learning tracks (JavaScript, MCP, CSS, etc.)
- **📝 Topic Management** - Add topics to each track with target study times
- **✍️ Smart Note-Taking** - For each topic, capture:
  - **Key Ideas** - Core concepts to remember
  - **Examples** - Code snippets or practical examples
  - **Recall Questions** - Self-test questions for review
- **📊 Progress Tracking** - See completed/total topics per track
- **📈 Weekly Stats** - Total, completed, remaining topics and time spent
- **🔍 Search & Sort** - Find topics quickly, sort by title, status, or last studied
- **🌱 Auto-Seeding** - First-time users get 3 starter tracks with topics
- **🎯 3-Column Layout** - Tracks sidebar → Topics list → Details panel

### 🔐 Multi-User Support
- 🔒 **JWT Authentication** - Secure login/logout system
- 👥 **User Isolation** - Each user sees only their own data
- 🔑 **Password Hashing** - bcrypt encryption for user passwords

### 🎨 Modern UI/UX
- 📱 **Responsive Design** - Works beautifully on desktop and mobile
- 🎨 **Material-UI Components** - Clean, professional interface
- 🚀 **Fast Navigation** - Switch between Todo and Learning Tracker modes

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

#### 1. Set the Prisma Database URL

Create a `.env` file in the project root (if it doesn't exist) and add your Prisma Postgres connection string:

```env
DATABASE_URL="<your-prisma-postgres-url>"
```

You can find your Prisma Postgres URL in the Prisma Data Platform dashboard or use the example from the template. Example:

```env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
```

#### 2. Run Migrations

Apply the database schema and migrations:

```bash
npx prisma migrate dev --name init
```

#### 3. Start the App

Run the development server (make sure your `.env` is set):

```bash
npm run dev
```

The app will use the database specified in your `DATABASE_URL`.

## 🎯 How to Use

### Classic Todo Mode (Home Page)

#### Adding a Task
1. Fill in the **Task** field (e.g., "Complete project proposal")
2. Select the **Date** (defaults to today)
3. Enter the **Duration** in minutes (e.g., 30, 60, 120)
4. Click **Add Task**

#### Managing Tasks
- **Complete a Task**: Click the checkbox next to the task
- **Delete a Task**: Click the delete icon (🗑️) on the right
- **View Different Periods**: Switch between "Today's Tasks" and "This Week" tabs

### 🎓 Learning Tracker Mode

Click the **"Learning Tracker"** button in the top navigation to access the learning management system.

#### First-Time Setup
On your first visit, the app automatically seeds 3 starter tracks:
- **JavaScript Fundamentals** (13 topics)
- **MCP Learning** (4 topics)
- **CSS MDN Guides** (8 topics)

You can edit or delete these anytime!

#### Managing Tracks (Left Sidebar)
- **Create Track**: Click "New Track" button
- **Select Track**: Click on any track to view its topics
- **Rename Track**: Click the ⋮ menu → Rename
- **Delete Track**: Click the ⋮ menu → Delete (removes all topics)
- **View Progress**: See "completed/total" count for each track

#### Managing Topics (Center Panel)
- **Add Topic**: Click "Add Topic" button (requires track selection)
  - Enter title, target minutes, and optional source URL
- **Toggle Completion**: Click checkbox to mark topic complete/incomplete
- **Search Topics**: Type in search box to filter by title
- **Sort Topics**: Choose from Created, Title, Status, or Last Studied
- **Delete Topic**: Click the delete icon (🗑️)
- **View Details**: Click anywhere on topic to open details panel

#### Topic Details (Right Panel)
**NOTES Tab:**
- **Key Idea**: Core concept (e.g., "== vs ===, string comparisons, NaN")
- **Example**: Code snippets or practical examples
- **Recall Question**: Self-test questions for review
- Click **SAVE NOTES** to persist changes

**FORM Tab:**
- Edit topic title, target minutes, source URL
- View metadata (completion status, last studied, created date)
- Click source link to open external resources
- Click **SAVE CHANGES** to update

#### Weekly Progress Cards
View real-time stats for the selected track:
- **Total Tasks**: All topics in the track
- **Completed**: Finished topics (green)
- **Remaining**: Topics to complete (orange)
- **Time (min)**: Total minutes from completed topics (blue)

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
│   │   ├── auth/
│   │   │   ├── login/route.ts        # POST login
│   │   │   ├── logout/route.ts       # POST logout
│   │   │   └── register/route.ts     # POST register
│   │   ├── todos/
│   │   │   ├── route.ts              # GET, POST todos
│   │   │   ├── [id]/route.ts         # PATCH, DELETE todo
│   │   │   └── weekly/route.ts       # GET weekly todo stats
│   │   ├── tracks/
│   │   │   ├── route.ts              # GET, POST tracks
│   │   │   ├── [id]/route.ts         # PATCH, DELETE track
│   │   │   └── seed/route.ts         # POST seed default tracks
│   │   ├── topics/
│   │   │   ├── route.ts              # GET, POST topics
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET, PATCH, DELETE topic
│   │   │       └── notes/route.ts    # GET, PUT topic notes
│   Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout and clear token

### Todos (Original Feature)
- `GET /api/todos` - Get all todos (user-scoped)
- `POST /api/todos` - Create new todo
- `PATCH /api/todos/[id]` - Update todo (toggle completion, etc.)
- `DELETE /api/todos/[id]` - Delete todo
- `GET /api/todos/weekly` - Get weekly todo statistics

### Learning Tracks
- `GET /api/tracks` - List all tracks with progress counts
- `POST /api/tracks` - Create new track
- `PATCH /api/tracks/[id]` - Rename or reorder track
- `DELETE /api/tracks/[id]` - Delete track (cascades to topics)
- `POST /api/tracks/seed` - Seed default tracks (first-run only)

### Learning Topics
- `GET /api/topics?trackId=...&search=...&sort=...` - List/filter topics
- `POST /api/topics` - Create new topic in a track
- `GET /api/topics/[id]` - Get single topic details
- `PATCH /api/topics/[id]` - Update topic (completion, title, etc.)
- `DELETE /api/topics/[id]` - Delete topic

### Topic Notes
- `GET /api/topics/[id]/notes` - Get topic notes
- `PUT /api/topics/[id]/notes` - Upsert notes (keyIdea, example, recallQuestion)

### Statistics
- `GET /api/stats/weekly?trackId=...&weekStart=...&weekEnd=...` - Weekly learning statstication/
│       └── 20260105223957_add_learning_tracker_models/
├── prisma.config.ts                  # Prisma 7 configuration
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
Schema

### Models:
1. **User** - Authentication (username, password)
2. **Todo** - Classic todo items (task, date, duration, completed)
3. **Track** - Learning tracks/categories (name, order)
4. **Topic** - Learning topics (title, targetMinutes, completed, sourceUrl, scheduledDate, lastStudiedAt)
5. **TopicNote** - Topic notes (keyIdea, example, recallQuestion)

### Database Management

View your database in Prisma Studio:

```bash
npx prisma studio
```

Apply new migrations:

```bash
npx prisma migrate dev --name migration_name
```

Check migration status:

```bash
npx prisma migrate status
```

Regenerate Prisma Client (after schema changes):

```bash
npx prisma generate
```

## 🔧 Troubleshooting

### "Column does not exist" Error
If you get Prisma errors after schema changes:
```bash
rm -rf .next
npx prisma generate
npm run dev
```

### Reset Database (Development Only)
```bash
npx prisma migrate reset
```

## 🎉 Features to Add

Potential enhancements:
- 📅 Calendar view for scheduled topics
- 🔔 Reminders/notifications for scheduled topics
- 📊 Analytics dashboard with charts
- 🏆 Gamification (streaks, achievements)
- 📤 Export/import data (JSON, CSV)
- 🌙 Dark mode toggle
- 🔄 Drag-and-drop reordering
- 🔗 Integration with external learning platforms
- 📱 Progressive Web App (PWA) support
- 🤝 Sharing tracks/topics with other users

---

Built with ❤️ using Next.js, Material-UI, Prisma, and TypeScript
- Task notes/descriptions

---

Built with ❤️ using Next.js, Material-UI, and Prisma
