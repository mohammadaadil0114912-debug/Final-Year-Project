# System Limitations & Linguistic Scope

## 1. Non-Equivalence Notice: ASL is Not Coded English
American Sign Language is an autonomous, natural visual-spatial language with its own morphological rules, phonology (handshape, orientation, location, movement, non-manual markers), and syntax (Topic-Comment, classifier predicates, spatial reference frames).

**Crucial System Boundaries**:
1. **Gloss is an Approximation**: ASL gloss sequences written in English capital letters (e.g., `MEET YOU GLAD {nod}`) are transcription notations developed by linguists to describe sign occurrences. Gloss sequences do not capture the continuous, parallel, visual-spatial nuance of real-time sign language.
2. **Sequential Media is Not Co-articulated Signing**: Displaying a series of discrete sign videos or GIFs sequentially provides an educational and communication *aid*. It does not emulate natural human co-articulation, transitional hand trajectories, or spatial indexing.
3. **Non-Manual Signals (NMS)**: Facial expressions, head tilts, mouth morphemes, and shoulder shifts constitute grammatical elements in ASL (e.g., furrowing brows for WH-questions, raising eyebrows for polar questions). While our NLP pipeline outputs `{q}`, `{yn_q}`, and `{neg}` tags, static 2D media without animated avatars cannot fully represent facial inflection.
4. **Vocabulary Coverage**: No automated dictionary contains every regional variation or slang sign. When a term is absent from the verified database, the system honestly falls back to fingerspelling (`FS:NAME`) or labels the token as an unsupported vocabulary approximation.

## 2. Modal Limitations

### Text-to-Sign
- **Idiomatic Metaphors**: English idioms (e.g., "barking up the wrong tree", "hit the nail on the head") cannot be literally signed. The RAG pipeline matches known idioms to conceptual ASL signs (e.g., `MISTAKE`, `ACCURATE`), but uncataloged idioms default to literal gloss approximations.
- **Directional Verb Agreement**: Highly spatial verbs require 3D loci that 2D video sequences approximate through canonical citation forms.

### Speech-to-Sign
- **Acoustic Noise & Accents**: Ambient noise or non-standard accents may reduce speech recognition accuracy. The system reports separate transcription confidence scores and allows users to manually review and edit the transcript prior to translation.
- **Homophones**: Ambiguous spoken words ("their", "there", "they're") rely on contextual POS resolution.

### Image-to-Sign (OCR)
- **Text Inside Images Only**: This module processes text extracted from receipts, emergency notices, signs, and documents. It does **not** recognize human signers from arbitrary photos or attempt to classify gestures from static photographs.
- **Image Resolution & Artifacts**: Low contrast, cursive script, and distorted angles degrade OCR extraction. The user is provided with an editable text verification pane.

## 3. High-Stakes Usage Warning
This software is an engineering research prototype designed to assist everyday communication and educational accessibility. **It must not be used as a replacement for certified human ASL interpreters in medical emergencies, courtrooms, psychiatric evaluations, or legal proceedings.**
