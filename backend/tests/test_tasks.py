from datetime import datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app import models

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def clear_db():
    db = TestingSessionLocal()
    db.query(models.Task).delete()
    db.commit()
    db.close()


def test_create_and_list_tasks():
    clear_db()
    payload = {"title": "Write tests", "priority": "high"}
    response = client.post("/api/tasks", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Write tests"

    response = client.get("/api/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 1


def test_toggle_task():
    clear_db()
    payload = {"title": "Toggle me"}
    response = client.post("/api/tasks", json=payload)
    task_id = response.json()["id"]

    response = client.patch(f"/api/tasks/{task_id}/toggle")
    assert response.status_code == 200
    assert response.json()["completed"] is True


def test_search_and_sort():
    clear_db()
    now = datetime.utcnow()
    tasks = [
        {"title": "Alpha", "priority": "low", "due_date": (now + timedelta(days=2)).isoformat()},
        {"title": "Beta", "priority": "high", "due_date": (now + timedelta(days=1)).isoformat()},
        {"title": "Gamma", "priority": "medium", "description": "searchable"},
    ]
    for payload in tasks:
        client.post("/api/tasks", json=payload)

    response = client.get("/api/tasks", params={"search": "searchable"})
    assert response.status_code == 200
    filtered = response.json()
    assert len(filtered) == 1
    assert filtered[0]["title"] == "Gamma"

    response = client.get("/api/tasks", params={"sort_by": "priority", "sort_dir": "desc"})
    assert response.status_code == 200
    sorted_tasks = response.json()
    assert sorted_tasks[0]["title"] == "Beta"
