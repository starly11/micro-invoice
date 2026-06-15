# 📱 StudyVault E-Book Platform - Flutter API Specification

**Generated:** June 2025  
**Backend Repository:** https://github.com/MAGMA3C/backend-ebook  
**Base URL:** `https://api.studyvault.pk/api/v1` (Production) / `http://localhost:5000/api/v1` (Development)

---

## 🔐 Authentication Overview

All authenticated endpoints require JWT tokens in the Authorization header.

### Token Types
| Token Type | Header Value | Usage |
|------------|--------------|-------|
| Student JWT | `Bearer <JWT_ACCESS_TOKEN>` | Student/Parent accounts |
| Admin Token | `Bearer <ADMIN_JWT_TOKEN>` | Admin/Superadmin accounts |

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
    "message": "Human readable error message"
  }
}
```

---

## 📚 Table of Contents

1. [Authentication](#authentication)
2. [Books](#books)
3. [Chapters](#chapters)
4. [Topics](#topics)
5. [User Progress](#user-progress)
6. [Vault (Bookmarks)](#vault-bookmarks)
7. [Quizzes](#quizzes)
8. [AI Features](#ai-features)
9. [Search](#search)
10. [Dashboard](#dashboard)
11. [Quran Resources](#quran-resources)
12. [Data Models](#data-models)

---

## 🔐 Authentication

### ➡️ POST `/api/v1/auth/login`
**Description:** Admin login with hardcoded credentials (for development). Students use Google OAuth or dev-login.
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
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  },
  "message": "Admin login successful"
}
```

---

### ➡️ POST `/api/v1/auth/dev-login`
**Description:** Development-only login endpoint. Creates user if doesn't exist. Auto-promotes to admin if email contains 'admin'.
**Auth Layer:** Public
**Controller Hook:** `authController.devLogin`

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
  "email": "dev@studyvault.pk",
  "name": "Dev User"
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "67890abcdef1234567890123",
      "name": "Dev User",
      "email": "dev@studyvault.pk",
      "role": "student"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  },
  "message": "Dev login OK"
}
```

---

### ➡️ GET `/api/v1/auth/getMe`
**Description:** Get current authenticated user profile with full details including subscription and student_profile.
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
    "_id": "67890abcdef1234567890123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatar_url": "https://lh3.googleusercontent.com/...",
    "is_verified": true,
    "student_profile": {
      "board_id": "600000000000000000000002",
      "grade": "10",
      "class": "Class 10",
      "onboarding_completed": true,
      "xp_total": 150,
      "streak_days": 5,
      "last_active": "2025-06-15T10:30:00.000Z"
    },
    "subscription": {
      "plan": "free",
      "status": "active",
      "expires_at": null,
      "ai_credits_used_today": 0,
      "ai_credits_reset_at": "2025-06-15T00:00:00.000Z"
    }
  },
  "message": "User retrieved"
}
```

---

### ➡️ POST `/api/v1/auth/onboarding`
**Description:** Complete student onboarding by setting board, grade, and class information.
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
      "_id": "67890abcdef1234567890123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
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

### ➡️ POST `/api/v1/auth/logout`
**Description:** Logout user by clearing session cookie (optional, client-side token removal is primary method).
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

### ➡️ GET `/api/v1/books`
**Description:** Get all books with optional filtering by board, program, class level, subject, grade, and edition year. Supports flexible grade matching.
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
  - `boardId` (string): Filter by board ObjectId
  - `programId` (string): Filter by program ObjectId
  - `classLevel` (string): Filter by class level
  - `subject` (string): Filter by subject slug (case-insensitive)
  - `grade` (string): Flexible grade matching (e.g., "10", "Class 10", "Grade 10")
  - `editionYear` (number): Filter by edition year
  - `board` (string): Board short code or slug for dynamic resolution

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "_id": "600000000000000000000010",
        "title": "Physics Class 10",
        "slug": "physics-class-10",
        "subject": "Physics",
        "subject_slug": "physics",
        "grade": "10",
        "edition_year": 2025,
        "metadata": {
          "authors": ["Dr. Author"],
          "publisher": "Publisher Name",
          "language": "english"
        },
        "seo": {
          "meta_title": "Physics Class 10",
          "meta_description": "Complete Physics textbook for Class 10",
          "keywords": ["physics", "class 10"]
        },
        "total_chapters": 12,
        "is_live": true,
        "is_public": true,
        "board_id": {
          "_id": "600000000000000000000002",
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

### ➡️ GET `/api/v1/books/:id`
**Description:** Get single book by MongoDB ObjectId.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `bookController.getBook`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Path Parameters:**
  - `id` (string): Book MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "600000000000000000000010",
    "title": "Physics Class 10",
    "slug": "physics-class-10",
    "subject": "Physics",
    "subject_slug": "physics",
    "grade": "10",
    "edition_year": 2025,
    "program_id": "600000000000000000000005",
    "board_id": {
      "_id": "600000000000000000000002",
      "name": "Federal Board",
      "slug": "fbise"
    },
    "total_chapters": 12,
    "is_live": true
  }
}
```

---

### ➡️ GET `/api/v1/books/slug/:slug`
**Description:** Get book by slug with optional edition year filter.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `bookController.getBookBySlug`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Path Parameters:**
  - `slug` (string): Book slug (e.g., "physics-class-10")

* **Query Parameters:**
  - `editionYear` (number): Filter by specific edition year

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "600000000000000000000010",
    "title": "Physics Class 10",
    "slug": "physics-class-10",
    "edition_year": 2025
  }
}
```

---

### ➡️ GET `/api/v1/books/:id/chapters`
**Description:** Get all chapters for a specific book, sorted by chapter number. Includes learning outcomes and summaries.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `bookController.getBookChapters`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Path Parameters:**
  - `id` (string): Book MongoDB ObjectId (router uses `:id` parameter)

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "book_id": "600000000000000000000010",
    "chapters": [
      {
        "_id": "600000000000000000000020",
        "chapter_number": 1,
        "chapter_number_display": "Chapter 1",
        "title": "Simple Harmonic Motion",
        "slug": "simple-harmonic-motion",
        "page_start": 1,
        "page_end": 15,
        "student_learning_outcomes": [
          "Define SHM",
          "Explain characteristics of SHM"
        ],
        "chapter_summary": "Introduction to Simple Harmonic Motion and its properties",
        "display_order": 0,
        "seo": {
          "meta_title": "Simple Harmonic Motion",
          "meta_description": "Learn about SHM",
          "keywords": ["SHM", "physics"]
        },
        "total_topics": 8,
        "is_live": true
      }
    ],
    "total_chapters": 12
  }
}
```

---

### ➡️ POST `/api/v1/books`
**Description:** Create a new book (Admin only).
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
  "title": "Chemistry Class 11",
  "subject_slug": "chemistry",
  "grade": "11",
  "edition_year": 2025,
  "program_id": "600000000000000000000005",
  "board_id": "600000000000000000000002",
  "metadata": {
    "authors": ["Author Name"],
    "publisher": "Publisher",
    "language": "english"
  }
}
```

---

### ➡️ PUT `/api/v1/books/:id`
**Description:** Update an existing book (Admin only).
**Auth Layer:** Admin Token
**Controller Hook:** `bookController.updateBook`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <ADMIN_JWT_TOKEN>"
}
```

* **Path Parameters:**
  - `id` (string): Book MongoDB ObjectId

* **Request Body:** (Partial update allowed)
```json
{
  "title": "Updated Title",
  "is_live": true
}
```

---

### ➡️ DELETE `/api/v1/books/:id`
**Description:** Delete a book and cascade delete related chapters/topics (Admin only).
**Auth Layer:** Admin Token
**Controller Hook:** `bookController.deleteBook`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_JWT_TOKEN>"
}
```

* **Path Parameters:**
  - `id` (string): Book MongoDB ObjectId

---

## 📖 Chapters

### ➡️ GET `/api/v1/chapters/:id`
**Description:** Get chapter details by MongoDB ObjectId.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `chapterController.getChapter`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Path Parameters:**
  - `id` (string): Chapter MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "600000000000000000000020",
    "title": "Simple Harmonic Motion",
    "slug": "simple-harmonic-motion",
    "chapter_number": 1,
    "book_id": "600000000000000000000010",
    "student_learning_outcomes": ["Define SHM"],
    "summary": "Introduction to SHM",
    "total_topics": 8,
    "is_live": true
  }
}
```

---

### ➡️ GET `/api/v1/chapters/slug/:slug`
**Description:** Get chapter by slug within a specific book.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `chapterController.getChapterBySlug`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Path Parameters:**
  - `slug` (string): Chapter slug

* **Query Parameters:**
  - `bookId` (string, required): Book MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "600000000000000000000020",
    "title": "Simple Harmonic Motion",
    "slug": "simple-harmonic-motion",
    "chapter_number": 1
  }
}
```

---

### ➡️ GET `/api/v1/chapters/book/:bookId`
**Description:** Get all chapters for a book (alternative endpoint).
**Auth Layer:** Public (optional auth)
**Controller Hook:** `chapterController.getBookChapters`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Path Parameters:**
  - `bookId` (string): Book MongoDB ObjectId

---

### ➡️ GET `/api/v1/chapters/:chapterId/topics`
**Description:** Get all topics for a chapter, sorted by display_order.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `chapterController.getChapterTopics`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Path Parameters:**
  - `chapterId` (string): Chapter MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "chapter_id": "600000000000000000000020",
    "topics": [
      {
        "_id": "600000000000000000000030",
        "title": "Introduction to SHM",
        "slug": "introduction-to-shm",
        "display_order": 0,
        "is_live": true
      }
    ],
    "total_topics": 8
  }
}
```

---

### ➡️ POST `/api/v1/chapters`
**Description:** Create a new chapter (Admin only).
**Auth Layer:** Admin Token
**Controller Hook:** `chapterController.createChapter`

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
  "title": "New Chapter",
  "chapter_number": 5,
  "book_id": "600000000000000000000010",
  "student_learning_outcomes": ["Learning outcome 1"]
}
```

---

### ➡️ PUT `/api/v1/chapters/:id`
**Description:** Update a chapter (Admin only).
**Auth Layer:** Admin Token
**Controller Hook:** `chapterController.updateChapter`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <ADMIN_JWT_TOKEN>"
}
```

* **Path Parameters:**
  - `id` (string): Chapter MongoDB ObjectId

---

### ➡️ DELETE `/api/v1/chapters/:id`
**Description:** Delete a chapter and cascade delete all topics (Admin only).
**Auth Layer:** Admin Token
**Controller Hook:** `chapterController.deleteChapter`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_JWT_TOKEN>"
}
```

* **Path Parameters:**
  - `id` (string): Chapter MongoDB ObjectId

---

## 📄 Topics

### ➡️ GET `/api/v1/topics/:id`
**Description:** Get complete topic with all content blocks, formulas, MCQs, questions, and user progress.
**Auth Layer:** Public (optional auth for user_progress)
**Controller Hook:** `topicController.getTopic`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional for user_progress
}
```

* **Path Parameters:**
  - `id` (string): Topic MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "600000000000000000000030",
    "title": "Introduction to SHM",
    "title_urdu": "ایس ایچ ایم کا تعارف",
    "slug": "introduction-to-shm",
    "topic_number": "1.1",
    "display_order": 0,
    "difficulty": "medium",
    "estimated_read_time": 5,
    "edition_year": 2025,
    "raw_text": "Raw text content...",
    "clean_html": "<p>Clean HTML content...</p>",
    "content_blocks": [
      {
        "type": "heading",
        "text": "Introduction",
        "level": 1,
        "block_order": 0
      },
      {
        "type": "paragraph",
        "text": "Simple Harmonic Motion is...",
        "block_order": 1
      },
      {
        "type": "formula",
        "latex": "F = -kx",
        "formula_label": "Equation 1.1",
        "block_order": 2
      },
      {
        "type": "mcq",
        "question": "What is SHM?",
        "options": ["Option A", "Option B"],
        "correct_answer": "Option A",
        "explanation": "Explanation here",
        "block_order": 3
      }
    ],
    "rendered_content_blocks": [],
    "formulas": [
      {
        "latex": "F = -kx",
        "label": "Hooke's Law",
        "plain_text": "F equals negative k x"
      }
    ],
    "key_terms": [
      {
        "term": "Amplitude",
        "definition": "Maximum displacement"
      }
    ],
    "book_mcqs": [
      {
        "question": "MCQ from book",
        "options": ["A", "B", "C", "D"],
        "correct_answer": "A",
        "explanation": "Why A is correct"
      }
    ],
    "book_short_questions": ["Question 1", "Question 2"],
    "book_problems": [
      {
        "problem": "Solve this problem",
        "answer": "Solution",
        "steps": ["Step 1", "Step 2"]
      }
    ],
    "keywords": ["shm", "physics", "oscillation"],
    "quran_reference": null,
    "quran_word_alignments": [],
    "quran_textbook_translation": "",
    "quran_textbook_tafsir": "",
    "seo": {
      "meta_title": "Introduction to SHM",
      "meta_description": "Learn about SHM",
      "keywords": ["shm"],
      "source_page": 5
    },
    "user_progress": {
      "is_read": false,
      "scroll_depth_percent": 0,
      "progress_percent": 0,
      "mastery_status": "locked"
    }
  }
}
```

---

### ➡️ GET `/api/v1/topics/slug/:slug`
**Description:** Get topic by single slug lookup.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `topicController.getTopicBySlug`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Path Parameters:**
  - `slug` (string): Topic slug

---

### ➡️ GET `/api/v1/topics/by-nested-slug/:boardSlug/:programSlug/:subjectSlug/:chapterSlug/:topicSlug`
**Description:** Get topic using full nested slug path for SEO-friendly URLs. Returns topic with chapter context.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `topicController.getNestedTopic`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Path Parameters:**
  - `boardSlug` (string): Board slug (e.g., "fbise")
  - `programSlug` (string): Program slug (e.g., "matric")
  - `subjectSlug` (string): Subject slug (e.g., "physics")
  - `chapterSlug` (string): Chapter slug (e.g., "simple-harmonic-motion")
  - `topicSlug` (string): Topic slug (e.g., "introduction-to-shm")

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "topic": {
      "_id": "600000000000000000000030",
      "title": "Introduction to SHM",
      "slug": "introduction-to-shm",
      "content_blocks": [...],
      "user_progress": null
    },
    "chapter": {
      "_id": "600000000000000000000020",
      "title": "Simple Harmonic Motion",
      "slug": "simple-harmonic-motion",
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

### ➡️ GET `/api/v1/topics/chapter/:chapterId`
**Description:** Get all topics for a chapter sorted by display_order.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `topicController.getTopicsByChapter`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Path Parameters:**
  - `chapterId` (string): Chapter MongoDB ObjectId

---

### ➡️ GET `/api/v1/topics/:id/adjacent`
**Description:** Get previous and next topics for navigation purposes.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `topicController.getAdjacentTopics`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Path Parameters:**
  - `id` (string): Topic MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "current": {
      "_id": "600000000000000000000030",
      "title": "Current Topic",
      "slug": "current-topic"
    },
    "previous": {
      "_id": "600000000000000000000029",
      "title": "Previous Topic",
      "slug": "previous-topic"
    },
    "next": {
      "_id": "600000000000000000000031",
      "title": "Next Topic",
      "slug": "next-topic"
    }
  }
}
```

---

### ➡️ GET `/api/v1/topics/search`
**Description:** Search topics by query string with optional filters.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `topicController.searchTopics`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Query Parameters:**
  - `q` (string, required): Search query
  - `limit` (number): Max results (default: 20)
  - `boardId` (string): Filter by board
  - `programId` (string): Filter by program
  - `classLevel` (string): Filter by class level

* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "600000000000000000000030",
      "title": "Introduction to SHM",
      "slug": "introduction-to-shm",
      "chapter_title": "Simple Harmonic Motion"
    }
  ]
}
```

---

### ➡️ GET `/api/v1/topics/hot`
**Description:** Get trending/hot topics based on exam frequency.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `topicController.getHotTopics`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Query Parameters:**
  - `limit` (number): Max results (default: 10)

---

## 📊 User Progress

### ➡️ GET `/api/v1/progress/stats`
**Description:** Get user's overall progress statistics including total topics, completion rate, XP, etc.
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
    "total_topics_read": 25,
    "completion_rate": 45.5,
    "total_xp": 500,
    "topics_mastered": 10,
    "average_quiz_score": 78.5
  }
}
```

---

### ➡️ GET `/api/v1/progress/recent`
**Description:** Get user's recent activity history.
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
      "topic_id": "600000000000000000000030",
      "topic_title": "Introduction to SHM",
      "last_accessed": "2025-06-15T10:30:00.000Z",
      "progress_percent": 100,
      "xp_earned": 20
    }
  ]
}
```

---

### ➡️ GET `/api/v1/progress/streak`
**Description:** Get user's learning streak data.
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
    "current_streak": 5,
    "longest_streak": 12,
    "last_active": "2025-06-15T10:30:00.000Z"
  }
}
```

---

### ➡️ GET `/api/v1/progress/:topicId`
**Description:** Get progress for a specific topic.
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
    "user_id": "67890abcdef1234567890123",
    "topic_id": "600000000000000000000030",
    "is_read": true,
    "scroll_depth_percent": 85,
    "time_spent_seconds": 300,
    "quiz_attempts": 2,
    "highest_quiz_score": 90,
    "mastery_status": "in_progress",
    "progress_percent": 75,
    "xp_earned": 15,
    "last_accessed": "2025-06-15T10:30:00.000Z"
  }
}
```

---

### ➡️ PUT `/api/v1/progress/:topicId`
**Description:** Update progress for a topic (scroll depth, time spent, etc.).
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
  "scroll_depth_percent": 75,
  "time_spent_seconds": 300
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "topic_id": "600000000000000000000030",
    "progress_percent": 75,
    "updated_at": "2025-06-15T10:30:00.000Z"
  }
}
```

---

### ➡️ POST `/api/v1/progress/:topicId/complete`
**Description:** Mark a topic as completed (100% progress).
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
    "topic_id": "600000000000000000000030",
    "progress_percent": 100,
    "mastery_status": "mastered",
    "xp_earned": 20
  },
  "message": "Topic marked as completed"
}
```

---

## 🔖 Vault (Bookmarks)

### ➡️ GET `/api/v1/vault`
**Description:** Get all user's vault items (flashcards, bookmarks, notes, highlights, videos).
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
    "user_id": "67890abcdef1234567890123",
    "items_count": 15,
    "items": [
      {
        "_id": "600000000000000000000040",
        "topicTitle": "Introduction to SHM",
        "itemType": "flashcard",
        "content": {
          "front": "What is SHM?",
          "back": "Simple Harmonic Motion is...",
          "is_ai_generated": true
        },
        "createdAt": "2025-06-15T10:30:00.000Z",
        "topicId": "600000000000000000000030"
      }
    ]
  }
}
```

---

### ➡️ GET `/api/v1/vault/stats`
**Description:** Get vault statistics (counts by type).
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
    "total_items": 15,
    "flashcards": 10,
    "bookmarks": 3,
    "notes": 2
  }
}
```

---

### ➡️ POST `/api/v1/vault/:topicId`
**Description:** Add a topic to user's vault (bookmark).
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
    "user_id": "67890abcdef1234567890123",
    "topic_id": "600000000000000000000030",
    "type": "bookmark"
  },
  "message": "Topic added to vault"
}
```

---

### ➡️ DELETE `/api/v1/vault/:topicId`
**Description:** Remove a topic from user's vault.
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
    "user_id": "67890abcdef1234567890123",
    "topic_id": "600000000000000000000030"
  },
  "message": "Topic removed from vault"
}
```

---

### ➡️ GET `/api/v1/vault/:topicId/status`
**Description:** Check if a topic is in user's vault.
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

## 🎯 Quizzes

### ➡️ GET `/api/v1/quizzes/:id`
**Description:** Get quiz details by ID.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `quizController.getQuiz`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Path Parameters:**
  - `id` (string): Quiz MongoDB ObjectId

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "600000000000000000000050",
    "topic_id": "600000000000000000000030",
    "questions": [
      {
        "id": "q1",
        "question": "What is SHM?",
        "options": ["A", "B", "C", "D"],
        "correct_answer": "A",
        "difficulty": "easy"
      }
    ],
    "total_questions": 10
  }
}
```

---

### ➡️ GET `/api/v1/quizzes/topic/:topicId`
**Description:** Get all quizzes for a specific topic.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `quizController.getQuizzesByTopic`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Path Parameters:**
  - `topicId` (string): Topic MongoDB ObjectId

---

### ➡️ GET `/api/v1/quizzes/topic/:topicId/random`
**Description:** Get random quiz questions generated by AI for a topic.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `quizController.getRandomQuiz`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

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
        "id": "q1",
        "question": "AI-generated question",
        "options": ["A", "B", "C", "D"],
        "correct_answer": "A",
        "explanation": "Why A is correct"
      }
    ]
  }
}
```

---

### ➡️ POST `/api/v1/quizzes/:id/submit`
**Description:** Submit quiz answers and get results.
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
      "selected": "A",
      "timeSpent": 15
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
    "time_spent": 120,
    "answers": [...]
  }
}
```

---

### ➡️ POST `/api/v1/quizzes`
**Description:** Create a new quiz (Admin only).
**Auth Layer:** Admin Token
**Controller Hook:** `quizController.createQuiz`

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
  "topic_id": "600000000000000000000030",
  "questions": [...],
  "total_questions": 10
}
```

---

## 🤖 AI Features

### ➡️ POST `/api/v1/ai/:topicId/explain`
**Description:** Generate AI explanation for a topic. Supports streaming responses.
**Auth Layer:** Student JWT
**Controller Hook:** `aiController.generateExplanation`

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

* **Query Parameters:**
  - `stream` (boolean): Enable SSE streaming (default: false)

* **Request Body (optional):**
```json
{
  "language": "en" // or "ur"
}
```

* **Response (200 OK - Non-streaming):**
```json
{
  "success": true,
  "data": {
    "explanation": "AI-generated detailed explanation of the topic..."
  }
}
```

* **Response (200 OK - Streaming):**
```
Content-Type: text/event-stream

data: {"chunk": "AI explanation "}
data: {"chunk": "continues here..."}
data: [DONE]
```

---

### ➡️ POST `/api/v1/ai/:topicId/quiz`
**Description:** Generate AI quiz questions for a topic.
**Auth Layer:** Student JWT
**Controller Hook:** `aiController.generateQuizQuestions`

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

* **Query Parameters:**
  - `count` (number): Number of questions (default: 5)

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "q1",
        "question": "AI-generated question",
        "options": ["A", "B", "C", "D"],
        "correct_answer": "A",
        "explanation": "Detailed explanation"
      }
    ]
  }
}
```

---

### ➡️ POST `/api/v1/ai/:topicId/flashcards`
**Description:** Generate AI flashcards for a topic.
**Auth Layer:** Student JWT
**Controller Hook:** `aiController.generateFlashcards`

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

* **Query Parameters:**
  - `count` (number): Number of flashcards (default: 10)

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "flashcards": [
      {
        "front": "What is SHM?",
        "back": "Simple Harmonic Motion is a type of periodic motion..."
      }
    ]
  }
}
```

---

### ➡️ GET `/api/v1/ai/credits`
**Description:** Check user's remaining AI credits for the day.
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
    "credits_remaining": 5,
    "daily_limit": 10,
    "reset_at": "2025-06-16T00:00:00.000Z"
  }
}
```

---

## 🔍 Search

### ➡️ GET `/api/v1/search`
**Description:** Global search across books, chapters, and topics.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `searchController.globalSearch`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Query Parameters:**
  - `q` (string): Search query
  - `type` (string): Filter by type (book, chapter, topic)
  - `limit` (number): Max results

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "books": [...],
    "chapters": [...],
    "topics": [...]
  }
}
```

---

### ➡️ GET `/api/v1/search/filtered`
**Description:** Advanced search with multiple filters.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `searchController.searchWithFilters`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Query Parameters:** (All optional)
  - `q` (string): Search query
  - `boardId` (string): Filter by board
  - `programId` (string): Filter by program
  - `classLevel` (string): Filter by class
  - `subject` (string): Filter by subject

---

### ➡️ GET `/api/v1/search/suggestions`
**Description:** Get search suggestions/autocomplete.
**Auth Layer:** Public (optional auth)
**Controller Hook:** `searchController.getSearchSuggestions`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>" // Optional
}
```

* **Query Parameters:**
  - `q` (string): Partial query
  - `limit` (number): Max suggestions (default: 5)

* **Response (200 OK):**
```json
{
  "success": true,
  "data": ["Simple Harmonic Motion", "SHM equations", "SHM examples"]
}
```

---

## 📈 Dashboard

### ➡️ GET `/api/v1/dashboard/student`
**Description:** Get personalized student dashboard data (recent activity, recommendations, stats).
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
    "recent_topics": [...],
    "recommended_topics": [...],
    "stats": {
      "total_xp": 500,
      "streak_days": 5,
      "topics_completed": 25
    }
  }
}
```

---

### ➡️ GET `/api/v1/dashboard/admin`
**Description:** Get admin dashboard metrics (users, content stats, etc.).
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
    "total_users": 1500,
    "active_users_today": 250,
    "total_books": 45,
    "total_topics": 1200
  }
}
```

---

### ➡️ GET `/api/v1/dashboard/admin/content-health`
**Description:** Get content health metrics for admin review.
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
    "draft_topics": 50,
    "pending_review": 20,
    "published_topics": 1130
  }
}
```

---

## 📖 Quran Resources

### ➡️ GET `/api/v1/quran/verses/:surah`
**Description:** Get all verses for a specific Surah (without word-by-word data for performance).
**Auth Layer:** Public
**Controller Hook:** `quranController.getVersesBySurah`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json"
}
```

* **Path Parameters:**
  - `surah` (number): Surah number (1-114)

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "verses": [
      {
        "_id": "...",
        "surah": 1,
        "ayah": 1,
        "text_indopak": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        "text_uthmani": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        "text_urdu_translation": "شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے",
        "text_english_translation": "In the name of Allah, the Entirely Merciful, the Especially Merciful."
      }
    ]
  }
}
```

---

### ➡️ GET `/api/v1/quran/verses/:surah/words`
**Description:** Get verses with word-by-word data for a Surah.
**Auth Layer:** Public
**Controller Hook:** `quranController.getVersesWithWords`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `surah` (number): Surah number (1-114)

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "verses": [
      {
        "surah": 1,
        "ayah": 1,
        "words": [
          {
            "position": 1,
            "text_uthmani": "بِسْمِ",
            "transliteration": "bis'mi",
            "text_urdu": "نام سے"
          }
        ]
      }
    ]
  }
}
```

---

### ➡️ GET `/api/v1/quran/verse/:surah/:ayah`
**Description:** Get a specific verse by Surah and Ayah number.
**Auth Layer:** Public
**Controller Hook:** `quranController.getVerse`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `surah` (number): Surah number (1-114)
  - `ayah` (number): Ayah number

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "verse": {
      "surah": 1,
      "ayah": 1,
      "text_indopak": "...",
      "text_urdu_translation": "..."
    }
  }
}
```

---

### ➡️ GET `/api/v1/quran/words/:surah/:ayah`
**Description:** Get word-by-word data for a specific verse.
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
        "arabic_word": "بِسْمِ",
        "transliteration": "bis'mi",
        "global_urdu_meaning": "نام سے"
      }
    ]
  }
}
```

---

### ➡️ GET `/api/v1/quran/verse-data/:surah/:ayah`
**Description:** Get verse in ingestion-compatible format for textbook integration.
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
      "surah": 1,
      "ayah": 1,
      "surah_name_arabic": "الفاتحة",
      "surah_name_english": "Al-Fatiha",
      "textbook_line_translation": "شروع اللہ کے نام سے...",
      "word_alignments": [
        {
          "position": 1,
          "textbook_urdu": "نام سے",
          "color_highlight": null
        }
      ],
      "tafsir_snippet": null
    }
  }
}
```

---

### ➡️ GET `/api/v1/quran/range/:surah/:start-:end`
**Description:** Get a range of verses (e.g., verses 1-5 of Surah 2).
**Auth Layer:** Public
**Controller Hook:** `quranController.getVerseRange`

#### 📬 Headers & Parameters
* **Path Parameters:**
  - `surah` (number): Surah number (1-114)
  - `start` (number): Starting ayah number
  - `end` (number): Ending ayah number

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "verses": [...]
  }
}
```

---

### ➡️ GET `/api/v1/quran/surahs`
**Description:** Get metadata for all 114 Surahs.
**Auth Layer:** Public
**Controller Hook:** `quranController.getSurahs`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json"
}
```

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
      }
    ]
  }
}
```

---

## 📥 Ingestion (Admin Only)

### ➡️ POST `/api/v1/ingestion/book`
**Description:** Ingest a complete book with chapters and topics from structured data.
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
  "book": {...},
  "chapters": [...],
  "topics": [...]
}
```

---

### ➡️ POST `/api/v1/ingestion/topics/bulk`
**Description:** Bulk upsert multiple topics.
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
  "topics": [...]
}
```

---

### ➡️ GET `/api/v1/ingestion/stats`
**Description:** Get ingestion statistics.
**Auth Layer:** Admin Token
**Controller Hook:** `ingestionController.getIngestionStats`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_JWT_TOKEN>"
}
```

---

## 💳 Payment Webhooks

### ➡️ POST `/api/v1/webhooks/payments`
**Description:** Handle EasyPaisa/JazzCash payment webhooks. Requires signature verification.
**Auth Layer:** Public (webhook secret in header)
**Controller Hook:** `webhookController.handlePaymentWebhook`

#### 📬 Headers & Parameters
* **HTTP Headers:**
```json
{
  "Content-Type": "application/json",
  "x-payment-auth-token": "<WEBHOOK_SECRET>"
}
```

* **Request Body:**
```json
{
  "transaction_id": "TXN123456",
  "status": "SUCCESS",
  "payment_method": "easypaisa",
  "amount": 1000,
  "currency": "PKR",
  "metadata": {...}
}
```

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Payment confirmed successfully",
    "subscriptionId": "...",
    "userId": "...",
    "plan": "premium"
  }
}
```

---

### ➡️ GET `/api/v1/webhooks/payments`
**Description:** Check webhook/payment status for debugging.
**Auth Layer:** Public
**Controller Hook:** `webhookController.getWebhookStatus`

#### 📬 Headers & Parameters
* **Query Parameters:**
  - `txn` (string): Transaction ID

* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactionId": "TXN123456",
    "status": "active",
    "plan": "premium",
    "amount": 1000,
    "currency": "PKR",
    "paymentMethod": "easypaisa",
    "createdAt": "2025-06-15T10:00:00.000Z",
    "userEmail": "user@example.com"
  }
}
```

---

## 🏗️ Data Models

### Book Model
```dart
class Book {
  String id;
  String title;
  String slug;
  String subject;
  String subjectSlug;
  String grade;
  int editionYear;
  Map<String, dynamic> metadata;
  Map<String, dynamic> seo;
  int totalChapters;
  bool isLive;
  bool isPublic;
  Board? boardId;
  String? boardShortCode;
  String? boardSlug;
}
```

### Chapter Model
```dart
class Chapter {
  String id;
  String title;
  String slug;
  int chapterNumber;
  String chapterNumberDisplay;
  String bookId;
  List<String> studentLearningOutcomes;
  String summary;
  int pageStart;
  int pageEnd;
  int totalTopics;
  bool isLive;
  int displayOrder;
}
```

### Topic Model
```dart
class Topic {
  String id;
  String title;
  String titleUrdu;
  String slug;
  String topicNumber;
  int displayOrder;
  String difficulty; // easy, medium, hard
  int estimatedReadTime;
  int editionYear;
  String rawText;
  String cleanHtml;
  List<ContentBlock> contentBlocks;
  List<Formula> formulas;
  List<KeyTerm> keyTerms;
  List<MCQ> bookMcqs;
  List<String> bookShortQuestions;
  List<Problem> bookProblems;
  List<String> keywords;
  QuranReference? quranReference;
  Map<String, dynamic> seo;
  UserProgress? userProgress;
}

class ContentBlock {
  String type; // heading, paragraph, formula, table, image, list, callout, example, definition, mcq, question, problem, figure, summary_point, activity, quran_verse
  String? text;
  String? html;
  int? level;
  String? latex;
  String? formulaLabel;
  List<String>? headers;
  List<List<String>>? rows;
  String? caption;
  String? src;
  String? alt;
  String? figureNumber;
  String? pageCoordinates;
  bool? ordered;
  List<String>? items;
  String? variant; // note, activity, warning, info, quick-quiz, lab-safety, caution, do-you-know
  String? title;
  String? problem;
  String? solution;
  List<String>? steps;
  String? answer;
  String? question;
  List<String>? options;
  String? correctAnswer;
  String? explanation;
  String? term;
  String? definition;
  QuranData? quranData;
  int blockOrder;
}
```

### UserProgress Model
```dart
class UserProgress {
  String userId;
  String topicId;
  String? chapterId;
  String? bookId;
  bool isRead;
  int scrollDepthPercent;
  int timeSpentSeconds;
  int quizAttempts;
  int highestQuizScore;
  int lastQuizScore;
  String masteryStatus; // locked, in_progress, mastered
  int progressPercent;
  int xpEarned;
  DateTime lastAccessed;
}
```

### UserVault Model
```dart
class UserVault {
  String id;
  String userId;
  String topicId;
  String type; // flashcard, video_link, bookmark, note, highlight
  Flashcard? flashcard;
  Video? video;
  Highlight? highlight;
  Note? note;
  String reviewStatus; // not_reviewed, reviewing, mastered
  DateTime? lastReviewed;
  DateTime createdAt;
}

class Flashcard {
  String front;
  String back;
  bool isAiGenerated;
}

class Video {
  String url;
  String title;
  String thumbnailUrl;
  String platform; // youtube, other
}

class Highlight {
  String text;
  int? blockOrder;
  String color;
}

class Note {
  String text;
}
```

### Quiz Model
```dart
class Quiz {
  String id;
  String topicId;
  List<Question> questions;
  int totalQuestions;
}

class Question {
  String id;
  String question;
  List<String> options;
  String correctAnswer;
  String? explanation;
  String difficulty; // easy, medium, hard
}
```

### User Model
```dart
class User {
  String id;
  String name;
  String email;
  String role; // student, parent, teacher, admin, superadmin
  String? avatarUrl;
  bool isVerified;
  StudentProfile? studentProfile;
  Subscription? subscription;
}

class StudentProfile {
  String? boardId;
  String? grade;
  String? className;
  bool onboardingCompleted;
  int xpTotal;
  int streakDays;
  DateTime? lastActive;
}

class Subscription {
  String plan; // free, basic, premium, family
  String status; // active, expired, cancelled
  DateTime? expiresAt;
  int aiCreditsUsedToday;
  DateTime? aiCreditsResetAt;
}
```

---

## 📝 Notes for Flutter Team

1. **JSON Serialization**: Use `json_serializable` package for all models
2. **Date Handling**: All dates are ISO 8601 format (UTC)
3. **Error Handling**: Always check `success` field first in responses
4. **Pagination**: Currently not implemented; all lists return full results
5. **Rate Limiting**: API endpoints have rate limiters (60 req/min for general, 10 req/min for AI)
6. **Streaming**: AI explanation endpoint supports Server-Sent Events (SSE) for streaming
7. **File Uploads**: Not yet implemented; content ingestion is JSON-based
8. **WebSocket**: Not implemented; real-time features use polling

---

## 🔧 Environment Variables

Flutter app should configure these environment variables:

```dart
const String apiBaseUrl = 'https://api.studyvault.pk/api/v1'; // Production
// const String apiBaseUrl = 'http://localhost:5000/api/v1'; // Development

const String googleClientId = 'YOUR_GOOGLE_CLIENT_ID';
const String jwtStorageKey = 'studyvault_jwt_token';
```

---

**Document Version:** 1.0  
**Last Updated:** June 2025  
**Maintained By:** Backend Team
