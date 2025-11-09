import json
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import SessionLocal, init_db, Quiz
from sqlalchemy.orm import Session
from scraper import scrape_wikipedia
from llm_quiz_generator import get_llm_chain_article_to_quiz

app = FastAPI(title="AI Wiki Quiz Generator", docs_url="/docs")

# CORS configuration - MUST be added BEFORE init_db() and routes
# Note: Cannot use allow_credentials=True with allow_origins=["*"]
# This is a CORS specification limitation
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,  # Must be False when using wildcard origins
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Expose all headers
)

init_db()

generate_quiz_llm = get_llm_chain_article_to_quiz()


# Helper function to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Pydantic models for requests/responses
class QuizGenerateRequest(BaseModel):
    url: str


class URLPreviewRequest(BaseModel):
    url: str


@app.get("/")
def home():
    return {"msg": "AI Quiz Generator API running."}

@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Handle OPTIONS requests for CORS preflight"""
    return {"message": "OK"}


@app.post("/url/preview")
def preview_url(data: URLPreviewRequest, db: Session = Depends(get_db)):
    """Preview article title before generating quiz (bonus feature)"""
    url = data.url
    if not url or "wikipedia.org/wiki/" not in url:
        raise HTTPException(status_code=400, detail="Provide a valid Wikipedia article URL.")
    
    try:
        scraped = scrape_wikipedia(url)
        return {
            "title": scraped.get("title", "Unknown"),
            "url": url,
            "summary": scraped.get("summary", "")[:200] + "..." if len(scraped.get("summary", "")) > 200 else scraped.get("summary", "")
        }
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Could not fetch article: " + str(exc))


@app.post("/generate_quiz")
def generate_quiz(
    data: QuizGenerateRequest,
    db: Session = Depends(get_db)
):
    """Generate quiz from Wikipedia URL. Caches results by URL."""
    url = data.url
    if not url or "wikipedia.org/wiki/" not in url:
        raise HTTPException(status_code=400, detail="Provide a valid Wikipedia article URL.")

    # Check for duplicate (cache) - by URL only
    existing = db.query(Quiz).filter(Quiz.url == url).first()
    if existing:
        quiz_json = json.loads(existing.full_quiz_data)
        quiz_json["id"] = existing.id
        return quiz_json

    # Scrape & clean
    try:
        scraped = scrape_wikipedia(url)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Scrape error: " + str(exc)) from exc

    # LLM
    try:
        # Prefer structured text for better grounding and formatting
        article_payload = scraped.get("structured_text") or scraped["text"]
        quiz_json = generate_quiz_llm(
            article_payload,
            url,
            scraped.get("sections", []),
            scraped.get("summary", ""),
        )
        quiz_json["title"] = scraped.get("title") or quiz_json.get("title") or "Wikipedia Article"
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Quiz generator error: " + str(exc)) from exc

    # Store quiz (no user association)
    try:
        quiz_record = Quiz(
            user_id=None,  # No user association needed
            url=url,
            title=quiz_json["title"],
            scraped_content=scraped.get("raw_html"),  # Store raw HTML (bonus feature)
            full_quiz_data=json.dumps(quiz_json),
        )
        db.add(quiz_record)
        db.commit()
        db.refresh(quiz_record)
        quiz_json["id"] = quiz_record.id
        return quiz_json
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="DB error: " + str(exc)) from exc


@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    """Get all quiz history"""
    quizzes = db.query(Quiz).order_by(Quiz.date_generated.desc()).all()
    return [
        {
            "id": q.id,
            "url": q.url,
            "title": q.title,
            "date_generated": q.date_generated.isoformat() if q.date_generated else None,
        }
        for q in quizzes
    ]


@app.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    """Get quiz details"""
    record = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Quiz not found")
    quiz_json = json.loads(record.full_quiz_data)
    quiz_json["id"] = record.id
    return quiz_json
