# Whimsical Slides

## 1. **Project Overview**

**Project Name**: Whimsical Slides: A Delightful Slideshow Experience

**Goal**: Deliver a comedic, multilingual, performance-focused slideshow application in **2 days**, featuring:

1. A **Dashboard** where users can sign in (Firebase) and manage slideshows.
2. A **Slideshow Editor** that supports multiple elements (text, images, videos) per slide, arranged via **cards** that can be reordered.
3. **Play Mode**: A dedicated slideshow view (in a new tab) with **prev/next** arrows or auto-play.
4. **AI Meme Generation** (OpenAI) for text + image combos (3/day limit).
5. **Translation** via Google Translate (10/day limit) + i18next for static UI.
6. **Performance “Speedometer”** with comedic messages.

---

## 2. **Objectives**

1. **Dashboard**
   - A landing space after login where users see a list (grid or cards) of their slideshows.
   - Users can create, rename, or delete slideshows.
2. **Slideshow Editor**
   - “Plus” button to add new slides, text, images, or videos.
   - **Card-based** layout so each piece of content is a “card” that can be reordered on a slide.
   - **Drag & Resize** capabilities for each card.
   - Autosaving everything in Firestore.
3. **Play Mode**
   - “Play” button opens slideshow in a new tab.
   - Bottom navigation with arrows (e.g., “‹ 1/6 ›”) and an optional auto-play toggle.
4. **AI Meme Generation**
   - 3 calls/day for comedic text + AI-generated image, inserted as new cards.
5. **Translation**
   - 10 calls/day for dynamic text translation.
6. **Performance & Comedy**
   - Speedometer widget shows load time, JS bundle size, comedic lines.

---

## 3. **Scope**

### In-Scope

- **Frontend**: VueJS, Tailwind CSS, i18next.
- **Backend**: Firebase Auth & Firestore for data storage and usage tracking.
- **AI Meme**: OpenAI integration.
- **Translation**: Google Translate for user-entered text.
- **Deployment**: Netlify with environment variables for API keys.
- **Interaction**:
  - Dashboard listing slideshows.
  - Editor with a plus button for adding slides/cards.
  - Drag & drop card reordering, resizing, comedic usage-limiting for meme/translation.
  - Slideshow playback in a new tab.

### Out of Scope

- Offline mode or multi-user collaboration.
- Extended theming beyond the basics.
- Complex analytics or admin dashboards.

---

## 4. **Two-Day Implementation Timeline**

**Day 1**

1. **Repo & Env Setup**
2. **Ticket #1: Auth & Dashboard**
3. **Ticket #2: Slideshow Editor (Base)**

**Day 2**  
4. **Ticket #3: Drag & Resize of Cards**  
5. **Ticket #4: Meme Generation (OpenAI)**  
6. **Ticket #5: Translation Feature**  
7. **Ticket #6: Play Mode & Performance Widget**

---

## 5. **Repository & File Layout**

```
whimsical/
├─ .env                      // Local dev env vars
├─ netlify.toml              // Netlify config
├─ package.json
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  ├─ ElementCard.vue     // The “card” for text/image/video
│  │  ├─ MemePrompt.vue      // Prompt input for AI meme
│  │  └─ SlideCard.vue       // Possibly for rendering a single slide
│  ├─ views/
│  │  ├─ AuthView.vue        // Login/Signup
│  │  ├─ DashboardView.vue   // List slideshows
│  │  ├─ EditorView.vue      // Main slideshow editor
│  │  └─ PlayView.vue        // Slideshow presentation mode
│  ├─ services/
│  │  ├─ firebase.js         // Firebase init & Firestore references
│  │  ├─ openai.js           // Meme generation logic
│  │  └─ translate.js        // Google Translate logic
│  ├─ router/
│  │  └─ index.js
│  ├─ i18n/
│  │  └─ en.json             // English static UI text
│  └─ main.js
└─ ...
```

---

## 6. **Data Model (Firestore)**

**Collection**: `slideshows`

- **Document**: `slideshowId`
  ```js
  {
    ownerId: string,
    title: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    slides: [
      {
        id: string,
        orderIndex: number,  // reorder slides in the slideshow
        cards: [            // "cards" array on each slide
          {
            id: string,
            type: "text" | "image" | "video",
            content: string,
            position: { x: number, y: number },
            size: { width: number, height: number },
            orderIndex: number // layering if needed
          }
        ]
      }
    ]
  }
  ```
  **Usage Limits** in `/users/{userId}/usage`:

```js
{
  memeUsageCount: number,
  lastMemeDate: number,
  translateUsageCount: number,
  lastTranslateDate: number
}
```

---

## 7. **Tickets with Detailed User & System Actions**

### **Preliminary Step: Repo & Environment Setup**

**When**: Day 1 (Morning)

- **Developer** creates Git repo, configures Vue + Tailwind, sets up environment variables and Netlify, and sets Firebase rules.

---

### **Ticket #1: Auth & Dashboard**

**When**: Day 1  
**User Actions**

1. **User navigates** to root URL while logged out.
   - **System** shows `AuthView` (login/signup).
2. **User signs up or logs in** (email/password).
   - **System** verifies credentials, on success → `/dashboard`.
3. **User sees** a “dashboard-like” interface listing their slideshows as **cards** (like in the attached example).
4. **User clicks** a “Create New Slideshow” button.
   - **System** creates a new `slideshow` doc in Firestore → user is directed to `/editor/:slideshowId`.

**Acceptance Criteria**

- Auth and slideshow list are restricted to the logged-in user.
- Layout is reminiscent of a “recent items” or “cards” grid, not necessarily elaborate—just enough to show each slideshow’s name/thumbnail (optional).

---

### **Ticket #2: Slideshow Editor (Base)**

**When**: Day 1 (Afternoon)  
**User Actions**

1. **User arrives** at `/editor/{slideshowId}`.
   - **System** fetches the slideshow doc and displays slides in a vertical or horizontal listing.
2. **User clicks** a “+” (plus button) at the bottom (or top) to **Add Slide**.
   - **System** adds a new slide object to `slides[]` in Firestore, e.g., `id`, `orderIndex`, empty `cards[]`.
3. **User renames** the slideshow in a text field at the top (optional).
   - **System** updates `title` in Firestore.
4. **User sees** each slide’s existing content cards (if any), though we **haven’t yet** implemented drag & resize (that’s Ticket #3).

**Acceptance Criteria**

- The user can add slides, rename the slideshow.
- The slideshow’s `slides[]` structure is clear, each slide can hold multiple “cards.”

---

### **Ticket #3: Drag & Resize of Cards**

**When**: Day 2 (Morning)  
**User Actions**

1. **On a given slide**, the user sees a “+” button for **Add Content**. Possibly a small menu:
   - “Add Text Card”
   - “Add Image Card”
   - “Add Video Card”
2. **System** appends a new card object in the `cards[]`:
   ```js
   {
     id: "<cardId>",
     type: "text",   // or "image", "video"
     content: "",    // user will fill this in
     position: { x: 0, y: 0 },
     size: { width: 300, height: 200 },
     orderIndex: 1
   }
   ```
3. **User** clicks/holds and drags the card around the slide.
   - **System** updates `position.x` and `position.y` in real time or on “drop.”
4. **User** drags corner or side handles to resize the card.
   - **System** updates `size.width` and `size.height`.
5. **User** can reorder or layer cards by adjusting `orderIndex` if layering is needed (optional).

**Acceptance Criteria**

- Each new card is placed in the slide’s `cards[]`.
- The user can reposition each card anywhere, and resize if the card is image/video (text might have minimal resizing).
- Autosave ensures changes go to Firestore after drag/resize ends.

---

### **Ticket #4: Meme Generation (OpenAI)**

**When**: Day 2 (Morning)  
**User Actions**

1. **User clicks** “Generate Meme” (maybe part of the “Add Content” menu or a separate button).
2. **User** types a prompt describing the meme image (e.g., “A penguin at a disco party”).
3. **System** checks `memeUsageCount`. If >= 3 for the day:
   - Show comedic message:
     > “Out of jokes! The humor store is closed for now—try again tomorrow.”
   - Stop.
4. If under limit, **System** calls OpenAI:
   - Returns comedic text + AI-generated image URL.
   - Creates 2 new cards:
     - `type: "text"`, `content: "Funny line..."`
     - `type: "image"`, `content: "<imageURLFromOpenAI>"`
   - Increments `memeUsageCount` in Firestore by 1.

**Acceptance Criteria**

- Limit is 3/day per user.
- Meme prompt leads to automatic insertion of 2 new cards in the current slide.
- Comedic fallback if over limit.

---

### **Ticket #5: Translation Feature (Google)**

**When**: Day 2 (Afternoon)  
**User Actions**

1. **User clicks** a “Translate Slide” button or a language dropdown.
2. **System** checks `translateUsageCount`. If >= 10:
   - Show comedic fallback:
     > “You maxed out our translator! Please wait 24 hours.”
   - Stop.
3. If under limit, **System** takes each card with `type: "text"` → calls Google Translate.
4. The response is used to replace each card’s `content` with the translated text.
5. Increments `translateUsageCount` in Firestore by 1.

**Acceptance Criteria**

- Only text cards are translated.
- 10 calls/day limit.
- i18next is used for all **static** UI strings (no extra API calls for those).

---

### **Ticket #6: Play Mode & Performance Widget**

**When**: Day 2 (Afternoon, Final Step)  
**User Actions**

1. **User** clicks the **Play** button (perhaps top-right in the editor).
   - **System** opens a **new tab** (or route) that shows a “slideshow” view.
2. **Slideshow View**:
   - Each slide is displayed in full screen or large layout.
   - **Arrows** appear at the bottom: “‹ 1/6 ›” or “‹ Prev Next ›” to move among slides.
   - Possibly an **Auto** toggle to auto-advance.
3. **Performance Widget**:
   - On page load, measure load time, show a small widget. Example:
     > “Loaded in 1.4s, 280KB of JS. Zoom zoom!”

**Acceptance Criteria**

- Clicking “Play” spawns a new tab with a simplified slideshow UI.
- The user can click left/right arrows (or use arrow keys) to navigate.
- Speedometer is visible, comedic lines appear.
- The slideshow respects the user’s card arrangement (though might just display them in a simpler layout—no drag/resize in play mode).

---

## 8. **User Interaction Summary**

1. **Dashboard**: A simple grid of slideshow “cards.” Each card has a thumbnail, name, and maybe a 3-dot menu for rename/delete. A floating “+” to create a new slideshow.
2. **Editor**:
   - **Slides** are displayed (each slide in a stack or list). The user can add new slides, rename the slideshow, etc.
   - On each slide, a “+” button to add text, image, or video cards. The user can also generate memes.
   - **Card-based** interface: each card can be dragged and resized like the example images show.
3. **Play Mode**:
   - One slide at a time is displayed in a new tab with navigation arrows at the bottom.
   - A minimal UI: just the slide content (cards arranged in a read-only layout) and the nav bar.
   - Speedometer widget for comedic load-time stats.

---

## 9. **Risks & Mitigations**

| **Risk**                                       | **Mitigation**                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------- |
| Short **2-day** timeline                       | - Stick to the described UI flow. <br>- Defer advanced styling if time is tight. |
| **Complex card drag/resize**                   | - Use a library like `vue-drag-resize` or `VueDraggableResizable`.               |
| **Usage limits** for OpenAI/Translate          | - Firestore usage doc. Show comedic fallback on exceed.                          |
| **Performance** if many images or large videos | - Encourage smaller media. Optimize images if time allows.                       |
| **Data merges** during autosave conflicts      | - Single-user usage only; rely on Firestore merges.                              |

---

## 10. **Acceptance Criteria**

1. **Functional**

   - Dashboard “cards” for each slideshow.
   - Editor with multiple slides, each containing multiple draggable/resizable cards.
   - Meme generation limited to 3/day, comedic fallback after.
   - Translation for text cards, limited to 10/day.
   - “Play” mode in a new tab with arrows to flip slides.

2. **Performance**

   - Speedometer: < 2s load time on average.
   - JS bundle ~1 MB or less.
   - Comedic lines about speed.

3. **Security**

   - Firebase Auth + Firestore rules (`ownerId === user.uid`).
   - Environment variables for OpenAI/Google.

4. **Usability**
   - Clear plus buttons for adding slides/cards.
   - Simple drag/resize for each card.
   - Slideshow playback with bottom nav arrows.
   - Comedic usage-limit messages.

---

## 11. **Next Steps**

1. **Day 1**
   - Finish repo/env setup, do **Auth & Dashboard** (Ticket #1).
   - Build **Slideshow Editor (Base)** (Ticket #2).
2. **Day 2**
   - Implement **Card Drag & Resize** (Ticket #3).
   - Add **Meme Generation** (Ticket #4) & **Translation** (Ticket #5).
   - Wrap up with **Play Mode & Performance Widget** (Ticket #6).
   - Launch on Netlify and verify comedic usage-limits.

---

### **Conclusion**

With this PDR, the developer has a **clear** understanding of how users will:

- **Navigate** the dashboard,
- **Add** slides/cards via a **plus button**,
- **Rearrange** these cards visually,
- **Generate** comedic AI memes,
- **Translate** text, and
- **Play** the resulting slideshow with next/prev arrows in a new tab.

All while autosaving to Firestore and respecting comedic usage limits. This ensures a straightforward **2-day** build with minimal ambiguity. Happy coding!
