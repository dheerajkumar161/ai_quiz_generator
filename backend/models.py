from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class KeyEntities(BaseModel):
    people: List[str] = Field(default_factory=list)
    organizations: List[str] = Field(default_factory=list)
    locations: List[str] = Field(default_factory=list)

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str
    difficulty: Literal["easy", "medium", "hard"]
    explanation: str

class QuizOutput(BaseModel):
    id: Optional[int]
    url: str = ""
    title: str = ""
    summary: str = ""
    key_entities: KeyEntities = Field(default_factory=KeyEntities)
    sections: List[str] = Field(default_factory=list)
    quiz: List[QuizQuestion] = Field(default_factory=list)
    related_topics: List[str] = Field(default_factory=list)
