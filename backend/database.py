import os
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is required and must point to a MySQL database.")

# Ensure MySQL connection string format
if not DATABASE_URL.startswith(("mysql+pymysql://", "mysql://")):
    raise RuntimeError("DATABASE_URL must be a MySQL connection string (format: mysql+pymysql://user:password@host:port/database)")

engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=3600)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=0, nullable=False, index=True)  # Not used, kept for database compatibility
    url = Column(String(1024), nullable=False, index=True)
    title = Column(String(512), nullable=False)
    date_generated = Column(DateTime, default=datetime.utcnow)
    scraped_content = Column(Text)
    full_quiz_data = Column(Text)

def init_db():
    Base.metadata.create_all(bind=engine)
