# Full-Stack TODO List

Production-ready TODO application with a FastAPI backend and a React + Tailwind frontend.

## Project Structure

```
backend/
  app/
    main.py
    database.py
    models.py
    schemas.py
    crud.py
    routers/
      tasks.py
frontend/
  src/
    components/
    hooks/
    services/
    utils/
```

## Backend Setup (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`.

## Frontend Setup (React + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Frontend Tests

```bash
cd frontend
npm run test
```

## API Endpoints

Base URL: `http://localhost:8000/api`

- `GET /tasks?status=all|completed|pending&category=Work`
- `GET /tasks?search=query&sort_by=created_at|priority|due_date|title&sort_dir=asc|desc`
- `GET /tasks/{id}`
- `POST /tasks`
- `PUT /tasks/{id}`
- `PATCH /tasks/{id}/toggle`
- `DELETE /tasks/{id}`
- `GET /tasks/stats`

## Notes

- SQLite database file is created at `backend/app.db`.
- Update CORS origins in `backend/app/main.py` if you change frontend ports.

### Backend Tests

```bash
cd backend
pytest
```
# To-Do-list
