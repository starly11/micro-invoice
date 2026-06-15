# StudyVault API Specification for Flutter Development

## Authentication Requirements

### JWT Structure
- **Access Token**: Bearer token required for protected routes
- **Token Format**: `Authorization: Bearer <JWT_TOKEN>`
- **User Roles**: Student, Admin

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error message"
  }
}
```

### Rate Limiting
- **General API**: 100 requests per 15 minutes per IP
- **Auth Routes**: 5 attempts per 900 seconds per IP
- **AI Routes**: 10 requests per 60 seconds per user

## Data Formats

### Date Format
- ISO 8601 strings: `YYYY-MM-DDTHH:mm:ss.sssZ`

### Boolean Values
- Standard JSON booleans: `true` / `false`

---

## API Endpoints

### ➡️ POST `/api/v1/auth/register`
**Description:** Register a new student account  
**Auth Layer:** Public  
**Controller Hook:** `authController.register`

#### Request Body:
```json
{
  "email": "string (required)",
  "password": "string (min 6 chars, required)",
  "firstName": "string (required)",
  "lastName": "string (required)"
}
```

### ➡️ POST `/api/v1/auth/login`
**Description:** Authenticate user and return JWT tokens  
**Auth Layer:** Public  
**Controller Hook:** `authController.login`

#### Request Body:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

### ➡️ GET `/api/v1/books`
**Description:** Retrieve all available books with pagination  
**Auth Layer:** Student JWT  
**Controller Hook:** `bookController.getAllBooks`

### ➡️ GET `/api/v1/books/:bookId`
**Description:** Retrieve specific book details by ID  
**Auth Layer:** Student JWT  
**Controller Hook:** `bookController.getBookById`

### ➡️ GET `/api/v1/chapters/:chapterId`
**Description:** Retrieve specific chapter content by ID  
**Auth Layer:** Student JWT  
**Controller Hook:** `chapterController.getChapterById`

### ➡️ GET `/api/v1/topics/:topicId`
**Description:** Retrieve specific topic content by ID  
**Auth Layer:** Student JWT  
**Controller Hook:** `topicController.getTopicById`

### ➡️ GET `/api/v1/progress/book/:bookId`
**Description:** Get user progress for a specific book  
**Auth Layer:** Student JWT  
**Controller Hook:** `progressController.getBookProgress`

### ➡️ PATCH `/api/v1/progress/chapter/:chapterId`
**Description:** Update user progress for a specific chapter  
**Auth Layer:** Student JWT  
**Controller Hook:** `progressController.updateChapterProgress`

### ➡️ PATCH `/api/v1/progress/topic/:topicId`
**Description:** Update user progress for a specific topic  
**Auth Layer:** Student JWT  
**Controller Hook:** `progressController.updateTopicProgress`

### ➡️ GET `/api/v1/vault/my-items`
**Description:** Retrieve user's personal learning vault items  
**Auth Layer:** Student JWT  
**Controller Hook:** `vaultController.getUserVaultItems`

### ➡️ POST `/api/v1/vault/items`
**Description:** Add a new item to user's learning vault  
**Auth Layer:** Student JWT  
**Controller Hook:** `vaultController.createVaultItem`

### ➡️ PATCH `/api/v1/vault/items/:itemId`
**Description:** Update existing vault item  
**Auth Layer:** Student JWT  
**Controller Hook:** `vaultController.updateVaultItem`

### ➡️ DELETE `/api/v1/vault/items/:itemId`
**Description:** Delete a vault item  
**Auth Layer:** Student JWT  
**Controller Hook:** `vaultController.deleteVaultItem`

### ➡️ GET `/api/v1/search`
**Description:** Search across books, chapters, topics, and vault items  
**Auth Layer:** Student JWT  
**Controller Hook:** `searchController.search`

### ➡️ POST `/api/v1/ai/generate-flashcards`
**Description:** Generate flashcards from text content using AI  
**Auth Layer:** Student JWT  
**Controller Hook:** `aiController.generateFlashcards`

### ➡️ POST `/api/v1/ai/explain-concept`
**Description:** Get detailed explanation of a concept using AI  
**Auth Layer:** Student JWT  
**Controller Hook:** `aiController.explainConcept`

### ➡️ POST `/api/v1/ai/summarize-content`
**Description:** Generate summary of provided content using AI  
**Auth Layer:** Student JWT  
**Controller Hook:** `aiController.summarizeContent`

### ➡️ POST `/api/v1/ai/quiz-generator`
**Description:** Generate quiz questions from content using AI  
**Auth Layer:** Student JWT  
**Controller Hook:** `aiController.generateQuiz`

### ➡️ POST `/api/v1/ai/content-analysis`
**Description:** Analyze content for readability, key terms, and difficulty  
**Auth Layer:** Student JWT  
**Controller Hook:** `aiController.analyzeContent`

### ➡️ GET `/api/v1/dashboard/stats`
**Description:** Get user dashboard statistics and analytics  
**Auth Layer:** Student JWT  
**Controller Hook:** `dashboardController.getUserStats`

### ➡️ GET `/api/v1/dashboard/recommendations`
**Description:** Get personalized learning recommendations  
**Auth Layer:** Student JWT  
**Controller Hook:** `dashboardController.getRecommendations`

### ➡️ GET `/api/v1/quiz/:quizId`
**Description:** Retrieve a specific quiz by ID  
**Auth Layer:** Student JWT  
**Controller Hook:** `quizController.getQuizById`

### ➡️ POST `/api/v1/quiz/:quizId/start`
**Description:** Start a quiz session and record attempt  
**Auth Layer:** Student JWT  
**Controller Hook:** `quizController.startQuiz`

### ➡️ PATCH `/api/v1/quiz/:quizId/submit-answer`
**Description:** Submit an answer for a quiz question  
**Auth Layer:** Student JWT  
**Controller Hook:** `quizController.submitAnswer`

### ➡️ POST `/api/v1/quiz/:quizId/finish`
**Description:** Finish the quiz and calculate final score  
**Auth Layer:** Student JWT  
**Controller Hook:** `quizController.finishQuiz`

### ➡️ GET `/api/v1/quiz/attempts/history`
**Description:** Get user's quiz attempt history  
**Auth Layer:** Student JWT  
**Controller Hook:** `quizController.getAttemptHistory`

---

## Dart Data Models

See the full API specification document for complete Dart model definitions including:
- User models (User, StudentProfile, Subscription, AuthTokens)
- Book models (Book, Chapter, Topic, ContentBlock)
- Progress models (UserProgress, ChapterProgress, TopicProgress)
- Vault models (UserVaultItem, SourceInfo)
- Search models (SearchResults, SearchResult)
- AI models (GeneratedFlashcards, ConceptExplanation, GeneratedQuiz)
- Dashboard models (DashboardStats, Recommendations)
- Quiz models (QuizAttempt, QuizResult, QuizFeedback)

---

## Development Tips for Flutter Team

1. **Generate Serialization Code:** Run `flutter packages pub run build_runner build` after adding/modifying `@JsonSerializable` models.
2. **API Client:** Create a dedicated service class (e.g., `StudyVaultApiClient`) to handle HTTP requests, token management, and base URL configuration.
3. **Authentication:** Implement automatic token refresh logic when receiving 401 errors. Store tokens securely using packages like `flutter_secure_storage`.
4. **Error Handling:** Always check the `success` field in the API response first. Handle errors gracefully using the `ApiError` model.
5. **Loading States:** Many endpoints can take time (especially AI endpoints). Implement appropriate loading indicators.
6. **Caching:** Consider caching frequently accessed data like books, chapters, and user profile locally using packages like `shared_preferences` or `hive`.
7. **Offline Mode:** Plan for basic offline capabilities where possible, especially for previously viewed content and user progress.
