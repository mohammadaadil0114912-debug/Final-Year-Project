# System Architecture Specification

## 1. Executive Summary
ASL Bridge AI is a multimodal, context-aware communication and accessibility platform designed to translate English text, spoken voice, and image-based text into verified American Sign Language (ASL) representations. The system explicitly decouples English vocabulary lookup from ASL grammatical translation, providing transparent metrics, retrieval-augmented grounding (RAG), and non-manual signal annotations.

```
                    +------------------------------------+
                    |        Client Application          |
                    |   (React 18, Vite, Tailwind CSS,    |
                    |    Lucide Icons, Framer Motion)    |
                    +-----------------+------------------+
                                      |
                     REST (JSON) /    |  Web Speech API /
                     Multipart Form   |  Blob Uploads
                                      v
                    +------------------------------------+
                    |       Application Gateway          |
                    |      (Node.js / Express.js)        |
                    |  - Authentication (JWT & bcrypt)   |
                    |  - Translation History Logging     |
                    |  - Saved Phrases & Vocabulary CRUD |
                    |  - Rate Limiting & Validation      |
                    +--------+------------------+--------+
                             |                  |
                    Mongoose |                  | Internal REST
                    Queries  v                  v HTTP Calls
               +---------------+     +-----------------------------------+
               |    MongoDB    |     |          AI / NLP Service         |
               |  (Persistent  |     |         (Python / FastAPI)        |
               |  App Storage) |     |  - Sentence Segmentation & POS    |
               +---------------+     |  - Topic-Comment & WH-movement    |
                                     |  - Vector RAG Knowledge Retrieval |
                                     |  - Sign Asset Catalog Grounding   |
                                     |  - OCR Preprocessing (OpenCV)     |
                                     |  - Translation Evaluation Suite   |
                                     +-----------------+-----------------+
                                                       |
                                        Cosine Vector  v
                                     +-----------------------------------+
                                     |   Curated ASL Vector Knowledge    |
                                     |  - 300+ Verified Core ASL Signs   |
                                     |  - Educational Media Catalog      |
                                     |  - Syntax Transformation Rules    |
                                     +-----------------------------------+
```

## 2. Component Specifications

### 2.1 Layer A: React 18 Frontend
- **Framework**: React 18 with TypeScript and Vite.
- **Styling**: Tailwind CSS configured with an accessibility-first color scheme (deep navy `#0B132B`, rich teal `#00A896`, cyan `#028090`, and high-contrast light backgrounds `#F8FAFC`).
- **State Management**: TanStack Query (React Query) for asynchronous server-state caching, invalidation, and optimistic updates; React Context for global auth and accessibility preferences (contrast mode, large text, reduced motion).
- **Iconography**: Lucide React.
- **Media Renderer (`SignSequenceViewer`)**: Interactive timeline displaying ordered sign cards with video/GIF playback, playback speed toggles (0.5x, 0.75x, 1x), step-by-step navigation, and fallback finger-spelling for unmatched terms.

### 2.2 Layer B: Express.js Backend Gateway
- **Runtime**: Node.js with TypeScript (`tsx` / `tsc`).
- **Security**: Strict JWT authorization (`Bearer <token>`), bcrypt password hashing (cost factor 10), Helmet headers, CORS policies, express-rate-limit.
- **Proxy Adapter**: Forwards translation requests to FastAPI, logs user history when consented, and enriches responses with user favorites status.
- **Administrative Endpoints**: Protected routes for vocabulary reviewers to audit, approve, flag, or update sign records and media URLs.

### 2.3 Layer C: FastAPI AI & NLP Service
- **Framework**: Python 3 with FastAPI and Pydantic v2 schemas.
- **Syntactic-Semantic Analyzer**: Rule-based & dependency parsing transformations applying ASL grammar principles:
  - TIME fronting (e.g., `YESTERDAY`, `TODAY`, `TOMORROW`).
  - Topic-Comment restructuring (Object fronting for emphasis).
  - WH-word displacement to the terminal clause position.
  - Omission of English copulas (`is`, `am`, `are`, `was`, `were`) and articles (`a`, `an`, `the`).
  - Negation affixation (`NOT`, `NONE`) at the verbal phrase boundary.
  - Non-manual signal tags: `{q}` (WH-question), `{yn_q}` (Yes/No question), `{neg}` (headshake).
- **RAG & Vector Retrieval**: Embedding calculation and semantic similarity matching against the curated ASL knowledge base to identify idiom equivalents, synonym glosses, and verified video assets.
- **OCR Engine**: Grayscale conversion, Otsu thresholding, contrast enhancement, and character extraction with fallback heuristics.
- **Evaluation Engine**: Automated comparative assessment (Baseline A Lexical vs Baseline B Rule-based vs System C RAG-Grounded) computing BLEU, chrF, lexical coverage, and unsupported token rates.
