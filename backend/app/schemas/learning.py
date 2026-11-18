from pydantic import BaseModel, Field


class LearningContextItem(BaseModel):
    source: str
    title: str
    url: str
    excerpt: str


class LearningContextResponse(BaseModel):
    query: str
    items: list[LearningContextItem] = Field(default_factory=list)
    limitations: str
