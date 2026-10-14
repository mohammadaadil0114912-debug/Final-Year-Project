# ASL Bridge AI: Dataset Provenance, Grammar Specification & Licensing

## 1. Linguistic Distinction: English vs. American Sign Language (ASL)
American Sign Language is a distinct, natural language with its own morphology, syntax, and discourse properties. It is **not** a manual code for English, nor is it a word-for-word replacement.

### Core ASL Linguistic Rules Implemented in ASL Bridge AI:
1. **Topic-Comment (T-C) Sentence Structure**:
   - In English: "I like ice cream." (SVO)
   - In ASL: `ICE-CREAM [Topic], I LIKE [Comment]`
2. **Time-Topic-Comment (T-S-V-O)**:
   - Time signs establish the temporal frame at the very beginning of the utterance.
   - In English: "I went to school yesterday."
   - In ASL: `YESTERDAY SCHOOL I GO`
3. **Question Transformations (WH-Questions & Yes/No Questions)**:
   - In ASL, WH-words (WHO, WHAT, WHERE, WHEN, WHY, HOW) typically move to the end of the sentence accompanied by non-manual signals (furrowed brows, head tilt).
   - In English: "Where is the library?"
   - In ASL: `LIBRARY WHERE {q}`
   - Yes/No questions feature raised eyebrows and head tilted forward: `YOU STUDENT YOU {yn_q}`
4. **Omission of English Functional Elements**:
   - Copula verbs ("is", "are", "am", "was", "were", "be") do not exist in ASL syntax.
   - English articles ("the", "a", "an") and prepositions that are incorporated into directional verbs are omitted.
   - In English: "The dog is big."
   - In ASL: `DOG BIG`
5. **Negation Movement**:
   - Negative markers (`NOT`, `NONE`, `NEVER`) accompany headshake and appear adjacent to the predicate.
   - In English: "I don't have money."
   - In ASL: `MONEY I NONE {neg}`
6. **Directional & Spatial Verbs**:
   - Verbs such as `GIVE`, `HELP`, `TELL`, `SHOW` move between spatial loci representing Subject and Object (`1p-GIVE-2p` = "I give you").
7. **Finger-Spelling (FS)**:
   - Used for proper nouns, personal names, acronyms, and technical terms lacking dedicated lexical signs (`FS:JOHN`, `FS:IBM`).

## 2. Dataset Attribution & Provenance
The vocabulary and reference media in this system adhere to educational accessibility licenses:
- **ASL-LEX 2.0**: Caselli, N., Sehyr, Z. S., Cohen-Goldberg, A. M., & Emmorey, K. (2017). ASL-LEX: A lexical database for American Sign Language. Open educational resource for linguistic research.
- **WLASL (Word-Level American Sign Language)**: Li, D. et al. (2020). Word-level Deep Sign Language Recognition from Video. Open academic dataset for sign language recognition research.
- **SignBank & Open Educational Sign Resources**: Curated educational sign depictions under Creative Commons licenses (CC BY-NC-SA 4.0).
- **Verified Native Deaf Sign Media**: Media items have been cataloged with verifiable source URLs, lexical glosses, category labels, and manual validation status.

## 3. Ethical Declarations & Research Integrity
- **No Fabricated Data**: This project does not invent synthetic hand poses or label random gesture images as authentic ASL.
- **Transparent Approximation Labels**: The system explicitly identifies whether an output is an approved grammatical translation, a lexical vocabulary match, a fingerspelled fallback, or an unsupported item.
- **Deaf Community Centered**: Language tools must respect Deaf culture and recognize that automated tools provide communication *assistance*, not a replacement for qualified human ASL interpreters in critical legal, medical, or life-safety settings.
