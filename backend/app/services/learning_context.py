from urllib.parse import quote_plus

import httpx

from app.schemas.schemas import LearningContextItem, LearningContextResponse


def _search_wikipedia(client: httpx.Client, query: str) -> list[LearningContextItem]:
    response = client.get(
        "https://pt.wikipedia.org/w/rest.php/v1/search/title",
        params={"q": query, "limit": 2},
    )
    response.raise_for_status()
    pages = response.json().get("pages", [])
    return [
        LearningContextItem(
            source="Wikipedia",
            title=page["title"],
            url=f"https://pt.wikipedia.org/wiki/{quote_plus(page['title'])}",
            excerpt=page.get("description") or "Contexto introdutório para a aula.",
        )
        for page in pages
        if page.get("title")
    ]


def _search_open_library(client: httpx.Client, query: str) -> list[LearningContextItem]:
    response = client.get(
        "https://openlibrary.org/search.json",
        params={"q": query, "limit": 2, "language": "por"},
    )
    response.raise_for_status()
    documents = response.json().get("docs", [])
    return [
        LearningContextItem(
            source="Open Library",
            title=document["title"],
            url=f"https://openlibrary.org{document['key']}",
            excerpt=", ".join(document.get("author_name", [])[:2])
            or "Livro relacionado ao objetivo da aula.",
        )
        for document in documents
        if document.get("title") and document.get("key")
    ]


def search_learning_context(query: str) -> LearningContextResponse:
    items: list[LearningContextItem] = []
    limitations = "Resultados externos são apenas contexto; o professor valida a adequação."

    try:
        with httpx.Client(timeout=8.0) as client:
            for search in (_search_wikipedia, _search_open_library):
                try:
                    items.extend(search(client, query))
                except (httpx.HTTPError, KeyError, TypeError, ValueError):
                    continue
    except httpx.HTTPError:
        limitations += " As fontes externas estão indisponíveis no momento."

    return LearningContextResponse(
        query=query,
        items=items[:4],
        limitations=limitations,
    )
