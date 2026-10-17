import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Ensure required NLTK resources are available
def ensure_nltk_resources():
    """Download required NLTK data resources if not already present."""
    resources = ['stopwords', 'wordnet', 'omw-1.4', 'punkt', 'punkt_tab']
    for res in resources:
        try:
            nltk.download(res, quiet=True)
        except Exception as e:
            print(f"[Warning] Could not download NLTK resource '{res}': {e}")

# Initialize resources
ensure_nltk_resources()

try:
    STOPWORDS = set(stopwords.words('english'))
except Exception:
    STOPWORDS = set([
        "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your",
        "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she",
        "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
        "theirs", "themselves", "what", "which", "who", "whom", "this", "that",
        "these", "those", "am", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
        "the", "and", "but", "if", "or", "because", "as", "until", "while", "of",
        "at", "by", "for", "with", "about", "against", "between", "into", "through",
        "during", "before", "after", "above", "below", "to", "from", "up", "down",
        "in", "out", "on", "off", "over", "under", "again", "further", "then", "once"
    ])

try:
    LEMMATIZER = WordNetLemmatizer()
except Exception:
    LEMMATIZER = None


def clean_text(text: str, apply_lemmatization: bool = True) -> str:
    """
    Standardizes and cleans input news text for NLP feature extraction.
    
    Processing Steps:
    1. Null / type check
    2. Convert to lowercase
    3. Remove URLs & web addresses
    4. Remove HTML tags
    5. Remove punctuation and special symbols
    6. Remove numeric digits (optional for news content)
    7. Remove stopwords
    8. Apply WordNet lemmatization
    9. Collapse redundant whitespace
    
    Args:
        text (str): Raw article headline or content.
        apply_lemmatization (bool): Whether to reduce words to root lemma form.
        
    Returns:
        str: Fully normalized and cleaned text string.
    """
    if not isinstance(text, str) or not text.strip():
        return ""
    
    # 1. Lowercase
    text = text.lower()
    
    # 2. Remove URLs (http, https, www)
    text = re.sub(r"https?://\S+|www\.\S+", "", text)
    
    # 3. Remove HTML tags
    text = re.sub(r"<.*?>", "", text)
    
    # 4. Remove bracketed noise (e.g. [Reuters], (CNN))
    text = re.sub(r"\[.*?\]|\(.*?\)", "", text)
    
    # 5. Remove punctuation
    text = text.translate(str.maketrans("", "", string.punctuation))
    
    # 6. Remove digits and non-alphanumeric noise
    text = re.sub(r"\d+", "", text)
    
    # 7. Tokenize by whitespace
    tokens = text.split()
    
    # 8. Remove stopwords & short single-letter noise
    cleaned_tokens = [w for w in tokens if w not in STOPWORDS and len(w) > 2]
    
    # 9. Lemmatization
    if apply_lemmatization and LEMMATIZER is not None:
        try:
            cleaned_tokens = [LEMMATIZER.lemmatize(w) for w in cleaned_tokens]
        except Exception:
            pass
            
    return " ".join(cleaned_tokens)
