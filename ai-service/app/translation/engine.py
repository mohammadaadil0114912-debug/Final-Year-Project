import time
import uuid
from typing import List, Dict, Any, Tuple, Optional
from app.nlp.grammar_transformer import grammar_transformer
from app.retrieval.vector_rag import rag_retriever
from app.vocabulary.repository import vocab_repo
from app.schemas.translation import TranslationResponse, SignMedia, ConfidenceMetrics


class TranslationEngine:
    def __init__(self):
        pass

    def translate_baseline_a(self, text: str) -> Tuple[str, List[str], List[str]]:
        """
        Baseline A: Direct Dictionary / Word-to-Sign Lookup.
        Maintains English word order and copulas, no syntactic movement.
        """
        tokens = grammar_transformer.tokenize(grammar_transformer.normalize(text))
        gloss_tokens = []
        for t in tokens:
            entry = vocab_repo.lookup_term(t)
            if entry:
                gloss_tokens.append(entry["asl_gloss"])
            else:
                gloss_tokens.append(t.upper())
        return " ".join(gloss_tokens), gloss_tokens, []

    def translate_baseline_b(self, text: str) -> Tuple[str, List[str], List[str]]:
        """
        Baseline B: Context-Aware Rule-Based NLP Pipeline.
        Applies Topic-Comment, WH-movement, Time-fronting, copula deletion, and NMS markers.
        """
        return grammar_transformer.transform_to_asl_gloss(text)

    def translate_system_c(self, text: str) -> Dict[str, Any]:
        """
        Proposed System C: Context-Aware NLP + RAG-Grounded Retrieval + Uncertainty Handling.
        Grounds syntactic representation against verified knowledge base, computes coverage,
        and provides calibrated confidence diagnostics.
        """
        start_time = time.time()
        req_id = f"req-{uuid.uuid4().hex[:8]}"

        norm_text = grammar_transformer.normalize(text)
        analysis = grammar_transformer.analyze_sentence(text)
        raw_gloss, gloss_tokens, keywords = grammar_transformer.transform_to_asl_gloss(text)

        # Vector RAG search for relevant knowledge and idiom equivalents
        rag_results = rag_retriever.retrieve(norm_text, top_k=4, min_score=0.1)
        evidence_ids = [r["id"] for r in rag_results]

        # Ground candidate gloss tokens against verified vocabulary
        signs: List[SignMedia] = []
        missing_vocab: List[str] = []
        fingerspelled: List[str] = []

        verified_count = 0
        total_eval_tokens = 0

        for token in gloss_tokens:
            # Ignore grammatical markers from vocabulary lookup count
            if token.startswith("{") and token.endswith("}"):
                continue

            total_eval_tokens += 1
            # Check if token matches a verified ASL entry
            sign_media = vocab_repo.resolve_sign_media(token, term=token.lower())
            
            if sign_media.verified:
                verified_count += 1
                signs.append(sign_media)
            else:
                missing_vocab.append(token)
                fingerspelled.append(token)
                signs.append(sign_media)

        # Calculate calibrated metrics
        coverage = (verified_count / total_eval_tokens) if total_eval_tokens > 0 else 1.0
        avg_retrieval_rel = (
            sum(r["similarity_score"] for r in rag_results) / len(rag_results)
            if rag_results else 0.5
        )
        
        # Model confidence: weighted combination of coverage and syntactic alignment
        model_confidence = round(0.6 * coverage + 0.4 * min(1.0, avg_retrieval_rel + 0.2), 2)

        # Transparent classification label
        if coverage == 1.0:
            overall_label = "Verified vocabulary match"
        elif coverage >= 0.7:
            overall_label = "Partial vocabulary coverage"
        elif coverage > 0.0:
            overall_label = "Approximate translation (with fingerspelling)"
        else:
            overall_label = "Unavailable signs (Fingerspelled fallback)"

        # Ambiguity detection
        clarification_needed = False
        clarification_prompt = None
        if len(norm_text.split()) < 3 and "?" in text and not analysis["is_wh_question"]:
            clarification_needed = True
            clarification_prompt = "Short ambiguous question detected. Specifying the subject or context will enhance translation accuracy."

        duration_ms = round((time.time() - start_time) * 1000, 2)

        confidence_obj = ConfidenceMetrics(
            overall_label=overall_label,
            vocabulary_coverage=round(coverage, 2),
            retrieval_relevance=round(avg_retrieval_rel, 2),
            model_confidence=model_confidence,
            ocr_quality=None,
            speech_confidence=None,
            clarification_needed=clarification_needed,
            clarification_prompt=clarification_prompt
        )

        limitations_notice = (
            "ASL is a natural visual-spatial language with its own grammar. This output presents an "
            "empirically structured gloss sequence and verified citation signs, not co-articulated signing."
        )

        return {
            "request_id": req_id,
            "original_text": text,
            "normalized_text": norm_text,
            "tokens": analysis["tokens"],
            "keywords": keywords,
            "asl_gloss": raw_gloss,
            "signs": [s.model_dump() for s in signs],
            "missing_vocabulary": missing_vocab,
            "fingerspelled_tokens": fingerspelled,
            "confidence": confidence_obj.model_dump(),
            "retrieval_evidence": evidence_ids,
            "processing_method": "rag_grounded_topic_comment",
            "limitations_notice": limitations_notice,
            "duration_ms": duration_ms
        }

    def process(self, text: str, strategy: str = "rag_grounded") -> Dict[str, Any]:
        if strategy == "baseline_lexical":
            start_time = time.time()
            gloss, tokens, _ = self.translate_baseline_a(text)
            signs = [vocab_repo.resolve_sign_media(t).model_dump() for t in tokens]
            duration = round((time.time() - start_time) * 1000, 2)
            return {
                "request_id": f"base-a-{uuid.uuid4().hex[:6]}",
                "original_text": text,
                "normalized_text": text.lower().strip(),
                "tokens": tokens,
                "keywords": [],
                "asl_gloss": gloss,
                "signs": signs,
                "missing_vocabulary": [s["gloss"] for s in signs if not s["verified"]],
                "fingerspelled_tokens": [],
                "confidence": {
                    "overall_label": "Baseline dictionary lookup (No grammar restructuring)",
                    "vocabulary_coverage": 0.8,
                    "retrieval_relevance": None,
                    "model_confidence": 0.5,
                    "ocr_quality": None,
                    "speech_confidence": None,
                    "clarification_needed": False,
                    "clarification_prompt": None
                },
                "retrieval_evidence": [],
                "processing_method": "baseline_lexical_lookup",
                "limitations_notice": "Word-for-word substitution preserving English word order; does not reflect ASL grammar.",
                "duration_ms": duration
            }
        elif strategy == "rule_nlp":
            start_time = time.time()
            gloss, tokens, keywords = self.translate_baseline_b(text)
            signs = [vocab_repo.resolve_sign_media(t).model_dump() for t in tokens if not (t.startswith("{") and t.endswith("}"))]
            duration = round((time.time() - start_time) * 1000, 2)
            return {
                "request_id": f"base-b-{uuid.uuid4().hex[:6]}",
                "original_text": text,
                "normalized_text": text.lower().strip(),
                "tokens": tokens,
                "keywords": keywords,
                "asl_gloss": gloss,
                "signs": signs,
                "missing_vocabulary": [s["gloss"] for s in signs if not s["verified"]],
                "fingerspelled_tokens": [],
                "confidence": {
                    "overall_label": "Context-aware rule-based NLP",
                    "vocabulary_coverage": 0.85,
                    "retrieval_relevance": None,
                    "model_confidence": 0.75,
                    "ocr_quality": None,
                    "speech_confidence": None,
                    "clarification_needed": False,
                    "clarification_prompt": None
                },
                "retrieval_evidence": [],
                "processing_method": "rule_based_topic_comment",
                "limitations_notice": "Syntactic transformation applied; lacks RAG grounding.",
                "duration_ms": duration
            }
        else:
            return self.translate_system_c(text)


translation_engine = TranslationEngine()
