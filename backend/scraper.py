import re
from typing import List, Dict

import requests
from bs4 import BeautifulSoup

USER_AGENT = (
    "AIWikiQuizGenerator/1.0 (+https://github.com/deep-klarity/ai-wiki-quiz-generator)"
)


def _clean_text(text: str) -> str:
    text = re.sub(r"\[\d+\]", "", text)
    text = re.sub(r"\n+", "\n", text)
    return text.strip()


def _extract_summary(paragraphs: List[str], sentence_limit: int = 2) -> str:
    cleaned = [p.strip() for p in paragraphs if p and p.strip()]
    summary = " ".join(cleaned[:sentence_limit])
    return summary.strip()


def _extract_infobox_facts(main_content: "BeautifulSoup") -> List[str]:
    facts: List[str] = []
    infobox = main_content.find("table", class_=lambda c: c and "infobox" in c)
    if not infobox:
        return facts
    for row in infobox.find_all("tr", recursive=True):
        header = row.find(["th", "td"], class_=lambda c: c and "infobox-label" in c) or row.find("th")
        data = row.find(["td"], class_=lambda c: c and "infobox-data" in c) or row.find("td")
        if header and data:
            h = header.get_text(" ", strip=True)
            d = data.get_text(" ", strip=True)
            if h and d and len(h) < 40 and len(d) < 200:
                facts.append(f"{h}: {d}")
    return facts[:10]


def _sections_to_text(main_content: "BeautifulSoup") -> Dict[str, str]:
    section_text: Dict[str, str] = {}
    current = "Introduction"
    buffer: List[str] = []
    for el in main_content.children:
        name = getattr(el, "name", None)
        if name in ["h2", "h3", "h4"]:
            if buffer:
                section_text[current] = _clean_text("\n".join(buffer))
                buffer = []
            header_text = el.get_text(" ", strip=True).replace("[edit]", "").strip()
            current = header_text or current
        elif name == "p":
            text = el.get_text(" ", strip=True)
            if text:
                buffer.append(text)
    if buffer:
        section_text[current] = _clean_text("\n".join(buffer))
    return section_text


def _build_structured_article_text(title: str, summary: str, sections: List[str], section_text: Dict[str, str], facts: List[str]) -> str:
    lines: List[str] = []
    lines.append(f"Title: {title}")
    if summary:
        lines.append("")
        lines.append("Summary:")
        # split summary into short bullet-like sentences
        bullets = [s.strip() for s in re.split(r"(?<=[.!?])\s+", summary) if s.strip()]
        for b in bullets[:5]:
            lines.append(f"- {b}")
    if facts:
        lines.append("")
        lines.append("Key facts (from infobox):")
        for f in facts:
            lines.append(f"- {f}")
    if sections:
        lines.append("")
        lines.append("Sections:")
        for s in sections[:25]:
            lines.append(f"- {s}")
    # Section-wise condensed text
    lines.append("")
    lines.append("Section details:")
    char_budget = 12000  # keep prompt efficient
    for sec, txt in section_text.items():
        if char_budget <= 0:
            break
        snippet = txt[:1000]
        char_budget -= len(snippet)
        lines.append(f"## {sec}")
        lines.append(snippet)
        lines.append("")
    return "\n".join(lines).strip()


def scrape_wikipedia(url: str) -> dict:
    try:
        resp = requests.get(
            url,
            headers={"User-Agent": USER_AGENT},
            timeout=20,
        )
        resp.raise_for_status()
    except requests.RequestException as exc:
        raise ValueError("Unable to fetch the article.") from exc

    soup = BeautifulSoup(resp.text, "html.parser")
    title_tag = soup.find("h1", {"id": "firstHeading"})
    title = title_tag.text.strip() if title_tag else "Wikipedia Article"

    content_div = soup.find("div", {"id": "mw-content-text"})
    if content_div is None:
        raise ValueError("Could not parse Wikipedia content.")

    main_content = content_div.find("div", class_="mw-parser-output") or content_div

    # Remove navigation, references, and scripts that add noise (keep infobox for facts extraction first)
    for el in main_content.find_all(["sup", "style", "script", "noscript"], recursive=True):
        el.decompose()

    text = _clean_text(main_content.get_text(separator="\n", strip=True))

    paragraphs = [p.get_text(" ").strip() for p in main_content.find_all("p", recursive=False)]
    if not paragraphs:
        # Fallback: allow nested paragraphs if direct children missing
        paragraphs = [p.get_text(" ").strip() for p in main_content.find_all("p", recursive=True)]
    summary = _extract_summary(paragraphs)

    section_headers = []
    for header in main_content.find_all(["h2", "h3", "h4", "h5"]):
        headline = header.get_text(" ").strip()
        if headline:
            section_headers.append(headline.replace("[edit]", "").strip())

    # Build structured text for LLM
    try:
        facts = _extract_infobox_facts(main_content)
    except Exception:
        facts = []

    try:
        section_text = _sections_to_text(main_content)
    except Exception:
        section_text = {}

    structured_text = _build_structured_article_text(
        title=title,
        summary=summary,
        sections=section_headers,
        section_text=section_text,
        facts=facts,
    )

    return {
        "title": title,
        "text": text,
        "sections": section_headers,
        "summary": summary,
        "structured_text": structured_text,
        "raw_html": resp.text,
    }
