import os
from typing import List

from dotenv import load_dotenv

from models import QuizOutput

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


def get_llm_chain_article_to_quiz():
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.prompts import PromptTemplate
        from langchain_core.output_parsers import PydanticOutputParser
    except ImportError as exc:
        raise RuntimeError("Missing langchain-google-genai; please install dependencies.") from exc

    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY environment variable is required to call the Gemini API.")

    parser = PydanticOutputParser(pydantic_object=QuizOutput)

    prompt_template = PromptTemplate(
        template="""
You are an expert educational content designer. Given the structured Wikipedia article below, produce a quiz and supporting metadata grounded strictly in that source.

### Output contract
- Use the JSON schema provided in the format instructions.
- Fill the `url` field exactly with: {article_url}
- Ensure every quiz question has exactly four options, a single correct answer, a difficulty value from {{"easy","medium","hard"}}, and a one-sentence explanation referencing the article content.
- If specific information is unavailable, respond with "Not specified" rather than inventing facts.

Required JSON schema:
{format_instructions}

--- ARTICLE START (STRUCTURED) ---
{article_text}
--- ARTICLE END ---

Provide a concise summary (3-4 sentences max), list notable sections found in the article, extract key people/organizations/locations mentioned, and recommend 3-5 related Wikipedia topics for continued learning.
""",
        input_variables=["article_text", "article_url"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=GEMINI_API_KEY,
        temperature=0.3,
        top_p=0.8,
    )

    def generate_quiz(article_text: str, url: str, sections: List[str], summary: str):
        formatted_prompt = prompt_template.format(article_text=article_text, article_url=url)
        response = llm.invoke(formatted_prompt)
        try:
            parsed = parser.parse(response.content)
        except Exception as exc:
            raise RuntimeError("LLM output parse error: " + str(exc)) from exc

        quiz_payload = parsed.dict()
        # Overwrite fields that should come from deterministic scraping rather than the model.
        quiz_payload["url"] = url
        quiz_payload["summary"] = summary or quiz_payload.get("summary", "")
        quiz_payload["sections"] = sections
        return quiz_payload

    return generate_quiz
