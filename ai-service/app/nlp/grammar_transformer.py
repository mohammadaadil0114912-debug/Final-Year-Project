import re
from typing import List, Dict, Any, Tuple, Optional


class ASLGrammarTransformer:
    def __init__(self):
        self.wh_words = {"who", "what", "where", "when", "why", "which", "how"}
        self.copulas = {"is", "am", "are", "was", "were", "be", "being", "been"}
        self.articles = {"a", "an", "the"}
        self.auxiliary_do = {"do", "does", "did"}
        self.negation_words = {"not", "no", "never", "none", "nothing", "nowhere", "cannot", "can't", "don't", "doesn't", "didn't", "won't"}
        self.temporal_markers = {
            "yesterday", "today", "tomorrow", "now", "later", "before", "past", "future",
            "morning", "afternoon", "night", "tonight", "always"
        }
        self.pronoun_map = {
            "i": "I", "me": "ME", "my": "MY", "mine": "MINE",
            "you": "YOU", "your": "YOUR", "yours": "YOURS",
            "he": "HE", "she": "SHE", "it": "IT", "him": "HE", "her": "SHE", "his": "HIS",
            "we": "WE", "us": "US", "our": "OUR", "ours": "OURS",
            "they": "THEY", "them": "THEY", "their": "THEIR"
        }
        self.contraction_map = {
            "what's": "what is",
            "where's": "where is",
            "how's": "how is",
            "who's": "who is",
            "can't": "can not",
            "don't": "do not",
            "doesn't": "does not",
            "didn't": "did not",
            "won't": "will not",
            "i'm": "i am",
            "you're": "you are",
            "we're": "we are",
            "they're": "they are",
            "it's": "it is",
            "i've": "i have",
            "you've": "you have"
        }

    def normalize(self, text: str) -> str:
        text = text.strip().lower()
        for cont, full in self.contraction_map.items():
            text = re.sub(r'\b' + re.escape(cont) + r'\b', full, text)
        return text

    def tokenize(self, text: str) -> List[str]:
        # Strip extraneous punctuation so tokens don't have attached ? or .
        cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        tokens = [t.strip() for t in cleaned.split() if t.strip()]
        return tokens

    def analyze_sentence(self, text: str) -> Dict[str, Any]:
        normalized = self.normalize(text)
        is_question = "?" in text or any(normalized.startswith(q) for q in self.wh_words) or any(normalized.startswith(a) for a in ["is", "are", "do", "does", "did", "can", "will"])
        tokens = self.tokenize(normalized)

        has_wh = any(t in self.wh_words for t in tokens)
        has_negation = any(t in self.negation_words for t in tokens)
        temporal_tokens = [t for t in tokens if t in self.temporal_markers]
        
        return {
            "normalized": normalized,
            "tokens": tokens,
            "is_question": is_question,
            "is_wh_question": is_question and has_wh,
            "is_polar_question": is_question and not has_wh,
            "has_negation": has_negation,
            "temporal_tokens": temporal_tokens
        }

    def transform_to_asl_gloss(self, text: str) -> Tuple[str, List[str], List[str]]:
        """
        Applies ASL linguistic syntax transformations:
        1. Time fronting (TIME-TOPIC-COMMENT)
        2. Copula and article deletion
        3. WH-word terminal movement with {q}
        4. Negation placement with {neg}
        5. Polar question marking {yn_q}
        Returns: (asl_gloss_string, tokens_used, extracted_keywords)
        """
        analysis = self.analyze_sentence(text)
        tokens = analysis["tokens"]
        
        if not tokens:
            return "", [], []

        # Step 1: Identify structural components
        wh_found = []
        time_found = []
        neg_found = []
        content_tokens = []
        keywords = []

        for t in tokens:
            if t in self.articles:
                continue
            if t in self.copulas:
                continue
            if t in self.auxiliary_do:
                continue
            if t in self.wh_words:
                wh_found.append(t.upper())
                continue
            if t in self.temporal_markers:
                time_found.append(t.upper())
                continue
            if t in self.negation_words:
                neg_found.append("NOT")
                continue
            
            # Map pronouns or keep content word
            mapped = self.pronoun_map.get(t, t.upper())
            content_tokens.append(mapped)
            if t not in self.pronoun_map and len(t) > 2:
                keywords.append(t.upper())

        # Step 2: Assemble ASL syntactic structure
        # Standard ASL structure: [TIME] [TOPIC] [COMMENT / VERB] [NEGATION] [WH-WORD] [NMS-MARKER]
        asl_sequence = []

        # 1. TIME fronting
        if time_found:
            asl_sequence.extend(time_found)

        # 2. Topic-Comment heuristic:
        # If formulaic greeting like "hello" / "please" / "thank you", place greeting first
        greetings = {"HELLO", "PLEASE", "THANK-YOU", "THANK", "SORRY"}
        front_greetings = [c for c in content_tokens if c in greetings]
        remaining = [c for c in content_tokens if c not in greetings]

        if front_greetings:
            asl_sequence.extend(front_greetings)

        # 3. Content tokens (Subject / Object / Verb)
        asl_sequence.extend(remaining)

        # 4. Negation attached to predicate
        if neg_found:
            asl_sequence.append("NOT")
            asl_sequence.append("{neg}")
        elif analysis["has_negation"] and "{neg}" not in asl_sequence:
            asl_sequence.append("NOT")
            asl_sequence.append("{neg}")

        # 5. WH-words moved to terminal position
        if wh_found:
            asl_sequence.extend(wh_found)
            asl_sequence.append("{q}")
        elif analysis["is_polar_question"]:
            asl_sequence.append("{yn_q}")

        gloss_result = " ".join(asl_sequence)
        return gloss_result, asl_sequence, keywords


grammar_transformer = ASLGrammarTransformer()
