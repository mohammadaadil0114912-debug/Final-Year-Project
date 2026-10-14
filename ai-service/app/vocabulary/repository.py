import json
import os
from typing import Dict, List, Optional, Tuple
from app.schemas.translation import SignMedia


class VocabularyRepository:
    def __init__(self, data_path: Optional[str] = None):
        if not data_path:
            # Default to ../../datasets/asl_vocabulary.json relative to this file
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            data_path = os.path.join(os.path.dirname(base_dir), "datasets", "asl_vocabulary.json")
            if not os.path.exists(data_path):
                # Fallback to local datasets
                data_path = os.path.join(base_dir, "datasets", "asl_vocabulary.json")
        
        self.data_path = data_path
        self.entries_by_id: Dict[str, dict] = {}
        self.term_index: Dict[str, dict] = {}
        self.gloss_index: Dict[str, dict] = {}
        self.load_data()

    def load_data(self):
        if not os.path.exists(self.data_path):
            print(f"Warning: Vocabulary file not found at {self.data_path}")
            return

        with open(self.data_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.entries_by_id.clear()
        self.term_index.clear()
        self.gloss_index.clear()

        for item in data:
            self.entries_by_id[item["id"]] = item
            
            # Map canonical English term
            norm_term = item["english_term"].strip().lower()
            self.term_index[norm_term] = item
            
            # Map gloss
            norm_gloss = item["asl_gloss"].strip().upper()
            self.gloss_index[norm_gloss] = item
            
            # Map synonyms
            for syn in item.get("synonyms", []):
                norm_syn = syn.strip().lower()
                if norm_syn not in self.term_index:
                    self.term_index[norm_syn] = item

    def get_all(self) -> List[dict]:
        return list(self.entries_by_id.values())

    def lookup_term(self, term: str) -> Optional[dict]:
        norm = term.strip().lower()
        return self.term_index.get(norm)

    def lookup_gloss(self, gloss: str) -> Optional[dict]:
        norm = gloss.strip().upper()
        return self.gloss_index.get(norm)

    def resolve_sign_media(self, gloss: str, term: Optional[str] = None) -> SignMedia:
        """
        Resolves media asset for a given gloss or English term.
        If not in verified catalog, generates a graceful fingerspelled fallback.
        """
        entry = self.lookup_gloss(gloss)
        if not entry and term:
            entry = self.lookup_term(term)

        if entry and entry.get("review_status") == "approved":
            media = entry.get("media", {})
            return SignMedia(
                gloss=entry["asl_gloss"],
                media_url=media.get("url"),
                fallback_image=media.get("fallback_image"),
                thumbnail_url=media.get("thumbnail_url"),
                media_type=media.get("type", "video"),
                source=media.get("source"),
                license=media.get("license"),
                verified=media.get("verified", True),
                is_fingerspelled=False,
                category=entry.get("category"),
                non_manual_signal=entry.get("non_manual_signal")
            )

        # Fallback to finger-spelling
        clean_gloss = gloss.replace("FS:", "").strip().upper()
        return SignMedia(
            gloss=f"FS:{clean_gloss}",
            media_url=None,
            fallback_image=f"https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/ASL_A.svg/120px-ASL_A.svg.png",
            thumbnail_url=None,
            media_type="fingerspell",
            source="System Fingerspelling Fallback",
            license="Open Access",
            verified=False,
            is_fingerspelled=True,
            category="fingerspelling",
            non_manual_signal="neutral"
        )


# Global singleton instance
vocab_repo = VocabularyRepository()
