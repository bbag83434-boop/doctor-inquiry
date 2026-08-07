# Architecture Decision Record: Clean Architecture

## Context
The "Doctor Inquiry" project requires a scalable and maintainable structure to handle complex domain logic and separate the frontend from the backend.

## Decision
We are adopting a Clean Architecture approach.

### Backend (Layered)
- **Routes**: Define endpoints and map them to controllers.
- **Controllers**: Handle HTTP requests, validate input, and call services.
- **Services**: Contain business logic and domain rules.
- **Models**: Define data structures and database interactions.
- **Middleware**: Shared logic like authentication and error handling.

### Frontend (Feature-Based)
- **Features**: Group related logic, components, and hooks by domain feature (e.g., `inquiry-form`).
- **Components**: Shared, stateless UI components.
- **Services**: Handle external communication (API calls).
- **Store**: Manage global state.
- **Hooks**: Reusable React logic.

## Consequences
- **Pros**: High testability, clear separation of concerns, easier to scale.
- **Cons**: More boilerplate initially.
