# 📚 StudyVault API Specification

**Generated Automatically** | Backend: `backend-ebook`  
**Base URL:** `/api` | **Authentication:** JWT Bearer Token

---

## 🔐 Authentication Requirements

### Token Format
- **Type:** JWT (JSON Web Token)
- **Header:** `Authorization: Bearer <JWT_TOKEN>`
- **Cookie:** `sv_token` (HttpOnly, Secure, SameSite: lax)
- **Secret:** `JWT_ACCESS_SECRET` env var

### Error Codes
- **UNAUTHORIZED**: Authentication required
- **USER_NOT_FOUND**: User not found
- **INVALID_TOKEN**: Invalid token
- **TOKEN_EXPIRED**: Token expired
- **UNAUTHORIZED**: Authentication required
- **FORBIDDEN**: Admin access required

### Roles: admin

---

## 📊 Database Models

### `Board` Model

| Property | Type | Required | Default | Enum | Ref |
|----------|------|----------|---------|------|-----|
| `name` | `String` | ✅ | - | - | - |
| `slug` | `String` | ✅ | - | - | - |
| `short_code` | `String` | ✅ | - | - | - |
| `program_id` | `ObjectId` | ✅ | - | - | `Program` |
| `country` | `String` | ❌ | 'Pakistan' | - | - |
| `is_active` | `Boolean` | ❌ | true | - | - |

**Relationships:**
- `program_id` → `Program`

---

### `Book` Model

| Property | Type | Required | Default | Enum | Ref |
|----------|------|----------|---------|------|-----|
| `title` | `String` | ✅ | - | - | - |
| `slug` | `String` | ❌ | - | - | - |
| `subject` | `String` | ✅ | - | - | - |
| `subject_slug` | `String` | ❌ | - | - | - |
| `program_id` | `ObjectId` | ✅ | - | - | `Program` |
| `board_id` | `ObjectId` | ✅ | - | - | `Board` |
| `edition_year` | `Number` | ✅ | - | - | - |
| `is_current_edition` | `Boolean` | ❌ | true | - | - |
| `previous_edition_id` | `ObjectId` | ❌ | null | - | `Book` |
| `metadata` | `String` | ❌ | 'english' | 'english', 'urdu', 'bilingual' | - |
| `script_direction` | `String` | ❌ | 'ltr' | 'ltr', 'rtl', 'mixed' | - |
| `seo` | `Mixed` | ❌ | - | - | - |
| `total_chapters` | `Number` | ❌ | 0 | - | - |
| `total_topics` | `Number` | ❌ | 0 | - | - |
| `ingestion_status` | `String` | ❌ | 'pending' | 'pending', 'processing', 'partial', 'complete', 'error' | - |
| `is_live` | `Boolean` | ❌ | false | - | - |
| `is_public` | `Boolean` | ❌ | true | - | - |
| `is_global_resource` | `Boolean` | ❌ | false | - | - |
| `created_by` | `ObjectId` | ❌ | - | - | `User` |
| `approved_by` | `ObjectId` | ❌ | - | - | `User` |
| `isPremium` | `Boolean` | ❌ | false | - | - |
| `viewCount` | `Number` | ❌ | 0 | - | - |

**Relationships:**
- `program_id` → `Program`
- `board_id` → `Board`
- `previous_edition_id` → `Book`
- `created_by` → `User`
- `approved_by` → `User`

---

### `Chapter` Model

| Property | Type | Required | Default | Enum | Ref |
|----------|------|----------|---------|------|-----|
| `title` | `String` | ✅ | - | - | - |
| `slug` | `String` | ✅ | - | - | - |
| `chapter_number` | `Number` | ✅ | - | - | - |
| `book_id` | `ObjectId` | ✅ | - | - | `Book` |
| `book_slug` | `String` | ❌ | - | - | - |
| `program_id` | `ObjectId` | ✅ | - | - | `Program` |
| `board_id` | `ObjectId` | ❌ | - | - | `Board` |
| `subject_slug` | `String` | ❌ | - | - | - |
| `total_topics` | `Number` | ❌ | 0 | - | - |
| `is_hot` | `Boolean` | ❌ | false | - | - |
| `seo` | `Mixed` | ❌ | - | - | - |
| `is_live` | `Boolean` | ❌ | false | - | - |
| `display_order` | `Number` | ❌ | 0 | - | - |

**Relationships:**
- `book_id` → `Book`
- `program_id` → `Program`
- `board_id` → `Board`
- `board_id` → `Board`

---

### `Program` Model

| Property | Type | Required | Default | Enum | Ref |
|----------|------|----------|---------|------|-----|
| `name` | `String` | ✅ | - | - | - |
| `slug` | `String` | ✅ | - | - | - |
| `program_type` | `String` | ✅ | - | 'academic', 'entrance_exam', 'professional', 'language', 'custom' | - |
| `is_linear` | `Boolean` | ❌ | true | - | - |
| `requires_textbook` | `Boolean` | ❌ | true | - | - |
| `display_order` | `Number` | ❌ | 0 | - | - |
| `is_active` | `Boolean` | ❌ | true | - | - |
| `is_featured` | `Boolean` | ❌ | false | - | - |
| `access_tier` | `String` | ❌ | 'basic' | 'free', 'basic', 'premium' | - |
| `board_id` | `ObjectId` | ❌ | - | - | `Board` |
| `created_by` | `ObjectId` | ❌ | - | - | `User` |

**Relationships:**
- `board_id` → `Board`
- `created_by` → `User`

---

### `Question` Model

| Property | Type | Required | Default | Enum | Ref |
|----------|------|----------|---------|------|-----|
| `topic_id` | `ObjectId` | ✅ | - | - | `Topic` |
| `chapter_id` | `ObjectId` | ❌ | - | - | `Chapter` |
| `book_id` | `ObjectId` | ❌ | - | - | `Book` |
| `program_id` | `ObjectId` | ❌ | - | - | `Program` |
| `type` | `String` | ✅ | - | 'mcq', 'short', 'long', 'numerical', 'fill_blank', 'true_false' | - |
| `question` | `String` | ✅ | - | - | - |
| `source` | `String` | ✅ | - | 'book', 'ai_generated', 'teacher', 'past_paper' | - |
| `past_paper` | `ObjectId` | ❌ | - | - | `Board` |
| `is_verified` | `Boolean` | ❌ | false | - | - |
| `verified_by` | `ObjectId` | ❌ | - | - | `User` |
| `difficulty` | `String` | ❌ | 'medium' | 'easy', 'medium', 'hard' | - |
| `total_attempts` | `Number` | ❌ | 0 | - | - |
| `correct_attempts` | `Number` | ❌ | 0 | - | - |
| `created_by` | `ObjectId` | ❌ | - | - | `User` |

**Relationships:**
- `topic_id` → `Topic`
- `chapter_id` → `Chapter`
- `book_id` → `Book`
- `program_id` → `Program`
- `past_paper` → `Board`
- `verified_by` → `User`
- `created_by` → `User`

---

### `Quiz` Model

| Property | Type | Required | Default | Enum | Ref |
|----------|------|----------|---------|------|-----|
| `user_id` | `ObjectId` | ✅ | - | - | `User` |
| `topic_id` | `ObjectId` | ✅ | - | - | `Topic` |
| `chapter_id` | `ObjectId` | ❌ | - | - | `Chapter` |
| `book_id` | `ObjectId` | ❌ | - | - | `Book` |
| `program_id` | `ObjectId` | ❌ | - | - | `Program` |
| `score` | `Number` | ✅ | - | - | - |
| `questionId` | `String` | ✅ | - | - | - |
| `selected` | `String` | ✅ | - | - | - |
| `time_spent` | `Number` | ❌ | 0 | - | - |
| `correct_count` | `Number` | ❌ | 0 | - | - |
| `total_questions` | `Number` | ❌ | 0 | - | - |
| `accuracy_percentage` | `Number` | ❌ | - | - | - |
| `difficulty` | `String` | ❌ | - | 'easy', 'medium', 'hard' | - |
| `device_info` | `Mixed` | ❌ | - | - | - |
| `created_at` | `Date` | ❌ | Date.now | - | - |

**Relationships:**
- `user_id` → `User`
- `topic_id` → `Topic`
- `chapter_id` → `Chapter`
- `book_id` → `Book`
- `program_id` → `Program`

---

### `QuranVerse` Model

| Property | Type | Required | Default | Enum | Ref |
|----------|------|----------|---------|------|-----|
| `surah` | `Number` | ✅ | - | - | - |
| `ayah` | `Number` | ✅ | - | - | - |
| `surah_name_arabic` | `String` | ❌ | - | - | - |
| `surah_name_english` | `String` | ❌ | - | - | - |
| `text_uthmani` | `String` | ❌ | - | - | - |
| `text_urdu_translation` | `String` | ❌ | - | - | - |
| `juz` | `Number` | ❌ | - | - | - |
| `manzil` | `Number` | ❌ | - | - | - |
| `ruku` | `Number` | ❌ | - | - | - |
| `page` | `Number` | ❌ | - | - | - |
| `position` | `Number` | ❌ | - | - | - |
| `text_urdu` | `String` | ❌ | - | - | - |
| `transliteration` | `String` | ❌ | - | - | - |
| `toJSON` | `Mixed` | ❌ | - | - | - |
| `toObject` | `Mixed` | ❌ | - | - | - |

---

### `QuranWord` Model

| Property | Type | Required | Default | Enum | Ref |
|----------|------|----------|---------|------|-----|
| `surah` | `Number` | ✅ | - | - | - |
| `ayah` | `Number` | ✅ | - | - | - |
| `word_position` | `Number` | ✅ | - | - | - |
| `arabic_word` | `String` | ✅ | - | - | - |

---

### `Subscription` Model

| Property | Type | Required | Default | Enum | Ref |
|----------|------|----------|---------|------|-----|
| `user_id` | `ObjectId` | ✅ | - | - | `User` |
| `plan` | `String` | ❌ | 'free' | 'free', 'basic', 'premium', 'family' | - |
| `status` | `String` | ❌ | 'active' | 'active', 'expired', 'cancelled', 'pending' | - |
| `started_at` | `Date` | ❌ | Date.now | - | - |
| `payment_provider` | `String` | ❌ | - | 'stripe', 'paypal', 'jazzcash', 'easypaisa', 'manual' | - |
| `currency` | `String` | ❌ | 'PKR' | - | - |
| `ai_credits_total` | `Number` | ❌ | 0 | - | - |
| `ai_credits_used` | `Number` | ❌ | 0 | - | - |
| `download_count` | `Number` | ❌ | 0 | - | - |
| `auto_renew` | `Boolean` | ❌ | true | - | - |
| `renewal_reminder_sent` | `Boolean` | ❌ | false | - | - |
| `created_by` | `ObjectId` | ❌ | - | - | `User` |

**Relationships:**
- `user_id` → `User`
- `created_by` → `User`

---

### `Topic` Model

| Property | Type | Required | Default | Enum | Ref |
|----------|------|----------|---------|------|-----|
| `type` | `String` | ✅ | - | 'heading','paragraph','formula','table','image','list','callout',
           'example','definition','mcq','question','problem','figure','summary_point','activity', 'quran_verse' | - |
| `variant` | `String` | ❌ | - | 'note','activity','warning','info','quick-quiz','lab-safety','caution','do-you-know' | - |
| `quran_data` | `Mixed` | ❌ | - | - | - |
| `title` | `String` | ✅ | - | - | - |
| `slug` | `String` | ✅ | - | - | - |
| `display_order` | `Number` | ✅ | - | - | - |
| `book_id` | `ObjectId` | ✅ | - | - | `Book` |
| `chapter_id` | `ObjectId` | ✅ | - | - | `Chapter` |
| `program_id` | `ObjectId` | ✅ | - | - | `Program` |
| `board_id` | `ObjectId` | ❌ | - | - | `Board` |
| `raw_text` | `String` | ✅ | - | - | - |
| `clean_html` | `String` | ✅ | - | - | - |
| `quran_reference` | `Number` | ❌ | - | - | - |
| `ayah` | `Number` | ❌ | - | - | - |
| `juz` | `Number` | ❌ | - | - | - |
| `manzil` | `Number` | ❌ | - | - | - |
| `position` | `Number` | ✅ | - | - | - |
| `textbook_urdu_meaning` | `String` | ✅ | - | - | - |
| `quran_textbook_translation` | `String` | ❌ | null | - | - |
| `quran_textbook_tafsir` | `String` | ❌ | null | - | - |
| `source` | `String` | ❌ | 'book' | - | - |
| `keywords` | `Mixed` | ❌ | - | - | - |
| `difficulty` | `String` | ❌ | 'medium' | 'easy','medium','hard' | - |
| `estimated_read_time` | `Number` | ❌ | 3 | - | - |
| `edition_year` | `Number` | ✅ | - | - | - |
| `version_status` | `String` | ❌ | 'new' | 'new','unchanged','modified','removed' | - |
| `previous_version_id` | `ObjectId` | ❌ | null | - | `Topic` |
| `total_appearances` | `Number` | ❌ | 0 | - | - |
| `is_hot_topic` | `Boolean` | ❌ | false | - | - |
| `ai_cache` | `Mixed` | ❌ | - | - | - |
| `explanation_urdu` | `Mixed` | ❌ | - | - | - |
| `tts_audio` | `Mixed` | ❌ | - | - | - |
| `seo` | `Mixed` | ❌ | - | - | - |
| `is_live` | `Boolean` | ❌ | false | - | - |
| `guest_preview_percent` | `Number` | ❌ | 50 | - | - |
| `workflow_status` | `String` | ❌ | 'draft' | 'draft','pending_review','approved','rejected','live','published' | - |
| `created_by` | `ObjectId` | ❌ | - | - | `User` |
| `approved_by` | `ObjectId` | ❌ | - | - | `User` |

**Relationships:**
- `book_id` → `Book`
- `chapter_id` → `Chapter`
- `program_id` → `Program`
- `board_id` → `Board`
- `previous_version_id` → `Topic`
- `board_id` → `Board`
- `created_by` → `User`
- `approved_by` → `User`

---

### `User` Model

| Property | Type | Required | Default | Enum | Ref |
|----------|------|----------|---------|------|-----|
| `name` | `String` | ✅ | - | - | - |
| `email` | `String` | ✅ | - | - | - |
| `password_hash` | `String` | ❌ | - | - | - |
| `role` | `String` | ❌ | 'student' | 'student', 'parent', 'teacher', 'admin', 'superadmin' | - |
| `google_id` | `String` | ❌ | - | - | - |
| `is_verified` | `Boolean` | ❌ | false | - | - |
| `student_profile` | `ObjectId` | ❌ | - | - | `Program` |
| `board_id` | `ObjectId` | ❌ | - | - | `Board` |
| `active_program_id` | `ObjectId` | ❌ | - | - | `Program` |
| `medium` | `String` | ❌ | 'english' | 'english', 'urdu' | - |
| `onboarding_completed` | `Boolean` | ❌ | false | - | - |
| `xp_total` | `Number` | ❌ | 0 | - | - |
| `streak_days` | `Number` | ❌ | 0 | - | - |
| `onboardingComplete` | `Boolean` | ❌ | false | - | - |
| `parent_id` | `ObjectId` | ❌ | null | - | `User` |
| `subscription` | `String` | ❌ | 'free' | 'free', 'basic', 'premium', 'family' | - |
| `status` | `String` | ❌ | 'active' | 'active', 'expired', 'cancelled' | - |
| `ai_credits_used_today` | `Number` | ❌ | 0 | - | - |
| `teacher_profile` | `ObjectId` | ❌ | - | - | `Book` |

**Relationships:**
- `student_profile` → `Program`
- `board_id` → `Board`
- `active_program_id` → `Program`
- `parent_id` → `User`
- `teacher_profile` → `Book`

---

### `UserProgress` Model

| Property | Type | Required | Default | Enum | Ref |
|----------|------|----------|---------|------|-----|
| `user_id` | `ObjectId` | ✅ | - | - | `User` |
| `topic_id` | `ObjectId` | ✅ | - | - | `Topic` |
| `chapter_id` | `ObjectId` | ❌ | - | - | `Chapter` |
| `book_id` | `ObjectId` | ❌ | - | - | `Book` |
| `program_id` | `ObjectId` | ❌ | - | - | `Program` |
| `is_read` | `Boolean` | ❌ | false | - | - |
| `scroll_depth_percent` | `Number` | ❌ | 0 | - | - |
| `time_spent_seconds` | `Number` | ❌ | 0 | - | - |
| `quiz_attempts` | `Number` | ❌ | 0 | - | - |
| `highest_quiz_score` | `Number` | ❌ | 0 | - | - |
| `last_quiz_score` | `Number` | ❌ | 0 | - | - |
| `mastery_status` | `String` | ❌ | 'locked' | 'locked', 'in_progress', 'mastered' | - |
| `progress_percent` | `Number` | ❌ | 0 | - | - |
| `xp_earned` | `Number` | ❌ | 0 | - | - |
| `last_accessed` | `Date` | ❌ | Date.now | - | - |

**Relationships:**
- `user_id` → `User`
- `topic_id` → `Topic`
- `chapter_id` → `Chapter`
- `book_id` → `Book`
- `program_id` → `Program`

---

### `UserVault` Model

| Property | Type | Required | Default | Enum | Ref |
|----------|------|----------|---------|------|-----|
| `user_id` | `ObjectId` | ✅ | - | - | `User` |
| `topic_id` | `ObjectId` | ✅ | - | - | `Topic` |
| `chapter_id` | `ObjectId` | ❌ | - | - | `Chapter` |
| `program_id` | `ObjectId` | ❌ | - | - | `Program` |
| `type` | `String` | ✅ | - | 'flashcard', 'video_link', 'bookmark', 'note', 'highlight' | - |
| `flashcard` | `Boolean` | ❌ | false | - | - |
| `video` | `String` | ❌ | 'youtube' | 'youtube', 'other' | - |
| `highlight` | `String` | ❌ | '#FEF3C7' | - | - |
| `note` | `Mixed` | ❌ | - | - | - |
| `review_status` | `String` | ❌ | 'not_reviewed' | 'not_reviewed', 'reviewing', 'mastered' | - |

**Relationships:**
- `user_id` → `User`
- `topic_id` → `Topic`
- `chapter_id` → `Chapter`
- `program_id` → `Program`

---

## 🛣️ API Endpoints

### Ai Endpoints

---
### POST `/api/ai/:topicId/explain`
**Description:** Generates AI quiz questions
**Handler:** `None.generateQuizQuestions` | **Auth:** 🔐 Bearer JWT Required

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### POST `/api/ai/:topicId/flashcards`
**Description:** Checks AI credits
**Handler:** `None.checkCredits` | **Auth:** 🔐 Bearer JWT Required

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
### Auth Endpoints

---
### POST `/api/auth/login`
**Description:** Retrieves current authenticated user profile
**Handler:** `None.getMe` | **Auth:** 🔐 Bearer JWT Required

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### POST `/api/auth/logout`
**Description:** Clears authentication session and cookies
**Handler:** `None.logout` | **Auth:** 🔐 Bearer JWT Required

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### POST `/api/auth/dev-login`
**Description:** Development-only login (disabled in production)
**Handler:** `None.devLogin` | **Auth:** 🌐 Public

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Not required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### POST `/api/auth/onboarding`
**Description:** Completes student onboarding
**Handler:** `None.completeOnboarding` | **Auth:** 🔐 Bearer JWT Required

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
### Checkout Endpoints

---
### POST `/api/checkout/`
**Description:** Initialize checkout
**Handler:** `None.initializeCheckout` | **Auth:** 🔐 Bearer JWT Required

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### GET `/api/checkout/`
**Description:** Get subscription
**Handler:** `None.getSubscription` | **Auth:** 🔐 Bearer JWT Required

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
### Dashboard Endpoints

---
### GET `/api/dashboard/student`
**Description:** Admin dashboard
**Handler:** `None.getAdminDashboard` | **Auth:** 🔒 Admin Role Only

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required - Admin}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### GET `/api/dashboard/admin/content-health`
**Description:** Content health (admin)
**Handler:** `None.getContentHealth` | **Auth:** 🔒 Admin Role Only

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required - Admin}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
### Ingestion Endpoints

---
### POST `/api/ingestion/book`
**Description:** Bulk ingest topics (admin)
**Handler:** `None.bulkIngestTopics` | **Auth:** 🔒 Admin Role Only

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required - Admin}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### GET `/api/ingestion/stats`
**Description:** Ingestion stats
**Handler:** `None.getIngestionStats` | **Auth:** 🔒 Admin Role Only

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required - Admin}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
### Progress Endpoints

---
### GET `/api/progress/stats`
**Description:** Retrieves recent activity
**Handler:** `None.getRecentActivity` | **Auth:** 🔐 Bearer JWT Required

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### GET `/api/progress/streak`
**Description:** Retrieves topic progress
**Handler:** `None.getTopicProgress` | **Auth:** 🔐 Bearer JWT Required

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### PUT `/api/progress/:topicId`
**Description:** Completes topic
**Handler:** `None.completeTopic` | **Auth:** 🔐 Bearer JWT Required

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
### Quran Endpoints

---
### GET `/api/quran/verses/:surah`
**Description:** Verses with word data
**Handler:** `None.getVersesWithWords` | **Auth:** 🌐 Public

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Not required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### GET `/api/quran/verse/:surah/:ayah`
**Description:** Word-by-word data
**Handler:** `None.getVerseWords` | **Auth:** 🌐 Public

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Not required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### GET `/api/quran/verse-data/:surah/:ayah`
**Description:** Handles GET requests for 5 functionality
**Handler:** `None.5` | **Auth:** 🌐 Public

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Not required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### GET `/api/quran/range/:surah/:start-:end`
**Description:** All surahs metadata
**Handler:** `None.getSurahs` | **Auth:** 🌐 Public

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Not required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
### Search Endpoints

---
### GET `/api/search/`
**Description:** Global search
**Handler:** `None.globalSearch` | **Auth:** ⚠️ Optional Auth

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Optional}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### GET `/api/search/filtered`
**Description:** Filtered search
**Handler:** `None.searchWithFilters` | **Auth:** ⚠️ Optional Auth

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Optional}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### GET `/api/search/suggestions`
**Description:** Search suggestions
**Handler:** `None.getSearchSuggestions` | **Auth:** ⚠️ Optional Auth

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Optional}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
### Vault Endpoints

---
### GET `/api/vault/`
**Description:** Retrieves vault stats
**Handler:** `None.getVaultStats` | **Auth:** 🔐 Bearer JWT Required

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### POST `/api/vault/:topicId`
**Description:** Removes from vault
**Handler:** `None.removeFromVault` | **Auth:** 🔐 Bearer JWT Required

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
---
### GET `/api/vault/:topicId/status`
**Description:** Checks vault status
**Handler:** `None.checkVaultStatus` | **Auth:** 🔐 Bearer JWT Required

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```
### Webhooks Endpoints

---
### POST `/api/webhooks/payments`
**Description:** Webhook status
**Handler:** `None.getWebhookStatus` | **Auth:** 🌐 Public

#### 📬 Request Headers
```json
{"Content-Type": "application/json", "Authorization": "Bearer <JWT_TOKEN>" // Not required}
```

#### ✅ Success Response
```json
{"success": true, "data": {...}, "message": "..."}
```

#### ❌ Error Response
```json
{"success": false, "error": {"code": "CODE", "message": "..."}}
```

---

## 🏷️ Rate Limiting
- **API**: Standard limits via `apiLimiter`
- **AI**: Stricter limits via `aiLimiter`
- **Search/Checkout**: Protected against abuse

---

## 📝 General Notes
- **Timestamps**: ISO 8601 format
- **IDs**: MongoDB ObjectId (24 hex characters)
- **Booleans**: JavaScript `true`/`false`
- **Null**: JSON `null`

*Auto-generated on 2026-06-15 11:46*