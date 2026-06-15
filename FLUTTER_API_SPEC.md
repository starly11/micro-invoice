# 📱 StudyVault E-Book Platform - Flutter API Specification

**Version:** 1.0.0  
**Base URL:** `https://api.studyvault.pk/api` (Production) / `http://localhost:5000/api` (Development)  
**Last Updated:** Generated from backend-ebook source code analysis

---

## 🔐 Authentication Overview

All authenticated endpoints require JWT Bearer token in the Authorization header.

### Token Types
- **Student JWT**: For student users (default role)
- **Admin Token**: For admin/superadmin roles
- **Public**: No authentication required

### Standard Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": [] // Optional validation errors
  }
}
```

---

## 📚 Table of Contents

1. [Authentication](#-authentication)
2. [Books](#-books)
3. [Chapters](#-chapters)
4. [Topics](#-topics)
5. [User Progress](#-user-progress)
6. [Vault (Bookmarks)](#-vault-bookmarks)
7. [Quizzes](#-quizzes)
8. [AI Features](#-ai-features)
9. [Search](#-search)
10. [Dashboard](#-dashboard)
11. [Quran Resources](#-quran-resources)
12. [Checkout & Payments](#-checkout--payments)
13. [Webhooks](#-webhooks)
14. [Content Ingestion (Admin)](#-content-ingestion-admin)

---

## 🔐 Authentication

### ➡️ POST `/auth/login`
**Description:** Admin and Student login with email/password  
**Auth Layer:** Public  
**Controller Hook:** `authController.login`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json"
}
```

* **Request Body:**
```json
{
  "email": "admin@studyvault.pk",
  "password": "admin123"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "600000000000000000000001",
      "email": "admin@studyvault.pk",
      "name": "Admin User",
      "role": "admin"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  },
  "message": "Admin login successful"
}
```

---

### ➡️ POST `/auth/google`
**Description:** Google OAuth login/registration with credential token  
**Auth Layer:** Public  
**Controller Hook:** `authController.googleAuth`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json"
}
```

* **Request Body:**
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImU5NDAyNjQwMzIy..."
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john.doe@gmail.com",
      "role": "student",
      "avatar_url": "https://lh3.googleusercontent.com/a-/AOh14Gh...",
      "onboardingComplete": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  },
  "message": "Google auth successful"
}
```

---

### ➡️ GET `/auth/getMe`
**Description:** Get current authenticated user profile  
**Auth Layer:** Student JWT / Admin Token  
**Controller Hook:** `authController.getMe`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john.doe@gmail.com",
    "role": "student",
    "avatar_url": "https://lh3.googleusercontent.com/a-/AOh14Gh...",
    "is_verified": true,
    "student_profile": {
      "board_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "grade": "10",
      "class": "Class 10",
      "medium": "english",
      "onboarding_completed": true,
      "xp_total": 1250,
      "streak_days": 15,
      "last_active": "2024-01-15T10:30:00.000Z"
    },
    "subscription": {
      "plan": "free",
      "status": "active",
      "expires_at": null,
      "ai_credits_used_today": 5,
      "ai_credits_reset_at": "2024-01-15T00:00:00.000Z"
    }
  },
  "message": "User retrieved"
}
```

---

### ➡️ POST `/auth/onboarding`
**Description:** Complete student onboarding with board and grade selection  
**Auth Layer:** Student JWT  
**Controller Hook:** `authController.completeOnboarding`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Request Body:**
```json
{
  "board": "FBISE",
  "grade": "10",
  "className": "Class 10"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john.doe@gmail.com",
      "role": "student",
      "board": "FBISE",
      "grade": "10",
      "student_profile": {
        "board": "FBISE",
        "grade": "10",
        "class": "Class 10",
        "onboarding_completed": true
      }
    }
  },
  "message": "Onboarding completed"
}
```

---

### ➡️ POST `/auth/logout`
**Description:** Logout and clear session cookie  
**Auth Layer:** Student JWT / Admin Token  
**Controller Hook:** `authController.logout`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out"
  },
  "message": "LOGGED_OUT"
}
```

---

## 📚 Books

### ➡️ GET `/books`
**Description:** Get all books with optional filtering by board, grade, subject, etc.  
**Auth Layer:** Public (optional auth for personalized results)  
**Controller Hook:** `bookController.getBooks`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Query Parameters:**
  - `boardId` (string): Filter by board ID
  - `programId` (string): Filter by program ID
  - `classLevel` (string): Filter by class level
  - `subject` (string): Filter by subject slug (case-insensitive)
  - `grade` (string): Filter by grade (flexible matching: "10", "Class 10", "Grade 10")
  - `editionYear` (number): Filter by edition year
  - `board` (string): Board short code or slug (e.g., "FBISE", "pbisepeshawar")

* **Example Request:**
```
GET /books?board=FBISE&grade=10&subject=physics&editionYear=2024
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
        "title": "Physics Class 10",
        "slug": "physics-class-10",
        "subject": "Physics",
        "subject_slug": "physics",
        "grade": "10",
        "edition_year": 2024,
        "metadata": {
          "authors": ["Dr. Ahmad Khan"],
          "publisher": "National Book Foundation",
          "isbn": "978-969-123-456-7",
          "total_pages": 256,
          "language": "english"
        },
        "seo": {
          "meta_title": "Physics Class 10 - FBISE",
          "meta_description": "Complete Physics textbook for Class 10",
          "keywords": ["physics", "class 10", "fbise"]
        },
        "total_chapters": 12,
        "is_live": true,
        "is_public": true,
        "board_id": {
          "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
          "name": "Federal Board",
          "slug": "fbise",
          "short_code": "FBISE"
        },
        "board_short_code": "FBISE",
        "board_slug": "fbise"
      }
    ],
    "isAuthenticated": true
  }
}
```

---

### ➡️ GET `/books/:id`
**Description:** Get single book by ID  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `bookController.getBook`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `id` (string): Book MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "title": "Physics Class 10",
    "slug": "physics-class-10",
    "subject": "Physics",
    "subject_slug": "physics",
    "grade": "10",
    "edition_year": 2024,
    "program_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "board_id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "total_chapters": 12,
    "total_topics": 156,
    "is_live": true,
    "ingestion_status": "complete"
  }
}
```

---

### ➡️ GET `/books/slug/:slug`
**Description:** Get book by slug with optional edition year  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `bookController.getBookBySlug`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `slug` (string): Book slug (e.g., "physics-class-10")

* **Query Parameters:**
  - `editionYear` (number): Optional edition year filter

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "title": "Physics Class 10",
    "slug": "physics-class-10",
    "subject": "Physics",
    "grade": "10",
    "edition_year": 2024
  }
}
```

---

### ➡️ GET `/books/:id/chapters`
**Description:** Get all chapters for a specific book  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `bookController.getBookChapters`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `id` (string): Book MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "book_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "chapters": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
        "chapter_number": 1,
        "chapter_number_display": "Chapter 1",
        "title": "Simple Harmonic Motion and Waves",
        "slug": "simple-harmonic-motion-and-waves",
        "page_start": 1,
        "page_end": 24,
        "student_learning_outcomes": [
          "Describe SHM and its characteristics",
          "Explain simple pendulum motion"
        ],
        "chapter_summary": "This chapter covers the fundamentals of oscillatory motion...",
        "display_order": 0,
        "seo": {
          "meta_title": "Simple Harmonic Motion - Physics Class 10",
          "meta_description": "Learn about SHM and waves",
          "keywords": ["SHM", "waves", "physics"]
        },
        "total_topics": 14,
        "is_live": true
      }
    ],
    "total_chapters": 12
  }
}
```

---

### ➡️ POST `/books`
**Description:** Create new book (Admin only)  
**Auth Layer:** Admin Token  
**Controller Hook:** `bookController.createBook`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <ADMIN_JWT_TOKEN>"
}
```

* **Request Body:**
```json
{
  "title": "Chemistry Class 9",
  "subject": "Chemistry",
  "subject_slug": "chemistry",
  "grade": "9",
  "edition_year": 2024,
  "program_id": "65f1a2b3c4d5e6f7g8h9i0j4",
  "board_id": "65f1a2b3c4d5e6f7g8h9i0j2",
  "metadata": {
    "authors": ["Dr. Sarah Ahmed"],
    "publisher": "Oxford University Press",
    "isbn": "978-969-234-567-8",
    "language": "english"
  },
  "seo": {
    "meta_title": "Chemistry Class 9",
    "keywords": ["chemistry", "class 9"]
  }
}
```

---

## 📖 Chapters

### ➡️ GET `/chapters/:id`
**Description:** Get chapter by ID  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `chapterController.getChapter`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `id` (string): Chapter MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "title": "Simple Harmonic Motion and Waves",
    "slug": "simple-harmonic-motion-and-waves",
    "chapter_number": 1,
    "chapter_number_display": "Chapter 1",
    "book_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "program_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "student_learning_outcomes": [
      "Describe SHM and its characteristics",
      "Explain simple pendulum motion"
    ],
    "summary": "This chapter covers the fundamentals of oscillatory motion...",
    "page_start": 1,
    "page_end": 24,
    "total_topics": 14,
    "is_live": true,
    "display_order": 0
  }
}
```

---

### ➡️ GET `/chapters/slug/:slug`
**Description:** Get chapter by slug (requires bookId query param)  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `chapterController.getChapterBySlug`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `slug` (string): Chapter slug

* **Query Parameters:**
  - `bookId` (string, required): Book MongoDB ObjectId

* **Example Request:**
```
GET /chapters/slug/simple-harmonic-motion-and-waves?bookId=65f1a2b3c4d5e6f7g8h9i0j3
```

---

### ➡️ GET `/chapters/book/:bookId`
**Description:** Get all chapters for a book (alternative route)  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `chapterController.getBookChapters`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `bookId` (string): Book MongoDB ObjectId

---

### ➡️ GET `/chapters/:chapterId/topics`
**Description:** Get all topics for a chapter (sorted by display_order)  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `chapterController.getChapterTopics`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `chapterId` (string): Chapter MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "chapter_id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "topics": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j6",
        "title": "Introduction to SHM",
        "slug": "introduction-to-shm",
        "topic_number": "1.1",
        "display_order": 0,
        "difficulty": "easy",
        "estimated_read_time": 5
      }
    ],
    "total_topics": 14
  }
}
```

---

## 📄 Topics

### ➡️ GET `/topics/:id`
**Description:** Get topic by ID with full content blocks  
**Auth Layer:** Public (optional auth for user progress)  
**Controller Hook:** `topicController.getTopic`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `id` (string): Topic MongoDB ObjectId

* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional for user_progress
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j6",
    "title": "Introduction to SHM",
    "title_urdu": "ایس ایچ ایم کا تعارف",
    "slug": "introduction-to-shm",
    "topic_number": "1.1",
    "display_order": 0,
    "difficulty": "easy",
    "estimated_read_time": 5,
    "edition_year": 2024,
    "raw_text": "Simple Harmonic Motion is a type of periodic motion...",
    "clean_html": "<p>Simple Harmonic Motion is a type of periodic motion...</p>",
    "content_blocks": [
      {
        "type": "heading",
        "text": "What is Simple Harmonic Motion?",
        "level": 2,
        "block_order": 0
      },
      {
        "type": "paragraph",
        "text": "Simple Harmonic Motion (SHM) is a special type of periodic motion...",
        "html": "<p>Simple Harmonic Motion (SHM) is a special type of periodic motion...</p>",
        "block_order": 1
      },
      {
        "type": "formula",
        "latex": "F = -kx",
        "formula_label": "Restoring Force",
        "block_order": 2
      },
      {
        "type": "image",
        "src": "https://cdn.studyvault.pk/topics/shm-diagram.png",
        "alt": "SHM diagram showing displacement vs time",
        "caption": "Figure 1.1: Displacement-time graph for SHM",
        "figure_number": "1.1",
        "block_order": 3
      },
      {
        "type": "callout",
        "variant": "note",
        "title": "Key Point",
        "text": "The negative sign indicates that the force is opposite to displacement",
        "block_order": 4
      },
      {
        "type": "example",
        "problem": "A mass-spring system has k = 100 N/m. Calculate the force when x = 0.05 m",
        "solution": "F = -kx = -(100)(0.05) = -5 N",
        "steps": ["Identify given values", "Apply formula F = -kx", "Calculate result"],
        "block_order": 5
      },
      {
        "type": "mcq",
        "question": "What is the direction of restoring force in SHM?",
        "options": ["Same as displacement", "Opposite to displacement", "Perpendicular to displacement"],
        "correct_answer": "Opposite to displacement",
        "explanation": "The restoring force always acts towards the mean position",
        "block_order": 6
      },
      {
        "type": "quran_verse",
        "quran_data": {
          "surah": 36,
          "ayah": 40,
          "textbook_line_translation": "It is not allowable for the sun to reach the moon...",
          "word_alignments": [
            {
              "position": 1,
              "textbook_urdu_meaning": "نہیں ہے مناسب",
              "color_highlight": "#FFD700"
            }
          ],
          "tafsir_snippet": "This verse describes the precise orbits of celestial bodies"
        },
        "block_order": 7
      }
    ],
    "formulas": [
      {
        "latex": "F = -kx",
        "label": "Restoring Force",
        "plain_text": "F equals minus k x"
      }
    ],
    "key_terms": [
      {
        "term": "Periodic Motion",
        "definition": "Motion that repeats itself at regular intervals"
      }
    ],
    "book_mcqs": [
      {
        "question": "What is the SI unit of frequency?",
        "options": ["Hertz", "Newton", "Joule"],
        "correct_answer": "Hertz",
        "explanation": "Frequency is measured in Hertz (Hz)",
        "source": "book"
      }
    ],
    "book_short_questions": [
      "Define Simple Harmonic Motion",
      "What is meant by restoring force?"
    ],
    "book_problems": [
      {
        "problem": "Calculate the period of a pendulum with length 1m",
        "answer": "T = 2π√(l/g) = 2π√(1/9.8) ≈ 2.0 s",
        "steps": ["Write formula T = 2π√(l/g)", "Substitute l = 1m, g = 9.8 m/s²", "Calculate"]
      }
    ],
    "keywords": ["SHM", "periodic motion", "restoring force", "oscillation"],
    "quran_reference": {
      "surah": 36,
      "ayah": 40,
      "surah_name_arabic": "يس",
      "surah_name_english": "Ya-Sin",
      "juz": 23,
      "manzil": 5
    },
    "quran_word_alignments": [
      {
        "position": 1,
        "textbook_urdu_meaning": "نہیں ہے مناسب",
        "color_highlight": "#FFD700",
        "grammar_note": "Negation particle"
      }
    ],
    "quran_textbook_translation": "It is not allowable for the sun to reach the moon...",
    "quran_textbook_tafsir": "This verse describes the precise orbits...",
    "seo": {
      "meta_title": "Introduction to SHM - Physics Class 10",
      "meta_description": "Learn the basics of Simple Harmonic Motion",
      "keywords": ["SHM", "physics", "class 10"],
      "source_page": 5
    },
    "user_progress": {
      "is_read": true,
      "scroll_depth_percent": 85,
      "time_spent_seconds": 320,
      "mastery_status": "in_progress",
      "progress_percent": 45
    }
  }
}
```

---

### ➡️ GET `/topics/by-nested-slug/:boardSlug/:programSlug/:subjectSlug/:chapterSlug/:topicSlug`
**Description:** Get topic using nested slug path (Next.js friendly)  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `topicController.getNestedTopic`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `boardSlug` (string): Board slug (e.g., "fbise")
  - `programSlug` (string): Program slug (e.g., "matric")
  - `subjectSlug` (string): Subject slug (e.g., "physics")
  - `chapterSlug` (string): Chapter slug
  - `topicSlug` (string): Topic slug

* **Example Request:**
```
GET /topics/by-nested-slug/fbise/matric/physics/simple-harmonic-motion/introduction-to-shm
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "topic": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j6",
      "title": "Introduction to SHM",
      "slug": "introduction-to-shm",
      "content_blocks": [],
      "display_order": 0
    },
    "chapter": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
      "title": "Simple Harmonic Motion and Waves",
      "slug": "simple-harmonic-motion-and-waves",
      "chapter_number": 1
    },
    "previousTopic": null,
    "nextTopic": null,
    "book": null,
    "program": null
  }
}
```

---

### ➡️ GET `/topics/slug/:slug`
**Description:** Get topic by single slug lookup  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `topicController.getTopicBySlug`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `slug` (string): Topic unique slug

---

### ➡️ GET `/topics/chapter/:chapterId`
**Description:** Get all topics for a chapter  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `topicController.getTopicsByChapter`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `chapterId` (string): Chapter MongoDB ObjectId

---

### ➡️ GET `/topics/:id/adjacent`
**Description:** Get previous and next topics for navigation  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `topicController.getAdjacentTopics`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `id` (string): Topic MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "previousTopic": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j7",
      "title": "Previous Topic Title",
      "slug": "previous-topic-slug"
    },
    "nextTopic": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j8",
      "title": "Next Topic Title",
      "slug": "next-topic-slug"
    }
  }
}
```

---

### ➡️ GET `/topics/search`
**Description:** Search topics by query string  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `topicController.searchTopics`

#### 📬 Headers & Parameters
* **Query Parameters:**
  - `q` (string, required): Search query
  - `limit` (number): Max results (default: 20)
  - `boardId` (string): Filter by board
  - `programId` (string): Filter by program
  - `classLevel` (string): Filter by class level

* **Example Request:**
```
GET /topics/search?q=simple+harmonic+motion&limit=10&boardId=65f1a2b3c4d5e6f7g8h9i0j2
```

---

### ➡️ GET `/topics/hot`
**Description:** Get trending/hot topics  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `topicController.getHotTopics`

#### 📬 Headers & Parameters
* **Query Parameters:**
  - `limit` (number): Max results (default: 10)

---

## 📊 User Progress

### ➡️ GET `/progress/:topicId`
**Description:** Get user's progress for a specific topic  
**Auth Layer:** Student JWT  
**Controller Hook:** `progressController.getTopicProgress`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Path Parameters:**
  - `topicId` (string): Topic MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j9",
    "user_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "topic_id": "65f1a2b3c4d5e6f7g8h9i0j6",
    "chapter_id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "book_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "is_read": true,
    "scroll_depth_percent": 85,
    "time_spent_seconds": 320,
    "quiz_attempts": 2,
    "highest_quiz_score": 80,
    "last_quiz_score": 75,
    "mastery_status": "in_progress",
    "progress_percent": 45,
    "xp_earned": 50,
    "last_accessed": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### ➡️ PUT `/progress/:topicId`
**Description:** Update user progress for a topic  
**Auth Layer:** Student JWT  
**Controller Hook:** `progressController.updateProgress`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Path Parameters:**
  - `topicId` (string): Topic MongoDB ObjectId

* **Request Body:**
```json
{
  "scroll_depth_percent": 90,
  "time_spent_seconds": 400,
  "is_read": true
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j9",
    "user_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "topic_id": "65f1a2b3c4d5e6f7g8h9i0j6",
    "scroll_depth_percent": 90,
    "time_spent_seconds": 400,
    "is_read": true,
    "progress_percent": 50,
    "updated_at": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### ➡️ POST `/progress/:topicId/complete`
**Description:** Mark topic as completed  
**Auth Layer:** Student JWT  
**Controller Hook:** `progressController.completeTopic`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Path Parameters:**
  - `topicId` (string): Topic MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j9",
    "user_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "topic_id": "65f1a2b3c4d5e6f7g8h9i0j6",
    "is_read": true,
    "scroll_depth_percent": 100,
    "mastery_status": "mastered",
    "progress_percent": 100,
    "xp_earned": 100
  },
  "message": "Topic marked as completed"
}
```

---

### ➡️ GET `/progress/stats`
**Description:** Get user's overall progress statistics  
**Auth Layer:** Student JWT  
**Controller Hook:** `progressController.getProgressStats`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_topics_read": 45,
    "total_time_spent_minutes": 320,
    "average_quiz_score": 78,
    "topics_mastered": 12,
    "topics_in_progress": 8,
    "total_xp_earned": 1250,
    "current_streak_days": 15,
    "longest_streak_days": 30
  }
}
```

---

### ➡️ GET `/progress/recent`
**Description:** Get user's recent activity  
**Auth Layer:** Student JWT  
**Controller Hook:** `progressController.getRecentActivity`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Query Parameters:**
  - `limit` (number): Max results (default: 10)

* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "topic_id": "65f1a2b3c4d5e6f7g8h9i0j6",
      "topic_title": "Introduction to SHM",
      "action": "completed",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "progress_percent": 100
    }
  ]
}
```

---

### ➡️ GET `/progress/streak`
**Description:** Get user's streak data  
**Auth Layer:** Student JWT  
**Controller Hook:** `progressController.getStreakData`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "current_streak": 15,
    "longest_streak": 30,
    "last_active_date": "2024-01-15",
    "streak_history": [
      {"date": "2024-01-15", "active": true},
      {"date": "2024-01-14", "active": true}
    ]
  }
}
```

---

## 🔖 Vault (Bookmarks)

### ➡️ GET `/vault`
**Description:** Get user's vault items (bookmarks, flashcards, notes, highlights)  
**Auth Layer:** Student JWT  
**Controller Hook:** `vaultController.getVault`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "items_count": 5,
    "items": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0k1",
        "topicTitle": "Introduction to SHM",
        "itemType": "flashcard",
        "content": {
          "front": "What is Simple Harmonic Motion?",
          "back": "A type of periodic motion where restoring force is proportional to displacement",
          "is_ai_generated": true
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "topicId": "65f1a2b3c4d5e6f7g8h9i0j6"
      },
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0k2",
        "topicTitle": "Wave Properties",
        "itemType": "note",
        "content": {
          "text": "Remember: v = fλ for all waves"
        },
        "createdAt": "2024-01-14T09:15:00.000Z",
        "topicId": "65f1a2b3c4d5e6f7g8h9i0j7"
      },
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0k3",
        "topicTitle": "Pendulum Motion",
        "itemType": "highlight",
        "content": {
          "text": "The period of a simple pendulum is independent of mass",
          "block_order": 5,
          "color": "#FEF3C7"
        },
        "createdAt": "2024-01-13T14:20:00.000Z",
        "topicId": "65f1a2b3c4d5e6f7g8h9i0j8"
      },
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0k4",
        "topicTitle": "Sound Waves",
        "itemType": "video_link",
        "content": {
          "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          "title": "Understanding Sound Waves",
          "thumbnail_url": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          "platform": "youtube"
        },
        "createdAt": "2024-01-12T11:00:00.000Z",
        "topicId": "65f1a2b3c4d5e6f7g8h9i0j9"
      }
    ]
  }
}
```

---

### ➡️ POST `/vault/:topicId`
**Description:** Add topic to vault (bookmark)  
**Auth Layer:** Student JWT  
**Controller Hook:** `vaultController.addToVault`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Path Parameters:**
  - `topicId` (string): Topic MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0k5",
    "user_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "topic_id": "65f1a2b3c4d5e6f7g8h9i0j6",
    "type": "bookmark",
    "createdAt": "2024-01-15T10:40:00.000Z"
  },
  "message": "Topic added to vault"
}
```

---

### ➡️ DELETE `/vault/:topicId`
**Description:** Remove topic from vault  
**Auth Layer:** Student JWT  
**Controller Hook:** `vaultController.removeFromVault`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Path Parameters:**
  - `topicId` (string): Topic MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Topic removed from vault"
  }
}
```

---

### ➡️ GET `/vault/:topicId/status`
**Description:** Check if topic is in user's vault  
**Auth Layer:** Student JWT  
**Controller Hook:** `vaultController.checkVaultStatus`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Path Parameters:**
  - `topicId` (string): Topic MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "isInVault": true
  }
}
```

---

### ➡️ GET `/vault/stats`
**Description:** Get vault statistics  
**Auth Layer:** Student JWT  
**Controller Hook:** `vaultController.getVaultStats`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_items": 25,
    "flashcards_count": 10,
    "notes_count": 8,
    "highlights_count": 5,
    "video_links_count": 2
  }
}
```

---

## 🎯 Quizzes

### ➡️ GET `/quizzes/:id`
**Description:** Get quiz by ID  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `quizController.getQuiz`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `id` (string): Quiz MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0l1",
    "topic_id": "65f1a2b3c4d5e6f7g8h9i0j6",
    "chapter_id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "book_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "questions": [
      {
        "id": "q1",
        "question": "What is the SI unit of frequency?",
        "options": ["Hertz", "Newton", "Joule", "Watt"],
        "difficulty": "easy"
      },
      {
        "id": "q2",
        "question": "In SHM, the restoring force is proportional to:",
        "options": ["Velocity", "Displacement", "Acceleration", "Time"],
        "difficulty": "medium"
      }
    ],
    "total_questions": 10,
    "time_limit_seconds": 600
  }
}
```

---

### ➡️ GET `/quizzes/topic/:topicId`
**Description:** Get all quizzes for a topic  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `quizController.getQuizzesByTopic`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `topicId` (string): Topic MongoDB ObjectId

---

### ➡️ GET `/quizzes/topic/:topicId/random`
**Description:** Generate random quiz questions using AI  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `quizController.getRandomQuiz`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `topicId` (string): Topic MongoDB ObjectId

* **Query Parameters:**
  - `limit` (number): Number of questions (default: 5)

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "ai_q1",
        "question": "AI-generated question about SHM",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "Option B",
        "explanation": "Detailed explanation here",
        "difficulty": "medium"
      }
    ]
  }
}
```

---

### ➡️ POST `/quizzes/:id/submit`
**Description:** Submit quiz answers  
**Auth Layer:** Student JWT  
**Controller Hook:** `quizController.submitQuiz`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Path Parameters:**
  - `id` (string): Quiz MongoDB ObjectId

* **Request Body:**
```json
{
  "answers": [
    {
      "questionId": "q1",
      "selected": "Hertz",
      "timeSpent": 15
    },
    {
      "questionId": "q2",
      "selected": "Displacement",
      "timeSpent": 20
    }
  ]
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "score": 80,
    "correct_count": 8,
    "total_questions": 10,
    "accuracy_percentage": 80,
    "time_spent": 180,
    "answers": [
      {
        "questionId": "q1",
        "selected": "Hertz",
        "isCorrect": true,
        "timeSpent": 15
      }
    ],
    "difficulty_breakdown": [
      {
        "difficulty": "easy",
        "correct": 4,
        "total": 5
      },
      {
        "difficulty": "medium",
        "correct": 3,
        "total": 4
      }
    ]
  }
}
```

---

## 🤖 AI Features

### ➡️ POST `/ai/:topicId/explain`
**Description:** Generate AI explanation for a topic (supports streaming)  
**Auth Layer:** Student JWT  
**Controller Hook:** `aiController.generateExplanation`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Path Parameters:**
  - `topicId` (string): Topic MongoDB ObjectId

* **Query Parameters:**
  - `stream` (boolean): Enable SSE streaming (default: false)

* **Streaming Example:**
```
Set header: Content-Type: text/event-stream

Response stream:
data: {"chunk":"Simple Harmonic Motion is..."}
data: {"chunk":"a fundamental concept..."}
data: [DONE]
```

* **Non-Streaming Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "explanation": "Simple Harmonic Motion (SHM) is a type of periodic motion where the restoring force is directly proportional to the displacement and acts in the direction opposite to that of displacement. This is described by the equation F = -kx, where F is the restoring force, k is the force constant, and x is the displacement from equilibrium..."
  }
}
```

---

### ➡️ POST `/ai/:topicId/quiz`
**Description:** Generate AI quiz questions for a topic  
**Auth Layer:** Student JWT  
**Controller Hook:** `aiController.generateQuizQuestions`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Path Parameters:**
  - `topicId` (string): Topic MongoDB ObjectId

* **Query Parameters:**
  - `count` (number): Number of questions (default: 5)

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "ai_q1",
        "question": "Explain the relationship between force and displacement in SHM",
        "options": [
          "Force is proportional to velocity",
          "Force is proportional to displacement and opposite in direction",
          "Force is constant",
          "Force is perpendicular to displacement"
        ],
        "correct_answer": "Force is proportional to displacement and opposite in direction",
        "explanation": "According to Hooke's Law, F = -kx, the negative sign indicates opposite direction",
        "difficulty": "medium"
      }
    ]
  }
}
```

---

### ➡️ POST `/ai/:topicId/flashcards`
**Description:** Generate AI flashcards for a topic  
**Auth Layer:** Student JWT  
**Controller Hook:** `aiController.generateFlashcards`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Path Parameters:**
  - `topicId` (string): Topic MongoDB ObjectId

* **Query Parameters:**
  - `count` (number): Number of flashcards (default: 10)

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "flashcards": [
      {
        "front": "What is the formula for restoring force in SHM?",
        "back": "F = -kx, where F is restoring force, k is force constant, x is displacement",
        "is_ai_generated": true
      },
      {
        "front": "Define amplitude in SHM",
        "back": "Maximum displacement from the equilibrium position",
        "is_ai_generated": true
      }
    ]
  }
}
```

---

### ➡️ GET `/ai/credits`
**Description:** Check user's AI credit balance  
**Auth Layer:** Student JWT  
**Controller Hook:** `aiController.checkCredits`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "plan": "free",
    "ai_credits_used_today": 5,
    "ai_credits_limit": 10,
    "ai_credits_remaining": 5,
    "ai_credits_reset_at": "2024-01-16T00:00:00.000Z",
    "unlimited": false
  }
}
```

---

## 🔍 Search

### ➡️ GET `/search`
**Description:** Global search across books, chapters, topics  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `searchController.globalSearch`

#### 📬 Headers & Parameters
* **Query Parameters:**
  - `q` (string, required): Search query
  - `type` (string): Filter by type (book, chapter, topic)
  - `limit` (number): Max results (default: 20)

* **Example Request:**
```
GET /search?q=simple+harmonic+motion&type=topic&limit=10
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j6",
        "title": "Introduction to SHM",
        "slug": "introduction-to-shm",
        "chapter_title": "Simple Harmonic Motion and Waves",
        "book_title": "Physics Class 10",
        "relevance_score": 0.95
      }
    ],
    "chapters": [],
    "books": []
  }
}
```

---

### ➡️ GET `/search/filtered`
**Description:** Search with advanced filters  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `searchController.searchWithFilters`

#### 📬 Headers & Parameters
* **Query Parameters:** (all optional)
  - `q`: Search query
  - `boardId`: Filter by board
  - `programId`: Filter by program
  - `classLevel`: Filter by class
  - `subject`: Filter by subject
  - `type`: Content type filter

---

### ➡️ GET `/search/suggestions`
**Description:** Get search suggestions/autocomplete  
**Auth Layer:** Public (optional auth)  
**Controller Hook:** `searchController.getSearchSuggestions`

#### 📬 Headers & Parameters
* **Query Parameters:**
  - `q` (string, required): Partial query
  - `limit` (number): Max suggestions (default: 5)

* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    "simple harmonic motion",
    "simple pendulum",
    "simple machine",
    "sound waves",
    "spring constant"
  ]
}
```

---

## 📈 Dashboard

### ➡️ GET `/dashboard/student`
**Description:** Get personalized student dashboard data  
**Auth Layer:** Student JWT  
**Controller Hook:** `dashboardController.getStudentDashboard`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "recent_topics": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j6",
        "title": "Introduction to SHM",
        "progress_percent": 100,
        "last_accessed": "2024-01-15T10:30:00.000Z"
      }
    ],
    "recommended_topics": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j7",
        "title": "Wave Properties",
        "difficulty": "medium",
        "estimated_read_time": 8
      }
    ],
    "stats": {
      "total_topics_read": 45,
      "topics_mastered": 12,
      "current_streak": 15,
      "total_xp": 1250
    },
    "achievements": [
      {
        "id": "first_topic",
        "title": "First Steps",
        "description": "Complete your first topic",
        "unlocked": true
      }
    ]
  }
}
```

---

### ➡️ GET `/dashboard/admin`
**Description:** Get admin dashboard metrics  
**Auth Layer:** Admin Token  
**Controller Hook:** `dashboardController.getAdminDashboard`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_JWT_TOKEN>"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_users": 1250,
    "active_users_today": 340,
    "total_books": 45,
    "total_topics": 2340,
    "ingestion_progress": {
      "pending": 5,
      "processing": 2,
      "complete": 2293,
      "error": 40
    },
    "revenue_this_month": 125000,
    "subscriptions": {
      "free": 1000,
      "basic": 150,
      "premium": 80,
      "family": 20
    }
  }
}
```

---

### ➡️ GET `/dashboard/admin/content-health`
**Description:** Get content health report  
**Auth Layer:** Admin Token  
**Controller Hook:** `dashboardController.getContentHealth`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_JWT_TOKEN>"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "books_without_chapters": 0,
    "chapters_without_topics": 2,
    "topics_without_content": 5,
    "broken_image_links": 12,
    "missing_quran_references": 45
  }
}
```

---

## 📖 Quran Resources

### ➡️ GET `/quran/verses/:surah`
**Description:** Get all verses for a specific surah  
**Auth Layer:** Public  
**Controller Hook:** `quranController.getVersesBySurah`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `surah` (number): Surah number (1-114)

* **Example Request:**
```
GET /quran/verses/36
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "verses": [
      {
        "_id": "65f1a2b3c4d5e6f7g8h9i0m1",
        "surah": 36,
        "ayah": 1,
        "text_arabic": "يس",
        "text_urdu": "یٰسین",
        "text_urdu_translation": "یٰسین",
        "surah_name_arabic": "يس",
        "surah_name_english": "Ya-Sin"
      }
    ]
  }
}
```

---

### ➡️ GET `/quran/verse/:surah/:ayah`
**Description:** Get a specific verse  
**Auth Layer:** Public  
**Controller Hook:** `quranController.getVerse`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `surah` (number): Surah number (1-114)
  - `ayah` (number): Ayah number

* **Example Request:**
```
GET /quran/verse/36/40
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "verse": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0m2",
      "surah": 36,
      "ayah": 40,
      "text_arabic": "لَا ٱلشَّمْسُ يَنۢبَغِى لَهَآ أَن تُدْرِكَ ٱلْقَمَرَ وَلَا ٱلَّيْلُ سَابِقُ ٱلنَّهَارِ ۚ وَكُلٌّ فِى فَلَكٍ يَسْبَحُونَ",
      "text_urdu": "اور نہ ہی سورج کو یہ شائبہ ہے کہ وہ چاند کو جا پکڑے اور نہ رات دن پر سبقت کر سکتی ہے",
      "text_urdu_translation": "یہ نہیں ہے کہ آفتاب کو یہ کہ چاند کو وہ پا لے اور نہ رات دن سے آگے بڑھ سکتی ہے",
      "surah_name_arabic": "يس",
      "surah_name_english": "Ya-Sin",
      "juz": 23,
      "manzil": 5
    }
  }
}
```

---

### ➡️ GET `/quran/words/:surah/:ayah`
**Description:** Get word-by-word data for a specific verse  
**Auth Layer:** Public  
**Controller Hook:** `quranController.getVerseWords`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `surah` (number): Surah number (1-114)
  - `ayah` (number): Ayah number

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "words": [
      {
        "word_position": 1,
        "arabic_word": "لَا",
        "transliteration": "laa",
        "global_urdu_meaning": "نہیں"
      },
      {
        "word_position": 2,
        "arabic_word": "ٱلشَّمْسُ",
        "transliteration": "ash-shamsu",
        "global_urdu_meaning": "سورج"
      }
    ]
  }
}
```

---

### ➡️ GET `/quran/verse-data/:surah/:ayah`
**Description:** Get verse in ingestion-compatible format for textbooks  
**Auth Layer:** Public  
**Controller Hook:** `quranController.getVerseForIngestion`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `surah` (number): Surah number (1-114)
  - `ayah` (number): Ayah number

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "type": "quran_verse",
    "quran_data": {
      "surah": 36,
      "ayah": 40,
      "surah_name_arabic": "يس",
      "surah_name_english": "Ya-Sin",
      "textbook_line_translation": "یہ نہیں ہے کہ آفتاب کو یہ کہ چاند کو وہ پا لے",
      "word_alignments": [
        {
          "position": 1,
          "textbook_urdu": "نہیں",
          "color_highlight": null
        },
        {
          "position": 2,
          "textbook_urdu": "سورج",
          "color_highlight": "#FFD700"
        }
      ],
      "tafsir_snippet": "یہ آیت کائناتی نظام کی درستگی کو بیان کرتی ہے"
    }
  }
}
```

---

### ➡️ GET `/quran/range/:surah/:start-:end`
**Description:** Get multiple verses for a range  
**Auth Layer:** Public  
**Controller Hook:** `quranController.getVerseRange`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `surah` (number): Surah number (1-114)
  - `start` (number): Starting ayah number
  - `end` (number): Ending ayah number

* **Example Request:**
```
GET /quran/range/36/1-5
```

---

### ➡️ GET `/quran/surahs`
**Description:** Get metadata for all 114 surahs  
**Auth Layer:** Public  
**Controller Hook:** `quranController.getSurahs`

#### 📬 Headers & Parameters

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "surahs": [
      {
        "_id": 1,
        "name_arabic": "الفاتحة",
        "name_english": "Al-Fatiha",
        "verses_count": 7
      },
      {
        "_id": 36,
        "name_arabic": "يس",
        "name_english": "Ya-Sin",
        "verses_count": 83
      }
    ]
  }
}
```

---

## 💳 Checkout & Payments

### ➡️ POST `/checkout`
**Description:** Initialize checkout for subscription purchase  
**Auth Layer:** Student JWT  
**Controller Hook:** `checkoutController.initializeCheckout`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Request Body:**
```json
{
  "planId": "premium",
  "paymentMethod": "easypaisa"
}
```

* **Available Plans:**
  - `basic`: PKR 500/month - 50 AI credits/day
  - `premium`: PKR 1200/month - Unlimited AI credits
  - `family`: PKR 2500/month - Up to 5 users, unlimited AI

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transaction_id": "TXN1234567890",
    "payment_url": "https://payment.easypaisa.com.pk/pay?token=abc123",
    "plan": {
      "id": "premium",
      "name": "Premium",
      "price": 1200,
      "currency": "PKR"
    },
    "expires_at": "2024-02-15T10:30:00.000Z"
  }
}
```

---

### ➡️ GET `/checkout`
**Description:** Get current user's subscription status  
**Auth Layer:** Student JWT  
**Controller Hook:** `checkoutController.getSubscription`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0n1",
      "user_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "plan": "premium",
      "status": "active",
      "amount": 1200,
      "currency": "PKR",
      "payment_method": "easypaisa",
      "created_at": "2024-01-15T10:30:00.000Z",
      "expires_at": "2024-02-15T10:30:00.000Z",
      "ai_credits_used_today": 25,
      "ai_credits_reset_at": "2024-01-16T00:00:00.000Z"
    }
  }
}
```

---

## 🔗 Webhooks

### ➡️ POST `/webhooks/payments`
**Description:** Handle payment gateway webhooks (EasyPaisa/JazzCash)  
**Auth Layer:** Public (requires X-Payment-Auth-Token header)  
**Controller Hook:** `webhookController.handlePaymentWebhook`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json",
  "X-Payment-Auth-Token": "<WEBHOOK_SECRET>"
}
```

* **Request Body:**
```json
{
  "transaction_id": "TXN1234567890",
  "status": "SUCCESS",
  "payment_method": "easypaisa",
  "amount": 1200,
  "currency": "PKR",
  "metadata": {
    "gateway_transaction_id": "EP987654321",
    "payment_time": "2024-01-15T10:35:00.000Z"
  }
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Payment confirmed successfully",
    "subscriptionId": "65f1a2b3c4d5e6f7g8h9i0n1",
    "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "plan": "premium"
  }
}
```

---

### ➡️ GET `/webhooks/payments`
**Description:** Check webhook transaction status (debugging)  
**Auth Layer:** Public  
**Controller Hook:** `webhookController.getWebhookStatus`

#### 📬 Headers & Parameters
* **Query Parameters:**
  - `txn` (string, required): Transaction ID

* **Example Request:**
```
GET /webhooks/payments?txn=TXN1234567890
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactionId": "TXN1234567890",
    "status": "active",
    "plan": "premium",
    "amount": 1200,
    "currency": "PKR",
    "paymentMethod": "easypaisa",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "expiresAt": "2024-02-15T10:30:00.000Z",
    "userEmail": "user@example.com"
  }
}
```

---

## 📥 Content Ingestion (Admin)

### ➡️ POST `/ingestion/book`
**Description:** Ingest a complete book with chapters and topics  
**Auth Layer:** Admin Token  
**Controller Hook:** `ingestionController.ingestBook`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <ADMIN_JWT_TOKEN>"
}
```

* **Request Body:**
```json
{
  "book": {
    "title": "Biology Class 11",
    "subject": "Biology",
    "grade": "11",
    "board_id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "program_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "edition_year": 2024
  },
  "chapters": [
    {
      "chapter_number": 1,
      "title": "Introduction to Biology",
      "slug": "introduction-to-biology",
      "student_learning_outcomes": ["Define biology", "Explain branches of biology"],
      "topics": [
        {
          "title": "What is Biology?",
          "slug": "what-is-biology",
          "display_order": 0,
          "raw_text": "Biology is the study of living organisms...",
          "clean_html": "<p>Biology is the study of living organisms...</p>",
          "content_blocks": [
            {
              "type": "heading",
              "text": "Definition of Biology",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Biology comes from Greek words bios (life) and logos (study)"
            }
          ]
        }
      ]
    }
  ]
}
```

* **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "book_id": "65f1a2b3c4d5e6f7g8h9i0o1",
    "chapters_created": 1,
    "topics_created": 1,
    "log": [
      "Book created successfully",
      "Chapter 1 created",
      "Topic 'What is Biology?' created"
    ]
  },
  "message": "Book ingested successfully"
}
```

---

### ➡️ POST `/ingestion/topics/bulk`
**Description:** Bulk upsert multiple topics  
**Auth Layer:** Admin Token  
**Controller Hook:** `ingestionController.bulkIngestTopics`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <ADMIN_JWT_TOKEN>"
}
```

* **Request Body:**
```json
{
  "topics": [
    {
      "title": "Cell Structure",
      "slug": "cell-structure",
      "chapter_id": "65f1a2b3c4d5e6f7g8h9i0j5",
      "book_id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "display_order": 1,
      "content_blocks": []
    }
  ]
}
```

---

### ➡️ GET `/ingestion/stats`
**Description:** Get ingestion statistics  
**Auth Layer:** Admin Token  
**Controller Hook:** `ingestionController.getIngestionStats`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_JWT_TOKEN>"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_books": 45,
    "total_chapters": 540,
    "total_topics": 6480,
    "ingestion_status": {
      "complete": 6400,
      "processing": 50,
      "pending": 20,
      "error": 10
    }
  }
}
```

---

## 🧩 Dart Model Classes

Here are ready-to-use Flutter/Dart model classes for JSON serialization:

### Book Model
```dart
import 'package:json_annotation/json_annotation.dart';

part 'book.g.dart';

@JsonSerializable()
class Book {
  final String id;
  final String title;
  final String slug;
  final String subject;
  final String subjectSlug;
  final String grade;
  final int editionYear;
  final BookMetadata? metadata;
  final BookSeo? seo;
  final int totalChapters;
  final bool isLive;
  final bool isPublic;
  final BoardInfo? boardId;
  final String? boardShortCode;
  final String? boardSlug;

  Book({
    required this.id,
    required this.title,
    required this.slug,
    required this.subject,
    required this.subjectSlug,
    required this.grade,
    required this.editionYear,
    this.metadata,
    this.seo,
    required this.totalChapters,
    required this.isLive,
    required this.isPublic,
    this.boardId,
    this.boardShortCode,
    this.boardSlug,
  });

  factory Book.fromJson(Map<String, dynamic> json) => _$BookFromJson(json);
  Map<String, dynamic> toJson() => _$BookToJson(this);
}

@JsonSerializable()
class BookMetadata {
  final List<String>? authors;
  final String? publisher;
  final String? isbn;
  final int? totalPages;
  final String? language;

  BookMetadata({
    this.authors,
    this.publisher,
    this.isbn,
    this.totalPages,
    this.language,
  });

  factory BookMetadata.fromJson(Map<String, dynamic> json) => 
      _$BookMetadataFromJson(json);
  Map<String, dynamic> toJson() => _$BookMetadataToJson(this);
}

@JsonSerializable()
class BoardInfo {
  final String id;
  final String name;
  final String slug;
  final String shortCode;

  BoardInfo({
    required this.id,
    required this.name,
    required this.slug,
    required this.shortCode,
  });

  factory BoardInfo.fromJson(Map<String, dynamic> json) => 
      _$BoardInfoFromJson(json);
  Map<String, dynamic> toJson() => _$BoardInfoToJson(this);
}
```

### Chapter Model
```dart
@JsonSerializable()
class Chapter {
  final String id;
  final String title;
  final String slug;
  final int chapterNumber;
  final String? chapterNumberDisplay;
  final String bookId;
  final List<String> studentLearningOutcomes;
  final String? summary;
  final int? pageStart;
  final int? pageEnd;
  final int totalTopics;
  final bool isLive;
  final int displayOrder;

  Chapter({
    required this.id,
    required this.title,
    required this.slug,
    required this.chapterNumber,
    this.chapterNumberDisplay,
    required this.bookId,
    required this.studentLearningOutcomes,
    this.summary,
    this.pageStart,
    this.pageEnd,
    required this.totalTopics,
    required this.isLive,
    required this.displayOrder,
  });

  factory Chapter.fromJson(Map<String, dynamic> json) => _$ChapterFromJson(json);
  Map<String, dynamic> toJson() => _$ChapterToJson(this);
}
```

### Topic Model
```dart
@JsonSerializable()
class Topic {
  final String id;
  final String title;
  final String? titleUrdu;
  final String slug;
  final String? topicNumber;
  final int displayOrder;
  final String difficulty;
  final int estimatedReadTime;
  final String rawText;
  final String cleanHtml;
  final List<ContentBlock> contentBlocks;
  final List<Formula>? formulas;
  final List<KeyTerm>? keyTerms;
  final List<BookMcq>? bookMcqs;
  final List<String>? bookShortQuestions;
  final List<BookProblem>? bookProblems;
  final List<String> keywords;
  final QuranReference? quranReference;
  final List<QuranWordAlignment>? quranWordAlignments;
  final String? quranTextbookTranslation;
  final String? quranTextbookTafsir;
  final UserProgress? userProgress;

  Topic({
    required this.id,
    required this.title,
    this.titleUrdu,
    required this.slug,
    this.topicNumber,
    required this.displayOrder,
    required this.difficulty,
    required this.estimatedReadTime,
    required this.rawText,
    required this.cleanHtml,
    required this.contentBlocks,
    this.formulas,
    this.keyTerms,
    this.bookMcqs,
    this.bookShortQuestions,
    this.bookProblems,
    required this.keywords,
    this.quranReference,
    this.quranWordAlignments,
    this.quranTextbookTranslation,
    this.quranTextbookTafsir,
    this.userProgress,
  });

  factory Topic.fromJson(Map<String, dynamic> json) => _$TopicFromJson(json);
  Map<String, dynamic> toJson() => _$TopicToJson(this);
}

@JsonSerializable()
class ContentBlock {
  final String type;
  final String? text;
  final String? html;
  final int? level;
  final String? latex;
  final String? formulaLabel;
  final String? src;
  final String? alt;
  final String? caption;
  final String? variant;
  final String? title;
  final String? problem;
  final String? solution;
  final List<String>? steps;
  final String? question;
  final List<String>? options;
  final String? correctAnswer;
  final String? explanation;
  final QuranData? quranData;
  final int blockOrder;

  ContentBlock({
    required this.type,
    this.text,
    this.html,
    this.level,
    this.latex,
    this.formulaLabel,
    this.src,
    this.alt,
    this.caption,
    this.variant,
    this.title,
    this.problem,
    this.solution,
    this.steps,
    this.question,
    this.options,
    this.correctAnswer,
    this.explanation,
    this.quranData,
    required this.blockOrder,
  });

  factory ContentBlock.fromJson(Map<String, dynamic> json) => 
      _$ContentBlockFromJson(json);
  Map<String, dynamic> toJson() => _$ContentBlockToJson(this);
}
```

### UserProgress Model
```dart
@JsonSerializable()
class UserProgress {
  final String id;
  final String userId;
  final String topicId;
  final bool isRead;
  final int scrollDepthPercent;
  final int timeSpentSeconds;
  final int quizAttempts;
  final int highestQuizScore;
  final String masteryStatus;
  final int progressPercent;
  final int xpEarned;
  final DateTime lastAccessed;

  UserProgress({
    required this.id,
    required this.userId,
    required this.topicId,
    required this.isRead,
    required this.scrollDepthPercent,
    required this.timeSpentSeconds,
    required this.quizAttempts,
    required this.highestQuizScore,
    required this.masteryStatus,
    required this.progressPercent,
    required this.xpEarned,
    required this.lastAccessed,
  });

  factory UserProgress.fromJson(Map<String, dynamic> json) => 
      _$UserProgressFromJson(json);
  Map<String, dynamic> toJson() => _$UserProgressToJson(this);
}
```

### UserVault Model
```dart
@JsonSerializable()
class UserVaultItem {
  final String id;
  final String topicTitle;
  final String itemType; // flashcard, video_link, bookmark, note, highlight
  final VaultContent content;
  final DateTime createdAt;
  final String topicId;

  UserVaultItem({
    required this.id,
    required this.topicTitle,
    required this.itemType,
    required this.content,
    required this.createdAt,
    required this.topicId,
  });

  factory UserVaultItem.fromJson(Map<String, dynamic> json) => 
      _$UserVaultItemFromJson(json);
  Map<String, dynamic> toJson() => _$UserVaultItemToJson(this);
}

@JsonSerializable()
class VaultContent {
  final String? front;
  final String? back;
  final bool? isAiGenerated;
  final String? url;
  final String? videoTitle;
  final String? thumbnailUrl;
  final String? platform;
  final String? text;
  final int? blockOrder;
  final String? color;

  VaultContent({
    this.front,
    this.back,
    this.isAiGenerated,
    this.url,
    this.videoTitle,
    this.thumbnailUrl,
    this.platform,
    this.text,
    this.blockOrder,
    this.color,
  });

  factory VaultContent.fromJson(Map<String, dynamic> json) => 
      _$VaultContentFromJson(json);
  Map<String, dynamic> toJson() => _$VaultContentToJson(this);
}
```

### Quiz Models
```dart
@JsonSerializable()
class Quiz {
  final String id;
  final String topicId;
  final List<QuizQuestion> questions;
  final int totalQuestions;
  final int? timeLimitSeconds;

  Quiz({
    required this.id,
    required this.topicId,
    required this.questions,
    required this.totalQuestions,
    this.timeLimitSeconds,
  });

  factory Quiz.fromJson(Map<String, dynamic> json) => _$QuizFromJson(json);
  Map<String, dynamic> toJson() => _$QuizToJson(this);
}

@JsonSerializable()
class QuizQuestion {
  final String id;
  final String question;
  final List<String> options;
  final String? correctAnswer;
  final String? explanation;
  final String difficulty;

  QuizQuestion({
    required this.id,
    required this.question,
    required this.options,
    this.correctAnswer,
    this.explanation,
    required this.difficulty,
  });

  factory QuizQuestion.fromJson(Map<String, dynamic> json) => 
      _$QuizQuestionFromJson(json);
  Map<String, dynamic> toJson() => _$QuizQuestionToJson(this);
}
```

### User Model
```dart
@JsonSerializable()
class User {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? avatarUrl;
  final bool isVerified;
  final StudentProfile? studentProfile;
  final Subscription? subscription;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.avatarUrl,
    required this.isVerified,
    this.studentProfile,
    this.subscription,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}

@JsonSerializable()
class StudentProfile {
  final String? boardId;
  final String? grade;
  final String? classLevel;
  final String medium;
  final bool onboardingCompleted;
  final int xpTotal;
  final int streakDays;
  final DateTime? lastActive;

  StudentProfile({
    this.boardId,
    this.grade,
    this.classLevel,
    required this.medium,
    required this.onboardingCompleted,
    required this.xpTotal,
    required this.streakDays,
    this.lastActive,
  });

  factory StudentProfile.fromJson(Map<String, dynamic> json) => 
      _$StudentProfileFromJson(json);
  Map<String, dynamic> toJson() => _$StudentProfileToJson(this);
}

@JsonSerializable()
class Subscription {
  final String plan;
  final String status;
  final DateTime? expiresAt;
  final int aiCreditsUsedToday;
  final DateTime? aiCreditsResetAt;

  Subscription({
    required this.plan,
    required this.status,
    this.expiresAt,
    required this.aiCreditsUsedToday,
    this.aiCreditsResetAt,
  });

  factory Subscription.fromJson(Map<String, dynamic> json) => 
      _$SubscriptionFromJson(json);
  Map<String, dynamic> toJson() => _$SubscriptionToJson(this);
}
```

---

## 📝 Notes for Flutter Team

1. **Authentication Flow:**
   - Store JWT tokens securely using `flutter_secure_storage`
   - Attach `Authorization: Bearer <token>` header to all authenticated requests
   - Handle token expiration with refresh token flow

2. **Error Handling:**
   - All errors follow the standard format: `{ success: false, error: { code, message } }`
   - Common error codes: `VALIDATION_ERROR`, `NOT_FOUND`, `UNAUTHORIZED`, `FORBIDDEN`

3. **Streaming AI Responses:**
   - Use Server-Sent Events (SSE) for streaming explanations
   - Set `Content-Type: text/event-stream` header
   - Parse `data: {...}` chunks until `[DONE]`

4. **Rate Limiting:**
   - AI endpoints have stricter rate limits
   - Implement exponential backoff for 429 responses

5. **Image Assets:**
   - All image URLs are absolute (CDN-hosted)
   - Support both light/dark mode with CSS filters if needed

6. **Quran Content:**
   - Arabic text requires proper RTL rendering
   - Use specialized fonts for Quranic Arabic (e.g., KFGQPC Uthmanic Script)

---

**Generated from:** backend-ebook repository source code analysis  
**Contact:** For API issues or questions, refer to the backend repository issues
