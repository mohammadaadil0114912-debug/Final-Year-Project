import os
import json
from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.vocabulary.repository import vocab_repo


class VectorRAGRetriever:
    def __init__(self):
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.doc_vectors = None
        self.records: List[Dict[str, Any]] = []
        self.record_ids: List[str] = []
        self.is_indexed = False
        self.build_index()

    def build_index(self):
        vocab_items = vocab_repo.get_all()
        corpus_texts = []
        self.records = []
        self.record_ids = []

        for item in vocab_items:
            # Build rich document representation for RAG retrieval
            doc_id = item["id"]
            term = item.get("english_term", "")
            gloss = item.get("asl_gloss", "")
            synonyms = " ".join(item.get("synonyms", []))
            definition = item.get("definition", "")
            category = item.get("category", "")
            
            full_text = f"{term} {gloss} {synonyms} {definition} {category}"
            corpus_texts.append(full_text)
            self.records.append(item)
            self.record_ids.append(doc_id)

        # Add linguistic guidance records into RAG knowledge base
        guidance_records = [
            {
                "id": "rag-rule-wh-displacement",
                "english_term": "question wh where what who why how",
                "asl_gloss": "{q}",
                "category": "grammar_guidance",
                "definition": "In ASL syntax, WH-question words displace to the end of the sentence with furrowed eyebrows non-manual marker.",
                "source": "Gallaudet University ASL Linguistics",
                "review_status": "approved",
                "license": "Educational Open Access"
            },
            {
                "id": "rag-rule-time-fronting",
                "english_term": "yesterday today tomorrow time past future temporal",
                "asl_gloss": "TIME-FRONTING",
                "category": "grammar_guidance",
                "definition": "Temporal framing markers establish the timeline at the very beginning of the ASL sentence.",
                "source": "ASL Linguistics Reference",
                "review_status": "approved",
                "license": "Educational Open Access"
            },
            {
                "id": "rag-rule-copula-omission",
                "english_term": "is are am was were be copula verb",
                "asl_gloss": "OMIT-COPULA",
                "category": "grammar_guidance",
                "definition": "ASL does not use state-of-being copula verbs (is, are, am, was, were). Predicate adjectives directly follow the topic.",
                "source": "ASL Linguistics Reference",
                "review_status": "approved",
                "license": "Educational Open Access"
            }
        ]

        for guide in guidance_records:
            full_text = f"{guide['english_term']} {guide['asl_gloss']} {guide['definition']} {guide['category']}"
            corpus_texts.append(full_text)
            self.records.append(guide)
            self.record_ids.append(guide["id"])

        if corpus_texts:
            self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True)
            self.doc_vectors = self.vectorizer.fit_transform(corpus_texts)
            self.is_indexed = True

    def retrieve(self, query: str, top_k: int = 5, min_score: float = 0.2, category_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        if not self.is_indexed or not self.vectorizer:
            return []

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.doc_vectors).flatten()

        # Get top-k indices
        top_indices = np.argsort(similarities)[::-1]
        results = []

        for idx in top_indices:
            score = float(similarities[idx])
            if score < min_score:
                break
            record = self.records[idx]
            
            if category_filter and record.get("category") != category_filter:
                continue

            results.append({
                "id": record["id"],
                "gloss": record.get("asl_gloss", ""),
                "english_term": record.get("english_term", ""),
                "category": record.get("category", ""),
                "similarity_score": round(score, 4),
                "definition": record.get("definition", ""),
                "verified": record.get("review_status") == "approved",
                "source": record.get("media", {}).get("source", record.get("source", "Curated ASL Knowledge Base"))
            })

            if len(results) >= top_k:
                break

        return results


rag_retriever = VectorRAGRetriever()
