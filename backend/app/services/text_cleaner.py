import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Pre-download required NLTK corpora
for resource in ['stopwords', 'wordnet', 'omw-1.4']:
    try:
        nltk.download(resource, quiet=True)
    except Exception:
        pass

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


def preprocess_text(text: str) -> str:
    """
    Cleans and standardizes raw input text before TF-IDF vectorization.
    """
    if not isinstance(text, str) or not text.strip():
        return ""

    # 1. Lowercase
    text = text.lower()
    
    # 2. Remove URLs
    text = re.sub(r"https?://\S+|www\.\S+", "", text)
    
    # 3. Remove HTML tags
    text = re.sub(r"<.*?>", "", text)
    
    # 4. Remove brackets and metadata
    text = re.sub(r"\[.*?\]|\(.*?\)", "", text)
    
    # 5. Remove punctuation
    text = text.translate(str.maketrans("", "", string.punctuation))
    
    # 6. Remove numeric digits
    text = re.sub(r"\d+", "", text)
    
    # 7. Split tokens
    tokens = text.split()
    
    # 8. Stopword removal
    cleaned_tokens = [w for w in tokens if w not in STOPWORDS and len(w) > 2]
    
    # 9. Lemmatization
    if LEMMATIZER is not None:
        try:
            cleaned_tokens = [LEMMATIZER.lemmatize(w) for w in cleaned_tokens]
        except Exception:
            pass

    return " ".join(cleaned_tokens)
