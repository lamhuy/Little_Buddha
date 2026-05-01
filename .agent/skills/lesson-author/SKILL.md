---
name: lesson-author
description: >
  Develop Buddhist lessons for Little Buddha across three age tiers (0-7, 8-12, 13+).
  Generates lesson text content, integrates with seed-lessons.js for TTS audio and
  Gemini illustration generation, and seeds to both Firebase Emulator and Production.
  Use when you need to create new lesson content for any age group.
compatibility: Requires firebase/functions/seed-lessons.js infrastructure, serviceAccountKey.json, and .env with GEMINI_API_KEY.
metadata:
  author: little-buddha-team
  source: .agent/skills/lesson-author
---

# Lesson Author Skill

Create new Buddhist lessons for the Little Buddha application. Each lesson is a self-contained educational module with text content split into pages, each page receiving its own TTS audio narration and AI-generated illustration.

## User Input

The user will provide one or more of the following:
- A **topic, story title, or Buddhist concept** to base the lesson on
- A **target age tier** (`0-7`, `8-12`, or `13-18`)
- Optionally, a **source reference** (Jataka tale name, book title, sutta reference, etc.)

If the user does not specify a tier, create lessons for **all three tiers**.

## Pre-Execution: Understand the System

Before writing any lesson, read these files to understand the current state:

1. **`firebase/functions/seed-lessons.js`** — The seeding infrastructure. All new lessons must be added as entries in the `lessons` array inside the `seed()` function.
2. **`web/src/types.ts`** — The `EducationalModule` TypeScript interface that defines the Firestore document shape.
3. **`firebase/functions/stories.md`** — Existing story references for inspiration and to avoid duplicates.

### Data Model (from `types.ts`)

```typescript
interface EducationalModule {
  id?: string;
  title: string;
  pages: LessonPage[];         // Built automatically from textContent paragraphs
  targetAgeTier: '0-7' | '8-12' | '13-18';
  summaryPoints: string[];
  discussionQuestions: string[];
}

interface LessonPage {
  text: string;
  audioRef: string;
  imageRef?: string;
}
```

### How Lessons Are Structured in `seed-lessons.js`

Each lesson is defined as an object in the `lessons` array with:
- `id` — Unique kebab-case identifier (e.g., `lesson-0-7-swan`, `lesson-8-12-noble-truths`)
- `title` — Human-readable lesson title
- `textContent` — Full lesson text as a single string. **Paragraphs are separated by `\n\n`** (double newline). Each paragraph becomes one "page" in the app.
- `audioRef` — Base audio reference (historical; actual per-page refs are auto-generated)
- `targetAgeTier` — `"0-7"`, `"8-12"`, or `"13-18"`
- `summaryPoints` — Array of 2-4 short takeaway strings
- `discussionQuestions` — Array of 2-3 age-appropriate questions

The seed loop automatically:
1. Splits `textContent` on `\n\n` into paragraphs (= pages)
2. For each page, generates TTS audio via Google Cloud TTS
3. For each page, generates an illustration via Gemini image generation
4. Uploads assets to both emulator and production storage
5. Saves the Firestore document with the `pages` array

## Lesson Content Guidelines

### Age Tier: 0-7 (Little Explorers)

| Attribute | Requirement |
|-----------|-------------|
| **Total word count** | 300–500 words |
| **Pages (paragraphs)** | 4–6 paragraphs |
| **Words per page** | ~60–100 words each |
| **Reading level** | Kindergarten to 2nd grade |
| **Tone** | Warm, gentle, wonder-filled, soothing |
| **Vocabulary** | Simple, concrete words. No abstractions. |
| **Sentence length** | Short sentences (8–15 words) |
| **Content type** | Folk tales, Jataka tales, animal stories, nature metaphors |
| **Buddhist concepts** | Kindness, sharing, compassion, mindful breathing, gratitude — taught implicitly through narrative |
| **Imagery** | Vivid sensory details (colors, sounds, textures) a child can visualize |
| **Pronouns** | Use "you" to draw the child in; address them directly |
| **Avoid** | Abstract philosophy, death, suffering, complex moral dilemmas, scary imagery |

**Source material examples:**
- Jataka Tales (The Rabbit on the Moon, The Monkey King, The Deer King)
- Zen Shorts by Jon J. Muth (Stillwater stories)
- A Pebble for Your Pocket by Thich Nhat Hanh
- Prince Siddhartha's childhood stories
- Nature-based mindfulness exercises

### Age Tier: 8-12 (Young Learners)

| Attribute | Requirement |
|-----------|-------------|
| **Total word count** | 400–600 words |
| **Pages (paragraphs)** | 4–6 paragraphs |
| **Words per page** | ~80–120 words each |
| **Reading level** | 3rd to 6th grade |
| **Tone** | Engaging, encouraging, relatable, uses analogies from school/sports/friendships |
| **Vocabulary** | Grade-appropriate; can introduce Buddhist terms with inline definitions |
| **Sentence length** | Medium sentences (10–20 words) |
| **Content type** | Mix of (a) condensed folk tales AND (b) Buddhist concepts explained directly |
| **Buddhist concepts** | Four Noble Truths, Eightfold Path, impermanence (anicca), karma, samsara (birth-death cycle), mindfulness, compassion (karuna), the Middle Way |
| **Concept lessons** | NOT framed as stories. Taught as direct explanations with relatable analogies (school stress, video games, friendships, sports) |
| **Avoid** | Overly academic language, graphic descriptions of suffering, sectarian details |

**Content mix for 8-12:**
- ~40% narrative lessons (condensed Jataka tales, Siddhartha's life events)
- ~60% concept lessons (Four Noble Truths, Eightfold Path, impermanence, karma, etc.)

**Concept lesson structure:**
1. **Hook** — Relatable scenario from a kid's life
2. **Introduction** — Name the concept and give a simple definition
3. **Analogy** — Concrete analogy the age group can grasp
4. **Deeper explanation** — Expand with examples
5. **Application** — "How you can use this today"
6. **Wrap-up** — Encouraging closing

### Age Tier: 13-18 (Wise Seekers)

| Attribute | Requirement |
|-----------|-------------|
| **Total word count** | 500–1000 words |
| **Pages (paragraphs)** | 5–8 paragraphs |
| **Words per page** | ~100–150 words each |
| **Reading level** | 7th grade to young adult |
| **Tone** | Thoughtful, respectful, slightly philosophical, empowering |
| **Vocabulary** | Can use Pali/Sanskrit terms with explanations (dukkha, anicca, anatta, sila, samadhi, panna) |
| **Sentence length** | Varied; can include compound sentences |
| **Content type** | Deep concept exploration with rich analogies, historical context, and practical application |
| **Buddhist concepts** | Same concepts as 8-12 but with significantly more depth, nuance, and philosophical weight |
| **Analogies** | Draw from teen/young adult life: social media, identity, relationships, career anxiety, existential questions |
| **Include** | Quotes from suttas (paraphrased), historical context, cross-cultural connections |
| **Avoid** | Preachiness, dogma, dismissing other worldviews |

**13+ lessons echo 8-12 concepts but with:**
- More philosophical depth and multiple perspectives
- Real-world application to teen struggles (identity, peer pressure, existential anxiety)
- Historical context (when/where the Buddha taught this, how it spread)
- Analogies from modern life (social media dopamine loops = craving, gaming achievements = impermanence)
- Encouragement of critical thinking rather than blind acceptance

## Buddhist Source Material Library

Use these as source material. Condense or summarize to fit word count requirements.

### Jataka Tales (Folk Tales — primarily for 0-7, adapted for 8-12)
- The Monkey King (sacrifice, leadership)
- The Rabbit on the Moon (Dana/generosity)
- The Deer King (compassion, protecting the vulnerable)
- The Golden Swan (greed vs. contentment)
- The Elephant and the Blind Men (perspective, not judging)
- The Jackal and the Crow (friendship, trust)
- The Wise Quail (unity, cooperation)
- The Lion and the Boar (futility of conflict)
- Prince Siddhartha and the Swan (compassion for all life)
- The Banyan Deer (self-sacrifice, mercy)

### Buddhist Concepts (primarily for 8-12 and 13+)
- **The Four Noble Truths** (dukkha, samudaya, nirodha, magga)
- **The Noble Eightfold Path** (right view, intention, speech, action, livelihood, effort, mindfulness, concentration)
- **Impermanence (Anicca)** — nothing lasts forever
- **Non-self (Anatta)** — the illusion of a fixed identity
- **The Middle Way** — avoiding extremes
- **Karma** — actions have consequences
- **Samsara** — the cycle of birth, aging, sickness, death
- **The Three Marks of Existence** (dukkha, anicca, anatta)
- **The Five Precepts** (ethical guidelines)
- **Metta (Loving-kindness)** — wishing well for all beings
- **Dependent Origination** — everything arises from conditions
- **The Three Poisons** (greed, hatred, delusion)
- **Mindfulness (Sati)** — present-moment awareness

### Known Literature (for condensed/summary form)
- Dhammapada verses (paraphrased)
- Sutta Nipata selections
- Zen Shorts by Jon J. Muth
- A Pebble for Your Pocket by Thich Nhat Hanh
- Siddhartha by Hermann Hesse (for 13+ only)
- The Tibetan Book of Living and Dying (concepts only, for 13+)

## Execution Steps

### Step 1: Check Existing Lessons

Read `firebase/functions/seed-lessons.js` to:
- Identify all existing lesson IDs and titles
- Avoid creating duplicate content
- Understand the current variable naming pattern

### Step 2: Determine Lesson Topic & Tier

Based on user input, select:
- The Buddhist source material or concept
- The target age tier(s)
- A unique lesson ID following the pattern: `lesson-{tier}-{short-slug}` (e.g., `lesson-8-12-four-truths`, `lesson-13-18-impermanence`)

### Step 3: Write the Lesson Content

Write the `textContent` string following the tier-specific guidelines above. Key rules:

1. **Paragraph separation**: Use `\n\n` between paragraphs. Each paragraph = one app page.
2. **Word count**: Verify the total falls within the tier's range.
3. **Page count**: Ensure the correct number of paragraphs for the tier.
4. **Indentation**: Each paragraph after the first should start with two spaces (`  `) to match existing formatting in seed-lessons.js.
5. **No markdown**: Content is plain text only. No headers, bullets, or formatting.
6. **Quotes**: Use standard double quotes `"..."` for dialogue.
7. **Buddhist accuracy**: Ensure all teachings are doctrinally accurate to Theravada/general Buddhism. Do not mix in non-Buddhist concepts.
8. **Standalone pages**: Each paragraph should be somewhat self-contained as a "page" — it will be displayed individually with its own illustration.

### Step 4: Create Summary Points & Discussion Questions

- **summaryPoints**: 2–4 short, memorable takeaways (5–10 words each)
- **discussionQuestions**: 2–3 age-appropriate questions that encourage reflection

### Step 5: Add to seed-lessons.js

1. Add the `textContent` as a new `const` variable, following the existing naming pattern (e.g., `textContentLesson_nobleTruths`).
2. Add a new entry to the `lessons` array with all required fields.
3. Place the variable declaration near other lessons of the same tier for organization.

### Step 6: Update stories.md (if applicable)

If the lesson is based on a new source not already in `firebase/functions/stories.md`, add a numbered entry describing the source.

### Step 7: Verify

After adding the lesson:
1. Count the total words to confirm it falls within the tier's range.
2. Count the paragraphs to confirm page count is appropriate.
3. Verify the lesson ID is unique.
4. Verify no other lesson covers the exact same topic for the same tier.

### Step 8: Seed the Lesson

Run the seed script to generate audio, illustrations, and Firestore documents:

```bash
cd firebase/functions
node seed-lessons.js
```

> **Note**: The seed script handles TTS audio generation, Gemini image generation, and upload to both emulator and production. It will skip assets that already exist in production.

## Example Lesson Output (8-12 Concept Lesson)

```javascript
const textContentLesson_fourTruths = `Have you ever wondered why life sometimes feels hard, even when everything seems like it should be fine? Maybe you got the new video game you wanted, but after a week, you're already bored and want something else. Or maybe you aced a test, but instead of feeling great, you're already stressed about the next one. The Buddha noticed this same pattern over 2,500 years ago, and he came up with a simple explanation called the Four Noble Truths.

  The First Noble Truth is called Dukkha, which means "suffering" or "unsatisfactoriness." But don't worry — it doesn't mean life is always terrible. It means that no matter how good things get, there's always a little itch, a little feeling that something is missing. Think of it like this: you know that feeling when you finish a really amazing book or TV show? There's this weird emptiness afterward. That's dukkha. It's the gap between what we have and what we want.

  The Second Noble Truth is Samudaya, which means "the cause of suffering." The Buddha said our suffering comes from craving — constantly wanting things to be different from how they are. We want more, we want better, we want things to last forever. It's like being on a treadmill that never stops: you keep running toward the next thing, but you never actually arrive anywhere.

  The Third Noble Truth is Nirodha, which means "the end of suffering." This is the good news! The Buddha said it IS possible to step off that treadmill. When you stop clinging to things — when you learn to enjoy them without desperately needing them — you find a deep, lasting peace that doesn't depend on getting the next new thing.

  The Fourth Noble Truth is Magga, which means "the path." This is the Buddha's roadmap for how to actually get to that peaceful place. It's called the Noble Eightfold Path, and it includes things like thinking clearly, speaking kindly, and paying attention to the present moment. You don't have to be perfect at it — it's a practice, like learning an instrument. The more you work at it, the better you get. The Four Noble Truths aren't about being sad or giving up fun. They're about understanding why we sometimes feel stuck, and knowing there's a clear way forward.`;
```

## Quality Checklist

Before finalizing any lesson, verify:

- [ ] Word count is within the tier's specified range
- [ ] Paragraph count matches expected page count for the tier
- [ ] Language complexity matches the target age group
- [ ] Buddhist concepts are accurately represented
- [ ] No duplicate topic exists for the same tier
- [ ] Lesson ID follows `lesson-{tier}-{slug}` pattern
- [ ] summaryPoints has 2–4 entries
- [ ] discussionQuestions has 2–3 entries
- [ ] Content uses `\n\n` paragraph separation
- [ ] No markdown formatting in content text
- [ ] Tone is appropriate (warm for 0-7, engaging for 8-12, thoughtful for 13+)
- [ ] Each paragraph can stand alone as a visual "page"
- [ ] Added to the `lessons` array in seed-lessons.js
- [ ] Variable follows existing naming convention
