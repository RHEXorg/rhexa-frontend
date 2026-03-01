# 🎨 PHASE 2: FRONTEND DEVELOPMENT - STEP-BY-STEP GUIDE (NO CODE)

## 📊 WHAT YOU'LL BUILD IN FRONTEND

```
FRONTEND = The website users see and interact with

Think of it like:
- Backend = Kitchen (where food is prepared)
- Frontend = Restaurant dining area (where customers eat)
```

---

## 🎯 FRONTEND COMPONENTS BREAKDOWN

### **What the USER sees and does:**

```
1. LANDING PAGE (Homepage)
   - Logo, tagline
   - "Sign up" and "Login" buttons
   - Features overview
   
2. LOGIN PAGE
   - Email input box
   - Password input box
   - "Login" button
   - Link to signup page
   
3. SIGNUP PAGE
   - Full name input
   - Email input
   - Password input
   - Organization name input
   - "Create account" button
   
4. DASHBOARD (after login)
   - Sidebar menu (left side):
     * Dashboard
     * Documents
     * Chat
     * Settings
     * Logout
   
5. DOCUMENTS PAGE
   - List of uploaded files
   - "Upload new file" button
   - Each file shows:
     * Filename
     * Upload date
     * Status (processing/complete)
     * Delete button
   
6. CHAT PAGE
   - Chat history (left panel)
   - Chat messages (center)
   - Input box at bottom
   - Send button
   - Shows AI responses with sources
   
7. SETTINGS PAGE
   - Organization name
   - User profile
   - API keys
   - Billing (future)
```

---

## 📋 PHASE 2 - COMPLETE BREAKDOWN

### **PHASE 2.1: Setup Next.js Project** (Day 1)
**What you do:**
- Install Next.js on your computer
- Install UI libraries (buttons, cards, etc.)
- Create folder structure
- Set up connection to backend

**Files you create:**
- Project folders
- Configuration files
- Environment variables file

**When done:** Empty Next.js app runs on localhost:3000

---

### **PHASE 2.2: Build Login & Signup Pages** (Days 2-3)

#### **Step 2.2.1: Create Login Page**
**What it looks like:**
```
┌─────────────────────────────────┐
│         RheXa Logo              │
│                                 │
│   Welcome Back                  │
│                                 │
│   [Email input box]             │
│   [Password input box]          │
│                                 │
│   [Login Button]                │
│                                 │
│   Don't have account? Sign up   │
└─────────────────────────────────┘
```

**What it does:**
1. User types email and password
2. Clicks "Login" button
3. Frontend sends data to backend `/api/auth/login`
4. Backend returns token
5. Frontend saves token
6. Redirects to dashboard

**Files you create:**
- `app/(auth)/login/page.tsx` - Login page
- `components/auth/LoginForm.tsx` - Login form component
- `lib/api/auth.ts` - API functions for login

---

#### **Step 2.2.2: Create Signup Page**
**What it looks like:**
```
┌─────────────────────────────────┐
│         RheXa Logo              │
│                                 │
│   Create Account                │
│                                 │
│   [Full Name input]             │
│   [Email input]                 │
│   [Password input]              │
│   [Organization Name input]     │
│                                 │
│   [Create Account Button]       │
│                                 │
│   Have account? Login           │
└─────────────────────────────────┘
```

**What it does:**
1. User fills out form
2. Clicks "Create Account"
3. Frontend sends to backend `/api/auth/signup`
4. Backend creates user + organization
5. Returns token
6. Auto-login and redirect to dashboard

**Files you create:**
- `app/(auth)/signup/page.tsx` - Signup page
- `components/auth/SignupForm.tsx` - Signup form

---

#### **Step 2.2.3: User State Management**
**What this means:**
- Remember logged-in user across all pages
- Store user info (name, email, org)
- Check if user is logged in

**Files you create:**
- `lib/store/authStore.ts` - Store user data
- `lib/hooks/useAuth.ts` - Hook to access user data

**How it works:**
```
User logs in → Token saved → User info stored
↓
Every page can check: "Is user logged in?"
If yes → Show dashboard
If no → Redirect to login
```

---

### **PHASE 2.3: Build Dashboard Layout** (Day 4)

#### **Step 2.3.1: Create Dashboard Shell**
**What it looks like:**
```
┌──────────┬────────────────────────────────┐
│          │  Header (top)                  │
│          │  User name, Logout button      │
│ Sidebar  ├────────────────────────────────┤
│          │                                │
│ - Docs   │  MAIN CONTENT AREA             │
│ - Chat   │  (Different pages show here)   │
│ - Settings│                               │
│          │                                │
└──────────┴────────────────────────────────┘
```

**Components:**
- **Sidebar (left):** Navigation menu
- **Header (top):** User info, logout
- **Main area:** Content changes based on page

**Files you create:**
- `app/(dashboard)/layout.tsx` - Dashboard wrapper
- `components/dashboard/Sidebar.tsx` - Left menu
- `components/dashboard/Header.tsx` - Top bar
- `components/dashboard/DashboardShell.tsx` - Container

---

#### **Step 2.3.2: Protected Routes**
**What this means:**
- Only logged-in users can see dashboard
- If not logged in → Redirect to login

**How it works:**
```
User visits /dashboard
↓
Check: Is token in localStorage?
↓
Yes → Show dashboard
No → Redirect to /login
```

**Files you update:**
- Dashboard layout checks authentication

---

### **PHASE 2.4: Build Document Upload Interface** (Days 5-6)

#### **Step 2.4.1: Documents List Page**
**What it looks like:**
```
┌─────────────────────────────────────┐
│  Documents                          │
│  [Upload New File Button]           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📄 sales_report.pdf         │   │
│  │ Uploaded: 2024-01-20        │   │
│  │ Status: ✅ Completed         │   │
│  │ [Delete]                     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📊 products.csv             │   │
│  │ Uploaded: 2024-01-19        │   │
│  │ Status: ⏳ Processing...     │   │
│  │ [Delete]                     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**What it does:**
1. Shows all uploaded documents
2. Each document card displays:
   - Filename
   - Upload date
   - Processing status
   - Delete button

**API call:**
- `GET /api/documents` - Fetch all documents

**Files you create:**
- `app/(dashboard)/documents/page.tsx` - Documents page
- `components/documents/DocumentList.tsx` - List component
- `components/documents/DocumentCard.tsx` - Single card
- `lib/api/documents.ts` - Document API functions
- `lib/hooks/useDocuments.ts` - Hook for documents

---

#### **Step 2.4.2: Upload Dialog**
**What it looks like:**
```
┌─────────────────────────────────┐
│  Upload Document                │
│                                 │
│  ┌───────────────────────────┐ │
│  │  Drag & drop file here    │ │
│  │  or click to browse       │ │
│  └───────────────────────────┘ │
│                                 │
│  Supported: PDF, CSV, Excel    │
│  Max size: 10MB                │
│                                 │
│  [Cancel]  [Upload]            │
└─────────────────────────────────┘
```

**What it does:**
1. User clicks "Upload" button
2. Dialog opens
3. User selects file
4. File uploads to backend
5. Shows progress bar
6. Success message
7. Document appears in list

**API call:**
- `POST /api/upload` - Upload file

**Files you create:**
- `components/documents/UploadButton.tsx` - Upload button + dialog
- `components/documents/UploadProgress.tsx` - Progress indicator

---

### **PHASE 2.5: Build Chat Interface** (Days 7-8)

#### **Step 2.5.1: Chat Layout**
**What it looks like:**
```
┌──────────┬──────────────────────────────┐
│ Chat     │  Current Chat: Sales Q&A    │
│ History  │                              │
│          │  ┌────────────────────────┐  │
│ ○ Sales  │  │ User: What was revenue? │ │
│ ○ Product│  └────────────────────────┘  │
│ ○ Support│                              │
│          │  ┌────────────────────────┐  │
│ [New]    │  │ AI: According to...    │ │
│          │  │ Revenue was $50k       │ │
│          │  │                        │ │
│          │  │ 📄 Source: sales.pdf   │ │
│          │  └────────────────────────┘  │
│          │                              │
│          │  [Type message here...] [→] │
└──────────┴──────────────────────────────┘
```

**Components:**
- **Left panel:** Chat sessions list
- **Main area:** Chat messages
- **Bottom:** Input box
- **AI responses:** Show sources cited

**Files you create:**
- `app/(dashboard)/chat/page.tsx` - Chat page
- `components/chat/ChatInterface.tsx` - Main chat component
- `components/chat/ChatSidebar.tsx` - Chat history
- `components/chat/MessageBubble.tsx` - Single message
- `components/chat/ChatInput.tsx` - Input box
- `components/chat/SourceCard.tsx` - Citation display
- `lib/api/chat.ts` - Chat API functions
- `lib/hooks/useChat.ts` - Chat hook

---

#### **Step 2.5.2: Chat Flow**
**How it works:**

**User asks question:**
```
1. User types: "What's our revenue?"
2. Clicks send button
3. Message appears immediately (user bubble)
4. Shows "AI is thinking..." indicator
5. Frontend sends: POST /api/chat
6. Backend processes (searches docs, asks LLM)
7. Backend responds with answer + sources
8. AI message appears (assistant bubble)
9. Sources shown at bottom of AI message
```

**API calls:**
- `POST /api/chat` - Send message, get response
- `GET /api/chat/sessions` - Get chat history
- `GET /api/chat/sessions/{id}/messages` - Get messages from session

---

#### **Step 2.5.3: Real-time Streaming (Optional)**
**What this means:**
- AI response appears word-by-word (like ChatGPT)
- Not "wait 10 seconds then see full answer"

**User experience:**
```
User: What's our revenue?
↓
AI: According ← (appears)
AI: According to ← (appears)
AI: According to the ← (appears)
AI: According to the sales ← (appears)
AI: According to the sales report... ← (keeps appearing)
```

**This is ADVANCED** - Can add in Phase 4

---

### **PHASE 2.6: Organization Management** (Day 9)

#### **Step 2.6.1: Settings Page**
**What it shows:**
```
┌─────────────────────────────────┐
│  Settings                       │
│                                 │
│  Organization                   │
│  Name: ABC Company              │
│  Created: 2024-01-15            │
│                                 │
│  Your Profile                   │
│  Name: John Doe                 │
│  Email: john@abc.com            │
│  Role: Owner                    │
│                                 │
│  [Change Password]              │
│  [Update Profile]               │
└─────────────────────────────────┘
```

**What user can do:**
- View organization info
- View personal info
- Change password
- Update profile

**Files you create:**
- `app/(dashboard)/settings/page.tsx` - Settings page
- `components/settings/OrgSettings.tsx` - Org section
- `components/settings/ProfileSettings.tsx` - Profile section

---

### **PHASE 2.7: Polish & Testing** (Day 10)

#### **What you do:**

**1. Add Loading States**
- Show spinner when data is loading
- Skeleton screens for documents list
- "Sending..." indicator in chat

**2. Add Error Handling**
- If login fails → Show error message
- If upload fails → Show what went wrong
- If chat fails → Retry button

**3. Add Toast Notifications**
```
┌─────────────────────────┐
│ ✅ File uploaded!       │
└─────────────────────────┘
(appears top-right, disappears after 3 sec)
```

**4. Responsive Design**
- Works on desktop
- Works on tablet
- Works on mobile phone

**5. Testing**
- Sign up → Login → Upload → Chat → Logout
- Test all buttons work
- Test error cases

---

## 📊 FRONTEND ARCHITECTURE EXPLAINED

### **How Frontend Connects to Backend:**

```
User Action (Frontend)
↓
API Call (Axios)
↓
Backend receives request
↓
Backend processes
↓
Backend sends response
↓
Frontend receives data
↓
Update UI (user sees result)
```

**Example: Upload Document**
```
1. User selects file
   ↓ (Frontend)
2. FormData created with file
   ↓ (Frontend)
3. POST /api/upload (file sent)
   ↓ (Network)
4. Backend saves file, processes
   ↓ (Backend)
5. Returns doc_id, status
   ↓ (Network)
6. Frontend updates documents list
   ↓ (Frontend)
7. User sees new document in list
```

---

## 🗂️ FILE ORGANIZATION EXPLAINED

### **Why we organize like this:**

```
app/
├── (auth)/          ← Pages WITHOUT sidebar (login, signup)
└── (dashboard)/     ← Pages WITH sidebar (docs, chat, settings)
```

**Reason:** Different layouts for different sections

---

```
components/
├── auth/            ← Login/signup forms
├── dashboard/       ← Sidebar, header (shared across pages)
├── documents/       ← Document-specific components
└── chat/            ← Chat-specific components
```

**Reason:** Group related components together

---

```
lib/
├── api/             ← Functions that call backend
├── store/           ← Global state (user info, chat data)
└── hooks/           ← Reusable React hooks
```

**Reason:** Separate business logic from UI

---

## 🎯 WHAT YOU NEED TO KNOW

### **Technologies Used:**

| Technology | What It Is | Why We Use It |
|------------|-----------|---------------|
| **Next.js** | React framework | Makes React websites faster, easier |
| **TypeScript** | JavaScript with types | Catches errors before running |
| **Tailwind CSS** | CSS framework | Style components quickly |
| **Shadcn UI** | Component library | Pre-built beautiful buttons, cards, etc. |
| **Axios** | HTTP client | Call backend APIs easily |
| **Zustand** | State management | Share data between components |
| **React Query** | Data fetching | Cache API responses, auto-refresh |

---

### **Key Concepts:**

**1. Components**
- Reusable pieces of UI
- Example: `<Button>` can be used 100 times

**2. State**
- Data that changes
- Example: User logged in? (true/false)

**3. Props**
- Data passed to components
- Example: `<Button text="Login" />`

**4. Hooks**
- Functions that add functionality
- Example: `useAuth()` - Get current user

**5. API Calls**
- Frontend asks backend for data
- Example: `GET /api/documents` - Get list of files

---

## 📋 PHASE-BY-PHASE CHECKLIST

### **Phase 2.1: Setup** ✅
- [ ] Install Next.js
- [ ] Install UI libraries
- [ ] Create folder structure
- [ ] Create .env.local file
- [ ] Test: App runs on localhost:3000

---

### **Phase 2.2: Authentication** ✅
- [ ] Create login page
- [ ] Create signup page
- [ ] Create auth API functions
- [ ] Create auth store (user state)
- [ ] Test: Can signup, login, logout

---

### **Phase 2.3: Dashboard** ✅
- [ ] Create dashboard layout
- [ ] Create sidebar component
- [ ] Create header component
- [ ] Add protected routes
- [ ] Test: Dashboard shows after login

---

### **Phase 2.4: Documents** ✅
- [ ] Create documents list page
- [ ] Create document card component
- [ ] Create upload button + dialog
- [ ] Add file upload logic
- [ ] Add delete document
- [ ] Test: Upload, view, delete documents

---

### **Phase 2.5: Chat** ✅
- [ ] Create chat page
- [ ] Create chat sidebar (history)
- [ ] Create message bubbles
- [ ] Create input box
- [ ] Add source citations display
- [ ] Connect to chat API
- [ ] Test: Ask question, get answer with sources

---

### **Phase 2.6: Settings** ✅
- [ ] Create settings page
- [ ] Show organization info
- [ ] Show user profile
- [ ] Add update profile form
- [ ] Test: View and update settings

---

### **Phase 2.7: Polish** ✅
- [ ] Add loading spinners
- [ ] Add error messages
- [ ] Add toast notifications
- [ ] Make responsive (mobile-friendly)
- [ ] Test entire flow end-to-end

---

## 🚀 FINAL DELIVERABLE

**After Phase 2, you have:**

✅ Beautiful, professional UI  
✅ Users can signup/login  
✅ Users can upload documents  
✅ Users can chat with their documents  
✅ Multi-tenant (each org has isolated data)  
✅ Responsive design (works on all devices)  

**This is a WORKING MVP that you can:**
- Show to investors
- Use for your portfolio
- Start charging customers

---

## 🎯 READY TO START?

**Reply with:**

```
START PHASE 2.1: NEXT.JS SETUP
I understand:
- I will create frontend that connects to my backend
- Frontend will have login, upload, chat pages
- I will build step-by-step, testing each phase
```

Then I'll give you **EXACT INSTRUCTIONS** (not code, just steps) for Phase 2.1.

Or if you want the **FULL CODE** for any phase, say:
```
GIVE ME CODE FOR PHASE 2.X
```

What do you want? 🔥