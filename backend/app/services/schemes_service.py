from __future__ import annotations
from dataclasses import dataclass
from typing import List, Optional, Dict
import json
import os

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "schemes.json")

@dataclass
class Scheme:
    name: str
    description: str
    url: Optional[str] = None
    lang: str = "en"

class SchemesService:
    def __init__(self) -> None:
        self._schemes: List[Scheme] = self._load()

    def _load(self) -> List[Scheme]:
        if not os.path.exists(DATA_FILE):
            return []
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data: Dict[str, List[Dict[str, str]]] = json.load(f)
        schemes: List[Scheme] = []
        for lang, items in data.items():
            for item in items:
                schemes.append(Scheme(lang=lang, **item))
        return schemes

    def search(self, q: Optional[str] = None, lang: Optional[str] = None) -> List[Dict[str, str]]:
        results: List[Scheme] = self._schemes
        if lang:
            results = [s for s in results if s.lang == lang]
        if q:
            ql = q.lower()
            results = [s for s in results if ql in s.name.lower() or ql in s.description.lower()]
        return [
            {"name": s.name, "description": s.description, "url": s.url}
            for s in results
        ]
