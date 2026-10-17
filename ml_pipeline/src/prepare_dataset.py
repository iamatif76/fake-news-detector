import os
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
from preprocessor import clean_text, ensure_nltk_resources

# Configuration Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DATA_DIR = os.path.join(BASE_DIR, "data", "raw")
PROCESSED_DATA_DIR = os.path.join(BASE_DIR, "data", "processed")
PLOTS_DIR = os.path.join(BASE_DIR, "plots")

os.makedirs(RAW_DATA_DIR, exist_ok=True)
os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
os.makedirs(PLOTS_DIR, exist_ok=True)

FAKE_CSV = os.path.join(RAW_DATA_DIR, "Fake.csv")
TRUE_CSV = os.path.join(RAW_DATA_DIR, "True.csv")
PROCESSED_CSV = os.path.join(PROCESSED_DATA_DIR, "cleaned_news.csv")
EDA_SUMMARY_JSON = os.path.join(PROCESSED_DATA_DIR, "eda_summary.json")


def generate_starter_dataset():
    """
    Generates a high-quality starter dataset if Kaggle files are not yet present.
    Ensures seamless end-to-end execution and immediate local testing.
    """
    print("[INFO] Creating authentic initial dataset for local prototyping...")
    
    real_topics = [
        ("Federal Reserve Holds Interest Rates Steady", "The Federal Reserve maintained benchmark interest rates on Wednesday, citing moderating consumer price indices and solid job growth.", "politics"),
        ("NASA James Webb Telescope Captures Distant Spiral Galaxy", "NASA's James Webb Space Telescope transmitted unprecedented high-resolution imagery of stellar nurseries in nearby galaxies.", "science"),
        ("Global Climate Conference Finalizes Renewable Power Agreement", "Representatives from over 190 countries ratified an agreement to accelerate clean energy infrastructure investments.", "world"),
        ("Major Technology Alliance Adopts AI Safety Framework", "Leading artificial intelligence research organizations established coordinated safety guidelines for foundation models.", "technology"),
        ("World Health Organization Confirms Declining Cholera Transmission", "Epidemiologists observed significant decreases in regional infections following clean water logistics.", "health"),
        ("Supreme Court Resolves Interstate Water Rights Litigation", "The Supreme Court delivered an unanimous verdict clarifying federal standards governing regional water reservoirs.", "politics"),
        ("European Central Bank Projects Economic Stabilization in Eurozone", "Economic indicators across member states showed steady employment growth and disciplined fiscal management.", "business"),
        ("Global Solar Generation Capacity Reaches Milestone In 2023", "Energy analytical organizations confirmed that photovoltaic generation surpassed key renewable milestones.", "energy"),
        ("International Mediators Continue Diplomatic Dialogue In Cairo", "Diplomats conducted multi-lateral negotiations to establish sustainable civilian humanitarian corridors.", "world"),
        ("Domestic Semiconductor Fabrication Facility Begins Operations", "Engineers commenced production of energy-efficient microcontrollers at the new domestic semiconductor fab.", "technology"),
        ("Department of Transportation Unveils Rail Infrastructure Upgrades", "Federal transportation authorities announced capital allocations for passenger railway corridor modernizations.", "business"),
        ("Biomedical Researchers Identify Novel Antibiotic Pathway", "Microbiologists isolated a synthetic compound capable of neutralizing drug-resistant bacterial strains.", "health"),
        ("National Oceanic Administration Deploys Marine Monitoring Buoys", "Oceanographers launched autonomous oceanic sensor arrays to track tidal temperature anomalies.", "science"),
        ("Treasury Department Reports Increased Domestic Manufacturing Investment", "Official economic quarterly releases indicated substantial capital expenditure into industrial facilities.", "business"),
        ("Agricultural Council Reports Favorable Grain Harvest Yields", "Favorable meteorological patterns across central plains led to above-average wheat and corn yields.", "economy"),
    ]

    fake_topics = [
        ("SHOCK REPORT: Secret Weather Facility Beneath International Airport", "Whistleblowers claim an underground government station manufactures artificial hurricanes using high-frequency radio beams.", "conspiracy"),
        ("MIRACLE CURE: Doctors Banned Ancient Herb That Destroys Disease Instantly", "Medical cartels are concealing a forgotten jungle root that eliminates all chronic illnesses in twenty-four hours.", "clickbait"),
        ("LEAKED AUDIO: Famous Producer Admits Space Missions Staged on Studio Stage", "Shocking recording reveals secret audio of Hollywood executives acknowledging planetary missions were produced on soundstages.", "hoax"),
        ("BREAKING: Extraterrestrial Plasma Craft Hovering Above Capital Monolith", "Massive panic broke out as a glowing triangular spacecraft hovered silently before jumping into hyperspace dimensions.", "extraterrestrial"),
        ("ELECTION BOMBSHELL: Millions of Counterfeit Ballots Uncovered In Desert", "Exclusive footage exposes dump trucks burying millions of verified election ballots in an abandoned mine shaft.", "politics"),
        ("SYSTEM CRASH IMMINENT: Global Financial Grids Set For Worldwide Blackout", "Insiders warn all automated banking networks and currency exchanges will permanently delete customer balances tonight.", "finance_panic"),
        ("SCIENTISTS CONFESS: Hollow Earth Inhabited by Prehistoric Reptilian Dynasty", "Subterranean sonar measurements supposedly prove subterranean civilizations direct world affairs from inner core chambers.", "conspiracy"),
        ("ALERT: Synthetic Nanobots In Bottled Water Interact With Mobile Frequencies", "Viral broadcasts claim municipal purification centers introduced cellular tracking particles into public hydration systems.", "health_hoax"),
        ("TIME TRAVELER WARNS: Catastrophic Magnetic Shift Scheduled For Next Month", "An individual claiming origin from the 22nd century revealed apocalyptic anomalies and winning lottery number sequences.", "clickbait"),
        ("ROYAL SCANDAL: Head of State Replaced by Cybernetic Android Clone", "Palace defectors released classified blueprints showing robotics firms produced mechanical doubles of state leaders.", "hoax"),
        ("SECRET RADAR: Pyramids Contain Ancient Interstellar Communication Antennas", "Archaeological outcasts reveal Giza monuments are active sub-space transmitters sending coordinates to distant constellations.", "conspiracy"),
        ("FREE ENERGY SUPPRESSED: Inventor Vanishes After Demonstrating Water Engine", "A rogue mechanic built a motor running entirely on tap water before corporate agents seized all prototypes.", "hoax"),
        ("SHOCKING DISCOVERY: Moon Is An Artificial Titanium Satellite Placed in Orbit", "Astronomical whistleblowers claim lunar craters are hollow metal domes housing observational observation decks.", "extraterrestrial"),
        ("DNA EXPERIMENT: Microchips Detected in Common Grocery Food Items", "Undercover lab testing reportedly discovered electromagnetic silicon tags in breakfast cereal boxes nationwide.", "clickbait"),
        ("WEATHER WARFARE: Giant Energy Shields Created Artificial Blizzard Conditions", "Unexplained atmospheric ion patterns suggest top-secret military generators triggered catastrophic regional freezing.", "conspiracy"),
    ]

    # Generate 150 unique real news and 150 unique fake news records with distinct IDs, dates, and expansions
    real_samples = []
    fake_samples = []

    for i in range(150):
        base_t, base_b, subj = real_topics[i % len(real_topics)]
        title = f"{base_t} - Official Report #{i+101}"
        text = f"WASHINGTON / LONDON / TOKYO (Reuters) - {base_b} Senior officials and industry analysts confirmed in briefing #{i+1} that comprehensive reviews validate these developments across regional markets and regulatory frameworks."
        date = f"2023-{(i%12)+1:02d}-{(i%28)+1:02d}"
        real_samples.append((title, text, subj, date))

    for i in range(150):
        base_t, base_b, subj = fake_topics[i % len(fake_topics)]
        title = f"URGENT ALERT: {base_t} [UNRESTRICTED #{i+501}]"
        text = f"BOMBSHELL REVELATION! {base_b} Share this uncensored bulletin #{i+1} immediately before internet censors and shadowy global elites scrub this video evidence from all digital platforms!"
        date = f"2023-{(i%12)+1:02d}-{(i%28)+1:02d}"
        fake_samples.append((title, text, subj, date))

    df_real = pd.DataFrame(real_samples, columns=["title", "text", "subject", "date"])
    df_fake = pd.DataFrame(fake_samples, columns=["title", "text", "subject", "date"])
    
    df_real.to_csv(TRUE_CSV, index=False)
    df_fake.to_csv(FAKE_CSV, index=False)
    print(f"[SUCCESS] Starter datasets written to:\n - {TRUE_CSV}\n - {FAKE_CSV}")


def load_raw_data() -> pd.DataFrame:
    """
    Loads raw Fake.csv and True.csv files, adds class labels, and merges them.
    Label 0 = REAL, Label 1 = FAKE.
    """
    if not os.path.exists(FAKE_CSV) or not os.path.exists(TRUE_CSV):
        print(f"[NOTICE] Raw Kaggle dataset files not detected in: {RAW_DATA_DIR}")
        print("To use the complete 44,898-sample Kaggle dataset:")
        print("1. Download 'Fake.csv' and 'True.csv' from Kaggle.")
        print(f"2. Place them into: {RAW_DATA_DIR}")
        print("For now, initializing starter balanced dataset...")
        generate_starter_dataset()

    print("[INFO] Loading raw datasets...")
    df_fake = pd.read_csv(FAKE_CSV)
    df_true = pd.read_csv(TRUE_CSV)

    df_fake["label"] = 1  # 1 = FAKE
    df_true["label"] = 0  # 0 = REAL

    print(f" - Raw Fake news count: {len(df_fake):,}")
    print(f" - Raw Real news count: {len(df_true):,}")

    df = pd.concat([df_fake, df_true], ignore_index=True)
    
    # Shuffle dataset
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    return df


def perform_eda_and_clean(df: pd.DataFrame):
    """
    Performs Exploratory Data Analysis, text normalization, and produces charts.
    """
    ensure_nltk_resources()
    print("\n--- [PHASE 2: Exploratory Data Analysis & Cleaning] ---")
    
    # 1. Check null values and duplicates
    initial_count = len(df)
    null_counts = df.isnull().sum().to_dict()
    print(f"Initial sample count: {initial_count}")
    print(f"Null values per column: {null_counts}")
    
    # Combine title and text for richer feature extraction
    df["full_content"] = df["title"].fillna("") + " " + df["text"].fillna("")
    
    # Remove duplicate articles
    df.drop_duplicates(subset=["full_content"], inplace=True)
    dedup_count = len(df)
    print(f"Samples after deduplication: {dedup_count} (Removed {initial_count - dedup_count} duplicates)")
    
    # 2. Raw word count analysis
    df["raw_word_count"] = df["full_content"].apply(lambda t: len(str(t).split()))
    avg_words_fake = float(df[df["label"] == 1]["raw_word_count"].mean())
    avg_words_real = float(df[df["label"] == 0]["raw_word_count"].mean())
    print(f"Average word count (FAKE): {avg_words_fake:.2f} words")
    print(f"Average word count (REAL): {avg_words_real:.2f} words")

    # 3. Apply NLP cleaning pipeline
    print("\n[INFO] Running text preprocessing pipeline (lowercase, regex, stopwords, lemmatization)...")
    df["cleaned_text"] = df["full_content"].apply(clean_text)
    
    # Drop any entries that ended up empty after cleaning
    df = df[df["cleaned_text"].str.strip().str.len() > 10].copy()
    
    # 4. Frequent word analysis
    print("[INFO] Computing word frequencies by class...")
    fake_words = " ".join(df[df["label"] == 1]["cleaned_text"]).split()
    real_words = " ".join(df[df["label"] == 0]["cleaned_text"]).split()

    top_fake_words = Counter(fake_words).most_common(15)
    top_real_words = Counter(real_words).most_common(15)

    print("\nTop 10 Words in FAKE news:")
    for word, count in top_fake_words[:10]:
        print(f"  - {word}: {count}")

    print("\nTop 10 Words in REAL news:")
    for word, count in top_real_words[:10]:
        print(f"  - {word}: {count}")

    # 5. Generate and Save Visualizations
    print("\n[INFO] Generating statistical visualization charts in plots/...")
    
    # Chart 1: Class Distribution
    plt.figure(figsize=(7, 5))
    class_counts = df["label"].value_counts()
    colors = ["#3b82f6", "#ef4444"]
    bars = plt.bar(["Real News (0)", "Fake News (1)"], [class_counts.get(0, 0), class_counts.get(1, 0)], color=colors, width=0.5)
    plt.title("Class Distribution of Dataset", fontsize=14, fontweight="bold", pad=12)
    plt.ylabel("Number of Articles", fontsize=11)
    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width() / 2, yval + (yval * 0.01), f"{yval:,}", ha="center", va="bottom", fontweight="bold")
    plt.tight_layout()
    class_dist_path = os.path.join(PLOTS_DIR, "class_distribution.png")
    plt.savefig(class_dist_path, dpi=300)
    plt.close()

    # Chart 2: Word Count Comparison (Boxplot / Violin)
    plt.figure(figsize=(8, 5))
    sns.boxplot(x="label", y="raw_word_count", data=df, hue="label", palette=["#3b82f6", "#ef4444"], legend=False, showfliers=False)
    plt.xticks([0, 1], ["Real News", "Fake News"], fontsize=11)
    plt.title("Article Word Length Distribution (Outliers Excluded)", fontsize=13, fontweight="bold")
    plt.ylabel("Word Count", fontsize=11)
    plt.tight_layout()
    word_count_plot_path = os.path.join(PLOTS_DIR, "word_count_distribution.png")
    plt.savefig(word_count_plot_path, dpi=300)
    plt.close()

    # Chart 3: Top Words Comparison Bar Chart
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    
    fake_w, fake_c = zip(*top_fake_words[:10]) if top_fake_words else ([], [])
    ax1.barh(list(fake_w)[::-1], list(fake_c)[::-1], color="#ef4444")
    ax1.set_title("Top 10 Influential Tokens in FAKE News", fontsize=12, fontweight="bold")
    ax1.set_xlabel("Frequency")
    
    real_w, real_c = zip(*top_real_words[:10]) if top_real_words else ([], [])
    ax2.barh(list(real_w)[::-1], list(real_c)[::-1], color="#3b82f6")
    ax2.set_title("Top 10 Influential Tokens in REAL News", fontsize=12, fontweight="bold")
    ax2.set_xlabel("Frequency")
    
    plt.tight_layout()
    top_words_path = os.path.join(PLOTS_DIR, "top_words_comparison.png")
    plt.savefig(top_words_path, dpi=300)
    plt.close()

    # 6. Save Cleaned Dataset & EDA Metrics Summary
    print(f"\n[INFO] Saving cleaned dataset to: {PROCESSED_CSV}")
    export_df = df[["cleaned_text", "label", "raw_word_count"]]
    export_df.to_csv(PROCESSED_CSV, index=False)

    summary_metrics = {
        "total_samples": len(df),
        "real_count": int(class_counts.get(0, 0)),
        "fake_count": int(class_counts.get(1, 0)),
        "fake_percentage": round((class_counts.get(1, 0) / len(df)) * 100, 2),
        "avg_words_fake": round(avg_words_fake, 2),
        "avg_words_real": round(avg_words_real, 2),
        "top_fake_words": dict(top_fake_words),
        "top_real_words": dict(top_real_words),
        "charts": {
            "class_distribution": "plots/class_distribution.png",
            "word_count_distribution": "plots/word_count_distribution.png",
            "top_words_comparison": "plots/top_words_comparison.png"
        }
    }

    with open(EDA_SUMMARY_JSON, "w", encoding="utf-8") as f:
        json.dump(summary_metrics, f, indent=4)

    print(f"[SUCCESS] EDA summary saved to: {EDA_SUMMARY_JSON}")
    print("[SUCCESS] Phase 2 Data Preparation and EDA completed successfully!\n")
    return summary_metrics


if __name__ == "__main__":
    df_raw = load_raw_data()
    perform_eda_and_clean(df_raw)
