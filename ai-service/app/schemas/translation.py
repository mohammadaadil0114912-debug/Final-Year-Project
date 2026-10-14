from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class TextTranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description="English text to translate")
    strategy: str = Field(default="rag_grounded", description="Translation strategy: baseline_lexical, rule_nlp, or rag_grounded")
    include_diagnostics: bool = Field(default=True, description="Whether to include RAG evidence IDs and coverage stats")


class TranscriptTranslationRequest(BaseModel):
    transcript: str = Field(..., min_length=1, max_length=2000, description="Recognized speech transcript")
    audio_confidence: Optional[float] = Field(default=None, ge=0.0, le=1.0, description="Confidence score from speech recognizer")
    strategy: str = Field(default="rag_grounded", description="Translation strategy")


class SignMedia(BaseModel):
    gloss: str
    media_url: Optional[str] = None
    fallback_image: Optional[str] = None
    thumbnail_url: Optional[str] = None
    media_type: str = "video"
    source: Optional[str] = None
    license: Optional[str] = None
    verified: bool = True
    is_fingerspelled: bool = False
    category: Optional[str] = None
    non_manual_signal: Optional[str] = None


class ConfidenceMetrics(BaseModel):
    overall_label: str
    vocabulary_coverage: float
    retrieval_relevance: Optional[float] = None
    model_confidence: Optional[float] = None
    ocr_quality: Optional[float] = None
    speech_confidence: Optional[float] = None
    clarification_needed: bool = False
    clarification_prompt: Optional[str] = None


class TranslationResponse(BaseModel):
    request_id: str
    original_text: str
    normalized_text: str
    tokens: List[str]
    keywords: List[str]
    asl_gloss: str
    signs: List[SignMedia]
    missing_vocabulary: List[str]
    fingerspelled_tokens: List[str]
    confidence: ConfidenceMetrics
    retrieval_evidence: List[str]
    processing_method: str
    limitations_notice: str
    duration_ms: float


class RetrievalRequest(BaseModel):
    query: str = Field(..., min_length=1)
    top_k: int = Field(default=5, ge=1, le=20)
    min_score: float = Field(default=0.4, ge=0.0, le=1.0)


class RetrievedEntry(BaseModel):
    id: str
    gloss: str
    english_term: str
    category: str
    similarity_score: float
    definition: str
    verified: bool
    source: str


class RetrievalResponse(BaseModel):
    query: str
    results: List[RetrievedEntry]
    total_found: int


class EvaluationRequest(BaseModel):
    dataset_name: str = Field(default="core_asl_bench_v1")
    strategies: List[str] = Field(default=["baseline_lexical", "rule_nlp", "rag_grounded"])


class StrategyEvaluationResult(BaseModel):
    strategy: str
    total_samples: int
    bleu_1: float
    bleu_2: float
    bleu_4: float
    chrf_score: float
    vocabulary_coverage_rate: float
    unsupported_output_rate: float
    avg_latency_ms: float
    sample_outputs: List[Dict[str, Any]]


class EvaluationResponse(BaseModel):
    dataset_name: str
    evaluated_at: str
    results: List[StrategyEvaluationResult]
    summary_analysis: str
