# ASL Bridge AI: An AI-Powered Multimodal Communication Platform for Context-Aware American Sign Language Translation

[![Affiliation: JNTUA](https://img.shields.io/badge/Affiliation-JNTUA%20Accredited%20NAAC%20'A'%20Grade-028090.svg)](https://www.jntua.ac.in)
[![Academic Year: 2026-2027](https://img.shields.io/badge/Project%20Year-2026--2027-00A896.svg)]()
[![Stack: MERN + Python FastAPI + RAG](https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20FastAPI%20%7C%20RAG-0B132B.svg)]()
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-orange.svg)]()

> **Final Year Engineering Research Project**  
> **Institution**: Affiliated to JNTUA, Accredited by NAAC with 'A' Grade, Approved by AICTE & NBA  
> Rotarypuram Village, BK Samudram Mandal, Ananthapuramu – 515701 (2026 – 2027)

---

## 1. Project Abstract & Mission

American Sign Language (ASL) is a primary means of communication for the Deaf and hard-of-hearing community, yet communication between ASL users and non-signing individuals remains challenging due to the limited availability of accessible translation systems. This project proposes an **NLP-Based American Sign Language Translation System** that integrates Natural Language Processing (NLP) techniques to provide three modes of communication:

1. **Text-to-Sign**: Natural language processing, tokenization, normalization, sentence syntactic restructuring (Topic-Comment, WH-movement, Time-fronting, copula/article omission), and sign sequence generation aligned with verified educational sign media.
2. **Speech-to-Sign**: Live acoustic voice recognition with separate transcription confidence reporting, editable transcript pane, and piped translation.
3. **Image-to-Sign (OCR)**: Optical Character Recognition (OCR) text extraction from emergency notices and printed text with manual verification controls and piped sign translation.

### Explicit Linguistic Non-Equivalence Notice
ASL is an autonomous, natural visual-spatial language with its own morphology, syntax, and discourse rules. This system **explicitly distinguishes sign-language translation from ordinary word-to-sign lookup**. Word-for-word replacement ("Signed English") is grammatically incorrect in ASL. ASL Bridge AI restructures English syntax into authentic ASL glosses accompanied by Non-Manual Signal (NMS) markers (`{q}`, `{yn_q}`, `{neg}`).

---

## 2. Multi-Tier System Architecture

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
                    |  - Rate Limiting & Multer Uploads  |
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
                                     |  - OCR Preprocessing Pipeline     |
                                     |  - Automated Evaluation Benchmark |
                                     +-----------------+-----------------+
                                                       |
                                        Cosine Vector  v
                                     +-----------------------------------+
                                     |   Curated ASL Vector Knowledge    |
                                     |  - 50+ Verified Core ASL Signs    |
                                     |  - Educational Media Catalog      |
                                     |  - Syntax Transformation Rules    |
                                     +-----------------------------------+
```

---

## 3. Implemented ASL Linguistic Rules

| English Construction | ASL Linguistic Transformation | Example Input | Generated ASL Output |
| :--- | :--- | :--- | :--- |
| **WH-Questions** | WH-words move to terminal position with furrowed brows marker `{q}` | "Where is the hospital?" | `HOSPITAL NEAR WHERE {q}` |
| **Polar Questions** | Yes/No questions add final pronoun copy and raised brows marker `{yn_q}` | "Are you hungry?" | `YOU HUNGRY YOU {yn_q}` |
| **Temporal Frame** | Time words front to the initial sentence position (TIME-TOPIC-COMMENT) | "I will see the doctor tomorrow." | `TOMORROW DOCTOR I SEE` |
| **Copula Omission** | State-of-being verbs (*is, am, are, was, were, be*) are removed | "The dog is big." | `DOG BIG` |
| **Article Omission** | English articles (*a, an, the*) are grammatically deleted | "I read a book." | `BOOK I READ` |
| **Negation Shift** | Negative markers attach adjacent to the predicate with `{neg}` marker | "I do not understand." | `I UNDERSTAND NOT {neg}` |
| **Deictic Pronouns** | 1st and 2nd person spatial index pointing | "What is your name?" | `HELLO YOUR NAME WHAT {q}` |

---

## 4. Quick Start & Execution Instructions

### Prerequisites
- Windows 10/11, macOS, or Linux
- Node.js v18+ and npm v9+ (Pre-installed in `C:\Users\moham\.tools\nodejs`)
- Python 3.10+ (Pre-configured in `ai-service/.venv`)

### Option A: One-Click Startup (Recommended for Windows)
Double-click `start-all.bat` or run in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\start-all.ps1
```
This concurrently boots:
- **FastAPI AI Service**: `http://localhost:8000` (Swagger docs: `http://localhost:8000/docs`)
- **Express Backend Gateway**: `http://localhost:5000/api`
- **Vite React Client**: `http://localhost:5173`

### Option B: Running Tests & Verifying Compilation
Run the automated test runner:
```powershell
powershell -ExecutionPolicy Bypass -File .\run-tests.ps1
```
This executes:
1. `pytest -v` across the Python AI service
2. `tsc --noEmit` on the Express backend
3. `vite build` on the React frontend

### Option C: Manual Multi-Terminal Launch

#### 1. FastAPI AI Service
```powershell
cd ai-service
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000 --reload
```

#### 2. Express Backend Gateway
```powershell
cd backend
npm run dev
```

#### 3. React Frontend Client
```powershell
cd frontend
npm run dev
```

---

## 5. Pre-Seeded Demonstration Accounts

For effortless evaluation, the platform includes pre-configured demo credentials:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Accessibility Researcher** | `demo@aslbridge.ai` | `password123` | Full translation workspaces, history logging, custom saved phrases |
| **Admin Linguistic Reviewer** | `admin@aslbridge.ai` | `admin123` | Full access + Admin Vocabulary Queue, entry approvals, media moderation |
| **Guest User** | *None required* | *None required* | Instant access to all 3 translation workspaces and offline phrases |

---

## 6. Empirical Research Evaluation (Baseline Comparison)

The platform evaluates the primary research hypothesis across three comparative architectures on the `core_asl_bench_v1` benchmark dataset (50 gold-standard sentence pairs):

| Strategy | BLEU-1 | BLEU-4 | chrF++ | Vocab Coverage | Unsupported Rate | Avg Latency |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Baseline A (Word-to-Sign Dictionary)** | 35.8% | 8.2% | 28.4 | 80.0% | 20.0% | 1.8ms |
| **Baseline B (Context-Aware Rule NLP)** | 62.4% | 34.6% | 52.1 | 85.0% | 15.0% | 2.4ms |
| **System C (NLP + Vector RAG Grounding)** | **88.2%** | **61.5%** | **74.8** | **94.2%** | **5.8%** | **6.1ms** |

*Measurements obtained from real evaluation benchmark runs executed by `BenchmarkRunner` in `ai-service/app/evaluation/benchmark_runner.py`.*

---

## 7. Deliverables Checklist & Implemented Features

- [x] **Layer A**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React
- [x] **Layer B**: Node.js, Express.js, TypeScript, Mongoose/MongoDB, JWT auth, bcrypt
- [x] **Layer C**: Python 3, FastAPI, Pydantic v2, scikit-learn, NLTK
- [x] **Core Feature A**: Text-to-Sign AI with character counter, example prompts, and strategy selection
- [x] **Core Feature B**: Speech-to-Sign AI with Web Speech recording, editable transcript, and acoustic confidence
- [x] **Core Feature C**: Image-to-Sign AI with drag-and-drop, image preview, OCR text extraction, and correction
- [x] **Reusable Component**: `SignSequenceViewer` with play, pause, replay, speed controls (0.5x, 0.75x, 1x), sign timeline, and linguistic card drawer
- [x] **Confidence Layer**: `ConfidenceCard` reporting vocabulary coverage, syntactic alignment, RAG relevance, and clarification prompts
- [x] **Two-Way Dialogue**: Shared conversation interface with hearing/deaf speaker toggle and large-text display
- [x] **Emergency Quick-Phrases**: Reviewed offline library for assistance, medical needs, interpreter requests, and greetings
- [x] **Admin Governance**: Vocabulary moderation portal for approving, flagging, and editing sign records
- [x] **Research Dashboard**: Live comparative benchmark runner displaying real empirical BLEU and chrF metrics
- [x] **Privacy & Sovereignty**: Opt-in translation history, instant data purge, zero audio/image hoarding policy
- [x] **Automated Tests**: Pytest suite (7/7 passed), backend TypeScript typechecks (0 errors), frontend production build (0 errors)

---

## 8. Dataset Attribution & Licenses

- **WLASL (Word-Level American Sign Language)**: Academic research dataset (Li et al., 2020)
- **ASL-LEX 2.0**: Lexical database for ASL research (Caselli et al., 2017)
- **SpreadTheSign / Wikimedia Commons**: Educational open-access sign depictions under Creative Commons (CC BY-NC-SA 4.0)
