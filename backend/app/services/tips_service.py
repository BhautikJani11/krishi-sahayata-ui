from __future__ import annotations
from dataclasses import dataclass
from typing import List, Optional, Dict
import json
import os

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "tips.json")

@dataclass
class Tip:
    title: str
    description: str
    category: str
    lang: str = "en"

class TipsService:
    def __init__(self) -> None:
        self._tips: List[Tip] = self._load()

    def _load(self) -> List[Tip]:
        if not os.path.exists(DATA_FILE):
            return []
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data: Dict[str, List[Dict[str, str]]] = json.load(f)
        tips: List[Tip] = []
        for lang, items in data.items():
            for item in items:
                tips.append(Tip(lang=lang, **item))
        return tips

    def search(self, category: Optional[str] = None, q: Optional[str] = None, lang: Optional[str] = None) -> List[Dict[str, str]]:
        results: List[Tip] = self._tips
        if lang:
            results = [t for t in results if t.lang == lang]
        if category:
            results = [t for t in results if t.category.lower() == category.lower()]
        if q:
            ql = q.lower()
            results = [t for t in results if ql in t.title.lower() or ql in t.description.lower()]
        return [
            {"title": t.title, "description": t.description, "category": t.category}
            for t in results
        ]
