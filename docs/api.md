# ASL Bridge AI: REST API Documentation

## 1. Gateway Overview
The system features two interconnected API layers:
1. **Express.js Application Gateway** (`http://localhost:5000/api`): Authentication, user state, history persistence, favorites, feedback, and admin vocabulary moderation.
2. **FastAPI AI Microservice** (`http://localhost:8000/ai`): NLP processing, ASL gloss synthesis, vector retrieval, OCR image processing, and translation evaluation.

---

## 2. Express Backend Endpoints

### 2.1 System Health
- **`GET /api/health`**
  - **Response**: `{ "status": "ok", "service": "asl-bridge-backend", "timestamp": "ISO8601", "database": "connected", "aiService": "reachable" }`

### 2.2 Authentication & Profile
- **`POST /api/auth/register`**
  - **Body**: `{ "email": "user@example.com", "password": "securepassword", "name": "Jane Doe", "preferredMode": "text" }`
  - **Response**: `{ "token": "<JWT_TOKEN>", "user": { "id": "...", "email": "...", "name": "...", "role": "user" } }`
- **`POST /api/auth/login`**
  - **Body**: `{ "email": "user@example.com", "password": "securepassword" }`
  - **Response**: `{ "token": "<JWT_TOKEN>", "user": { ... } }`
- **`GET /api/auth/me`**
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: User profile with saved preferences, history retention toggle, and role.

### 2.3 Multimodal Translation Proxies
- **`POST /api/translate/text`**
  - **Headers**: Optional `Authorization: Bearer <token>`
  - **Body**: `{ "text": "What is your name?", "strategy": "rag_grounded" }`
  - **Response**: Enriched translation object with gloss sequence, sign assets, coverage score, confidence metrics, and diagnostics.
- **`POST /api/translate/speech`**
  - **Body**: `{ "transcript": "Hello, how are you today?", "audioConfidence": 0.94 }`
- **`POST /api/translate/image`**
  - **Multipart Form**: `image` (JPEG/PNG file)
  - **Response**: OCR extracted text, sanitized preview, confidence score, and piped translation.

### 2.4 User Phrases & History
- **`GET /api/phrases`**: Retrieve saved phrases and emergency accessibility presets.
- **`POST /api/phrases`**: Save phrase to user favorites.
- **`DELETE /api/phrases/:id`**: Remove phrase from favorites.
- **`GET /api/history`**: Paginated translation log (if user has enabled history retention).
- **`DELETE /api/history`**: Bulk purge user history.
- **`DELETE /api/history/:id`**: Remove individual history item.

### 2.5 Feedback & Moderation
- **`POST /api/feedback`**: Submit user correction or flagging for an inaccurate gloss translation.
- **`GET /api/admin/vocabulary`**: List vocabulary entries with pagination and approval filters (Admin only).
- **`POST /api/admin/vocabulary`**: Create new verified sign vocabulary record (Admin only).
- **`PATCH /api/admin/vocabulary/:id`**: Update metadata, definition, or video asset reference.
- **`POST /api/admin/vocabulary/:id/review`**: Set status (`approved`, `flagged`, `deprecated`) with reviewer notes.

---

## 3. FastAPI AI Service Endpoints

### 3.1 Translation Core
- **`POST /ai/translate/text`**
  - **Request Body**:
    ```json
    {
      "text": "Where is the nearest hospital?",
      "strategy": "rag_grounded",
      "include_diagnostics": true
    }
    ```
  - **Response Schema (`TranslationResponse`)**:
    ```json
    {
      "request_id": "req-1729000000",
      "original_text": "Where is the nearest hospital?",
      "normalized_text": "where is the nearest hospital",
      "tokens": ["where", "is", "the", "nearest", "hospital"],
      "keywords": ["nearest", "hospital", "where"],
      "asl_gloss": "HOSPITAL NEAR WHERE {q}",
      "signs": [
        {
          "gloss": "HOSPITAL",
          "media_url": "https://assets.aslbridge.org/signs/hospital.mp4",
          "media_type": "video",
          "source": "WLASL / ASL-LEX",
          "verified": true,
          "category": "emergency"
        },
        {
          "gloss": "NEAR",
          "media_url": "https://assets.aslbridge.org/signs/near.mp4",
          "media_type": "video",
          "source": "WLASL",
          "verified": true,
          "category": "descriptors"
        },
        {
          "gloss": "WHERE",
          "media_url": "https://assets.aslbridge.org/signs/where.mp4",
          "media_type": "video",
          "source": "WLASL",
          "verified": true,
          "category": "wh-questions"
        }
      ],
      "missing_vocabulary": [],
      "fingerspelled_tokens": [],
      "confidence": {
        "overall_label": "Verified vocabulary match",
        "vocabulary_coverage": 1.0,
        "retrieval_relevance": 0.94,
        "model_confidence": 0.91,
        "ocr_quality": null,
        "speech_confidence": null
      },
      "retrieval_evidence": ["asl-vocab-hospital", "asl-vocab-near", "asl-grammar-wh-displacement"],
      "processing_method": "rag_grounded_topic_comment",
      "limitations_notice": "Gloss sequence reflects structural ASL ordering; non-manual facial grammatical markers ({q}) must accompany signing.",
      "duration_ms": 42
    }
    ```

### 3.2 Vector Retrieval
- **`POST /ai/retrieve`**
  - **Body**: `{ "query": "doctor", "top_k": 5, "min_score": 0.6 }`
  - **Response**: List of candidate knowledge records with cosine similarity score.

### 3.3 Research Evaluation
- **`POST /ai/evaluate`**
  - **Body**: `{ "dataset": "core_asl_bench_v1", "strategies": ["baseline_lexical", "rule_nlp", "rag_grounded"] }`
  - **Response**: Empirical performance metrics including corpus BLEU-4, chrF++, vocabulary coverage rate, unsupported output rate, and average latency.
