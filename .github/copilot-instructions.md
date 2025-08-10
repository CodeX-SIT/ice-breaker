# Ice Breaker App - Copilot Instructions

This document provides guidance for AI coding agents to effectively contribute to the Ice Breaker application.

## Architecture Overview

The application is a full-stack Next.js application using the App Router.

- **Frontend**: The UI is built with React components, located in `src/components/`. Pages are in `src/app/**/page.tsx`. Styling is done with Tailwind CSS.
- **Backend**: The backend is implemented using Next.js API Routes, found in `src/app/api/`.
- **Database**: The application uses Sequelize with a SQLite database (`database.sqlite`). Database models are defined in `src/database/`.
- **Authentication**: Authentication is handled by NextAuth.js, with a custom Sequelize adapter configured in `src/auth/adapter.ts`. The NextAuth.js API route is at `src/app/api/auth/[...nextauth]/route.ts`.

## Key Concepts & Data Flow

The core of the application is the "Game".

1.  An admin creates a `GameCode` (`/gamecode/create`).
2.  Users join a game using this code, which creates a `UserGame` entry to link a `User` to a `GameCode`.
3.  Users provide information about themselves (`AboutUser`), including hobbies and an avatar.

### Game Loop

Once multiple users have joined, the admin can start the game.

1.  **Assignment**: Each user is randomly assigned the profile of another user in the same game. The profile includes the avatar and personal details, but not the name. The assignment logic in `src/app/api/controllers/createUserAssignment.ts` ensures a user isn't assigned to someone they've already found.
2.  **The Hunt (IRL)**: This is a real-life game facilitated by the mobile-first web app. Users interact in person, using the details from the assigned profile to find their target. For example, shouting "Who here is from Pune?" or "Who likes Harry Potter?".
3.  **Confirmation**: Once a user finds their assigned person, they confirm it by entering the person's name and taking a selfie with them.
4.  **Game State Updates**: The application does not use WebSockets for real-time updates. Instead, the client polls the server to get the latest game state.
5.  **Ending the Game**: The game concludes when a time limit is reached, or when a player successfully finds all other participants.
6.  **Results**: Winners are determined by the number of people they successfully found. A gallery or carousel displays the selfies taken during the game.

## Development Workflow

- **Running the app**: To start the development server, run `bun dev`.
- **Database**: The database is a single SQLite file: `database.sqlite`. To reset the database, you can use the `clear_db.sql` script. Model definitions are in `src/database/` and are initialized via `src/database/sequelize.ts`. When you change a model in `src/database`, you will likely need to update the corresponding auth model in `src/auth/models.ts` and restart the development server.

## Code Conventions

- **API Routes**: API logic is separated into controllers in `src/app/api/controllers/`. The route handlers in `src/app/api/**/route.ts` should be kept lean and primarily call these controllers.
- **Database Models**: All database models are defined as objects with Sequelize `DataTypes`, not as classes. See `src/database/User.ts` for an example. Relationships are defined in `src/database/relations.ts`.
- **Authentication**: User and session management is handled by NextAuth.js. To get the current user session on the server, use the `getServerSession` function from NextAuth.js with the options from `src/auth/index.ts`.

## Important Files

- `src/app/api/auth/[...nextauth]/route.ts`: The core of the authentication system.
- `src/auth/adapter.ts`: The custom Sequelize adapter for NextAuth.js.
- `src/database/sequelize.ts`: Where the Sequelize instance is created and models are registered.
- `src/app/api/controllers/`: Contains the business logic for the API endpoints.
- `src/app/game/[code]/GamePage.tsx`: The main page for the user-facing game experience.

## Model Instrcutions

- For every task you must create a todo.md file in the project root.
- The todo file should be named `[task-name].todo.md`.
- The todo file should contain a checklist of tasks to complete.
- Each task should be a single line item starting with `- [ ]`.