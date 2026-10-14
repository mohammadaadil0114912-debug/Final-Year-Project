# Research Methodology & Experimental Evaluation Framework

## 1. Primary Research Hypothesis
> **Hypothesis**: "Retrieval-grounded, context-aware processing improves the quality, grammatical fidelity, and reliability of English-to-ASL intermediate representations compared with a simple dictionary-based word-to-sign baseline."

## 2. Experimental Systems Compared

### System A: Baseline Lexical Lookup (Dictionary Baseline)
- **Mechanism**: Tokenizes English input, strips punctuation, performs direct lemma matching against the ASL dictionary.
- **Assumptions**: 1:1 mapping between English words and signs, preservation of English word order (SVO).
- **Known Flaws**: Fails on ASL non-manual signals, misplaces WH-words, fails to omit copulas, lacks directional verb adjustments.

### System B: Context-Aware Rule-Based NLP Pipeline
- **Mechanism**: Syntactic dependency analysis, POS tagging, entity identification, clause boundary detection, and rule-based linguistic transformations:
  - TIME fronting.
  - Topic-Comment inversion.
  - WH-movement to terminal clause position with `{q}` annotation.
  - Copula and article suppression.
  - Negation shift to predicate position with `{neg}` annotation.
- **Advancement**: Emulates authentic ASL syntactic ordering.
- **Limitation**: Can produce missing signs for unobserved or idiom expressions.

### System C: Proposed System — Context-Aware NLP + RAG Grounding
- **Mechanism**: Combines Context-Aware NLP with vector-based retrieval from a curated knowledge base of 300+ approved ASL expressions, idioms, and educational video mappings.
- **Capabilities**:
  - Semantic vector retrieval handles phrasing variations (e.g., "physician" -> retrieves verified sign for `DOCTOR`).
  - Evidence tracking: outputs traceable record IDs for every sign asset.
  - Granular confidence: transparently breaks down vocabulary coverage, retrieval similarity, model confidence, and OCR/speech quality.
  - Fingerspelling fallback for named entities or unsupported words.

---

## 3. Evaluation Metrics
1. **BLEU (Bilingual Evaluation Understudy)**: BLEU-1, BLEU-2, and Sentence-level BLEU-4 against verified human ASL reference glosses.
2. **chrF++ (Character n-gram F-score)**: Robust to morphological inflection and spelling variations in gloss tokens.
3. **Vocabulary Coverage Rate (VCR)**:
   $$\text{VCR} = \frac{|\text{Tokens with verified sign assets}|}{|\text{Total generated gloss tokens}|}$$
4. **Unsupported Output Rate (UOR)**:
   $$\text{UOR} = \frac{|\text{Tokens requiring fingerspelling or flagged missing}|}{|\text{Total tokens}|}$$
5. **Retrieval Precision@K**: Correctness of retrieved knowledge records for idiom and multi-word ASL equivalents.
6. **Inference Latency (ms)**: End-to-end processing duration from raw input to structured JSON response.

---

## 4. Benchmark Dataset: `core_asl_bench_v1`
The evaluation dataset contains 50 verified English-to-ASL sentence pairs covering:
- Daily Conversational & Greetings (10)
- WH-Questions & Yes/No Inquiries (10)
- Emergency, Medical & Basic Needs (10)
- Time, Temporal Framing & Directional Verbs (10)
- Negation, Modals & Complex Clauses (10)

All reference glosses have been reviewed and standardized against ASL linguistic reference corpora (ASL-LEX and Gallaudet University linguistic guidelines).
