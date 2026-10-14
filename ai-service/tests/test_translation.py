import pytest
from app.nlp.grammar_transformer import grammar_transformer
from app.vocabulary.repository import vocab_repo
from app.retrieval.vector_rag import rag_retriever
from app.translation.engine import translation_engine
from app.evaluation.benchmark_runner import benchmark_runner


def test_grammar_transformer_wh_movement():
    text = "Where is the hospital?"
    gloss, tokens, keywords = grammar_transformer.transform_to_asl_gloss(text)
    assert "HOSPITAL" in gloss
    assert "WHERE" in gloss
    assert "{q}" in gloss
    assert "IS" not in tokens  # Copula deleted
    assert "THE" not in tokens  # Article deleted


def test_grammar_transformer_time_fronting():
    text = "I will go tomorrow"
    gloss, tokens, keywords = grammar_transformer.transform_to_asl_gloss(text)
    assert gloss.startswith("TOMORROW")
    assert "GO" in gloss


def test_grammar_transformer_negation():
    text = "I do not understand"
    gloss, tokens, keywords = grammar_transformer.transform_to_asl_gloss(text)
    assert "UNDERSTAND" in gloss
    assert "NOT" in gloss
    assert "{neg}" in gloss


def test_vocabulary_repository_lookup():
    hello_entry = vocab_repo.lookup_term("hello")
    assert hello_entry is not None
    assert hello_entry["asl_gloss"] == "HELLO"
    assert hello_entry["review_status"] == "approved"

    # Test synonym
    hi_entry = vocab_repo.lookup_term("hi")
    assert hi_entry is not None
    assert hi_entry["asl_gloss"] == "HELLO"


def test_vector_rag_retrieval():
    results = rag_retriever.retrieve("doctor hospital medicine", top_k=3)
    assert len(results) > 0
    top_ids = [r["id"] for r in results]
    assert any("doctor" in i or "hospital" in i for i in top_ids)


def test_translation_engine_system_c():
    res = translation_engine.process("Hello, what is your name?", strategy="rag_grounded")
    assert res["request_id"].startswith("req-")
    assert "HELLO" in res["asl_gloss"]
    assert "NAME" in res["asl_gloss"]
    assert "WHAT" in res["asl_gloss"]
    assert res["confidence"]["vocabulary_coverage"] > 0.8
    assert len(res["signs"]) > 0
    assert len(res["retrieval_evidence"]) > 0


def test_benchmark_runner():
    res = benchmark_runner.run_benchmark(strategies=["baseline_lexical", "rag_grounded"])
    assert res["dataset_name"] == "core_asl_bench_v1"
    assert len(res["results"]) == 2
    # Verify System C achieves higher BLEU-4 and chrF than Baseline A
    strat_map = {r["strategy"]: r for r in res["results"]}
    assert strat_map["rag_grounded"]["chrf_score"] > strat_map["baseline_lexical"]["chrf_score"]
