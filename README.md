# Multi-Warehouse Inventory Management System

## Overview
Enhance the existing Multi-Warehouse Inventory Management System built with Next.js and Material-UI (MUI) for GreenSupply Co, a sustainable product distribution company. The current system is functional but needs significant improvements to be production-ready. Your task is to demonstrate your skills across frontend design, backend logic, and practical business problem-solving.

## 🎯 Business Context
GreenSupply Co distributes eco-friendly products across multiple warehouse locations throughout North America. They need to efficiently track inventory across warehouses, manage stock movements, monitor inventory values, and prevent stockouts. This system is critical for their daily operations and customer satisfaction.

## 🛠️ Tech Stack
- [Next.js](https://nextjs.org/) - React framework
- [Material-UI (MUI)](https://mui.com/) - UI component library
- [React](https://reactjs.org/) - JavaScript library
- JSON file storage (for this assessment)

## 📋 Current Features (Already Implemented)
The basic system includes:
- ✅ Products management (CRUD operations)
- ✅ Warehouse management (CRUD operations)
- ✅ Stock level tracking per warehouse
- ✅ Basic dashboard with inventory overview
- ✅ Navigation between pages
- ✅ Data persistence using JSON files

**⚠️ Note:** The current UI is intentionally basic. We want to see YOUR design skills and creativity.

---

## 🚀 Your Tasks (Complete ALL 3)

Each task tests different skills:
- **Task 1:** Frontend/UI/UX skills & creativity
- **Task 2:** Backend logic & data integrity
- **Task 3:** Real-world operational problem solving

---

## Task 1: Redesign & Enhance the Dashboard (Frontend Focus)

**Objective:** Transform the basic dashboard into a beautiful, functional, and insightful command center. Show us your frontend and design skills.

### What We're Testing:
- UI/UX design ability
- Component organization
- Responsive design skills
- Data visualization creativity
- Attention to detail

### Requirements:

**A. Visual Redesign**
The current dashboard is basic and ugly. Make it:
- **Modern & Professional** - Something you'd be proud to show a client
- **Visually Appealing** - Good use of colors, spacing, typography
- **Intuitive** - Easy to understand at a glance
- **Brand Appropriate** - Remember: this is for a sustainable/eco-friendly company

**B. Key Metrics & Data Visualization**
Create an engaging dashboard that shows:

**Required Metrics (choose your own layout):**
- Total inventory value across all warehouses (in dollars)
- Number of products below reorder point (low stock alert count)
- Total number of products/SKUs
- Number of warehouse locations
- Any other metrics you think are valuable

**Required Visualizations (choose 2-3 to implement):**
- Inventory value by warehouse (pie chart, bar chart, or your creative take)
- Stock status distribution (how many products are critical/low/adequate/overstocked)
- Top 5-10 most valuable products by total inventory value
- Products by category breakdown
- Or propose your own visualization that adds business value

**C. Enhanced Inventory Table**
Improve the current inventory overview table:
- Better visual hierarchy
- Color coding for stock status (critical = red, low = yellow, good = green)
- Sortable columns (click header to sort)
- Search/filter functionality (by product name, category, or stock status)
- Responsive design (table should work on mobile - consider card layout)
- Show which warehouse has the most/least stock for each product

**D. Technical Requirements**
- Use a charting library: [Recharts](https://recharts.org/), [Chart.js](https://www.chartjs.org/), [Nivo](https://nivo.rocks/), or your choice
- Fully responsive (test on mobile, tablet, desktop)
- Smooth animations/transitions where appropriate
- Loading states while data fetches
- No console errors

### What We Want to See:
- 🎨 **Your design taste** - Do you have an eye for good UI?
- 🧩 **Component structure** - Clean, reusable components
- 📱 **Mobile-first thinking** - Does it work beautifully on phones?
- 💡 **Creativity** - Surprise us with something clever or beautiful
- 🎯 **Business focus** - Is it actually useful, or just pretty?

### Success Criteria:
- Dashboard looks professional and modern (10x better than current)
- Charts display accurate, real-time calculated data
- Responsive and works smoothly on all screen sizes
- Intuitive and easy to navigate
- Code is clean and well-organized

---

## Task 2: Implement Stock Transfer System (Backend Focus)

**Objective:** Build a complete stock transfer workflow with proper business logic, validation, and data integrity. Show us your backend and data handling skills.

### What We're Testing:
- Business logic implementation
- Data validation & integrity
- API design
- Error handling
- Understanding of database concepts

### Requirements:

**A. Data Structure**
Create a new file: `data/transfers.json` with this structure:
```json
[
  {
    "id": 1,
    "productId": 2,
    "fromWarehouseId": 1,
    "toWarehouseId": 3,
    "quantity": 100,
    "reason": "Restocking regional warehouse",
    "transferDate": "2025-01-15T14:30:00Z",
    "status": "completed",
    "createdBy": "System Admin"
  }
]
```

**B. API Endpoint**
Create `/api/transfers` that handles:

**POST /api/transfers** - Create new transfer
- Accepts: productId, fromWarehouseId, toWarehouseId, quantity, reason
- **CRITICAL VALIDATION:**
  - ✅ Source warehouse must have enough stock (quantity >= requested amount)
  - ✅ Source and destination warehouses cannot be the same
  - ✅ Quantity must be positive integer
  - ✅ Product and warehouses must exist
- **ATOMIC UPDATE:** 
  - Decrease stock at source warehouse
  - Increase stock at destination warehouse
  - Create transfer record
  - **ALL THREE must succeed, or ALL THREE must fail** (data integrity)
- Returns: Success message with transfer details OR detailed error message

**GET /api/transfers** - Retrieve transfer history
- Returns all transfers with product and warehouse names (not just IDs)
- Optional: support filtering by productId, warehouseId, or date range

**C. Transfer Page UI**
Create `/transfers` page with:

**Transfer Form:**
- Select product (dropdown showing: SKU - Product Name)
- Select source warehouse (dropdown showing: Code - Name - Location)
- Select destination warehouse (should exclude source from options)
- Quantity input (with validation)
- Reason/Notes (text area)
- Submit button (disabled while submitting)
- Display current available stock when product + source selected

**Transfer History Table:**
- Date/Time
- Product (name & SKU)
- From Warehouse → To Warehouse (with arrow icon)
- Quantity
- Reason
- Status badge
- Sort by date (newest first)

**D. Error Handling**
Your system must gracefully handle:
- Insufficient stock (show: "Only 50 units available at Main DC")
- Invalid warehouse selection
- Network errors
- Concurrent transfer attempts (edge case: what if stock is transferred twice simultaneously?)

### What We Want to See:
- 🧠 **Logical thinking** - Proper validation sequence
- 🔒 **Data integrity** - No way to corrupt stock levels
- 🐛 **Error handling** - User-friendly error messages
- 📊 **Data relationships** - Joining data from multiple JSON files
- 🎯 **Edge cases** - You thought about what could go wrong

### Success Criteria:
- Cannot transfer more stock than available (validation works)
- Stock levels always accurate after transfers
- Clear error messages guide the user
- Transfer history is complete and accurate
- Code handles edge cases gracefully
- API responses are well-structured

---

## Task 3: Build Low Stock Alert & Reorder System (Operations Focus)

**Objective:** Create a practical system that helps warehouse managers identify and act on low stock situations. Show us you understand real business needs.

### What We're Testing:
- Understanding of business operations
- Practical problem-solving
- User-focused design
- Calculation accuracy
- Actionable insights

### Requirements:

**A. Alert Detection Logic**
Calculate which products need attention:

**Stock Status Categories:**
- 🔴 **CRITICAL:** Total stock < 20% of reorder point
- 🟡 **LOW:** Total stock between 20-100% of reorder point  
- 🟢 **ADEQUATE:** Total stock between 100-300% of reorder point
- 🔵 **OVERSTOCKED:** Total stock > 300% of reorder point

**Note:** Total stock = sum across ALL warehouses

**B. Alerts Page**
Create `/alerts` page showing:

**Alert Cards/Table with:**
- Product name & SKU
- Current total stock (across all warehouses)
- Reorder point threshold
- Stock deficit (how many units below reorder point)
- **Recommended reorder quantity:** 
  ```
  Formula: (Reorder Point × 2) - Current Stock
  Minimum: Reorder Point
  ```
- Status badge (Critical/Low/Adequate/Overstocked)
- Breakdown by warehouse (expandable section showing stock at each location)

**Filtering & Sorting:**
- Filter by status (Critical, Low, All)
- Filter by category
- Sort by: severity, product name, deficit amount

**Action Buttons:**
- "Mark as Ordered" (changes status, adds timestamp)
- "View Product Details" (links to product)
- Optional: "Generate PO" button (just shows what a PO would look like)

**C. Dashboard Integration**
Add to main dashboard (Task 1):
- Alert summary card showing count of critical/low items
- Color-coded badges (red for critical, yellow for low)
- Click to navigate to alerts page
- Visual indicator for critical alerts (optional: pulse animation, notification badge)

**D. Persistence**
Create `data/alerts.json` to track:
```json
[
  {
    "id": 1,
    "productId": 5,
    "status": "active",
    "severity": "critical",
    "detectedDate": "2025-01-10",
    "orderedDate": null,
    "orderedBy": null,
    "notes": ""
  }
]
```

### What We Want to See:
- 📊 **Accurate calculations** - Math is correct across warehouses
- 💼 **Business understanding** - You get why this matters
- 🎯 **Actionable design** - Helps users make decisions quickly
- 📈 **Useful recommendations** - Reorder quantities make sense
- 🚀 **Practical UX** - A warehouse manager could actually use this

### Success Criteria:
- Correctly identifies products below reorder point
- Calculations account for stock across all warehouses
- Clear, actionable recommendations
- Easy to filter and find critical items
- Alert status can be updated (mark as ordered)
- Integrates seamlessly with dashboard

---

## 📦 Getting Started

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

### Project Structure
```
inventory-management-task/
├── data/
│   ├── products.json      # Product data
│   ├── warehouses.json    # Warehouse data
│   ├── stock.json         # Stock level data
│   ├── transfers.json     # YOU CREATE - Transfer records
│   └── alerts.json        # YOU CREATE - Alert tracking
├── src/
│   ├── pages/
│   │   ├── index.js       # Dashboard - YOU REDESIGN
│   │   ├── transfers/     # YOU CREATE
│   │   ├── alerts/        # YOU CREATE
│   │   └── api/
│   │       └── transfers/ # YOU CREATE
└── package.json
```

---

## 📝 Submission Requirements

### 1. Code Submission
- Push your code to **your own GitHub repository** (fork or new repo)
- Clear commit history showing your progression
- Update `package.json` with any new dependencies
- Application must run with: `npm install && npm run dev`

### 2. Video Explanation (5-10 minutes) - REQUIRED ⚠️

**Part 1: Feature Demo (4-5 minutes)**
- Walk through redesigned dashboard (show responsiveness on mobile)
- Demonstrate stock transfer (successful transfer + validation errors)
- Show alert system (critical items, recommendations, mark as ordered)

**Part 2: Code Explanation (3-4 minutes)**
- Explain your dashboard design decisions
- Show transfer API logic (especially data integrity handling)
- Explain alert calculations
- Discuss most challenging part and how you solved it

**Part 3: Reflection (1-2 minutes)**
- What you're most proud of
- What you'd improve with more time
- Any trade-offs you made

**Upload to:** YouTube (unlisted), Loom, or any video hosting platform

### 3. Update This README

Add a section at the bottom:
```markdown
## 🎯 Implementation Summary

**Developer:** [Your Name]
**Completion Time:** [X hours over Y days]
**Live Demo:** [Optional - Vercel/Netlify link]

### Features Completed
- ✅ Task 1: Dashboard Redesign
- ✅ Task 2: Stock Transfer System  
- ✅ Task 3: Low Stock Alerts

### Design Decisions
- Chose [chart library] because...
- Implemented [specific approach] for transfers because...
- Decided to [choice] for alerts because...

### Known Issues/Limitations
- [List any bugs or incomplete features]
- [What would you fix with more time]

### How to Test
1. Dashboard: Visit homepage, resize browser to see responsive design
2. Transfers: Go to /transfers, try to transfer more stock than available (should error)
3. Alerts: Visit /alerts, should see products below reorder point

### Dependencies Added
- `recharts` - For dashboard visualizations
- [any others]
```

---

## ⏰ Timeline: 3 Days

You have **72 hours** from receiving this task to submit:
1. GitHub repository link
2. Video walkthrough
3. Updated README

### Why 3 Days?
We need developers who can deliver under real client deadlines. This timeline tests:
- ✅ Your ability to prioritize and deliver
- ✅ Problem-solving speed and efficiency
- ✅ How you work under pressure (like real projects)

### Time Management Suggestion:
- **Day 1:** Task 2 (Transfers - backend logic) - 5-6 hours
- **Day 2:** Task 1 (Dashboard redesign) - 5-6 hours  
- **Day 3:** Task 3 (Alerts) + polish + video - 5-6 hours

**Total Estimated Time:** 15-18 hours over 3 days

---

## ✅ Evaluation Criteria

### Frontend Skills (35%) - Task 1
- Visual design and aesthetics
- Component organization and code quality
- Responsive design implementation
- Charts/visualizations execution
- Creativity and attention to detail

### Backend Skills (35%) - Task 2
- Business logic correctness
- Data validation and integrity
- API design and error handling
- Understanding of data relationships
- Edge case handling

### Problem Solving (20%) - Task 3
- Calculation accuracy
- Practical/operational thinking
- User experience decisions
- Feature completeness

### Overall Polish (10%)
- Code quality and organization
- Commit history and documentation
- Video explanation clarity
- Production-readiness

---

## 💡 Tips for Success

**Do's:**
- ✅ Start with what you're least comfortable with (get it out of the way)
- ✅ Commit frequently (shows your thought process)
- ✅ Test edge cases (insufficient stock, empty data, mobile view)
- ✅ Make it look professional (first impressions matter)
- ✅ Ask yourself: "Would I show this to a paying client?"

**Don'ts:**
- ❌ Leave console errors or warnings
- ❌ Skip validation because "it works without it"
- ❌ Use hardcoded data instead of real calculations
- ❌ Make it "work" but look unprofessional
- ❌ Skip the video (automatic rejection)

---

## 🎯 What Different Scores Mean

**Outstanding (Top 10%):**
- All 3 tasks complete and polished
- Beautiful UI that shows design skill
- Flawless business logic with no data integrity issues
- Clean, well-organized code
- **Result:** Immediate hire, top compensation

**Strong (Top 30%):**
- All 3 tasks functional, minor bugs acceptable
- Good UI that's clean and professional
- Solid logic with proper validation
- Good code organization
- **Result:** Hire for trial period, very likely to keep

**Acceptable (Top 50%):**
- 2-3 tasks working, some rough edges
- Decent UI, functional but not polished
- Basic logic works, might miss some edge cases
- Code is understandable
- **Result:** Consider for trial, needs mentorship

**Below Bar:**
- Only 1 task or broken features
- Unprofessional UI or doesn't work on mobile
- Logic is buggy or doesn't handle errors
- Messy code or doesn't run
- **Result:** Pass

---

## 🏆 Bonus Points (Optional)

If you finish early and want to impress:
- 🌟 Deploy to Vercel/Netlify with live demo link
- 🌟 Add dark mode toggle
- 🌟 Export alerts to CSV/PDF
- 🌟 Keyboard shortcuts (e.g., press 'T' to open transfer form)
- 🌟 Advanced filtering (date ranges, multi-select)
- 🌟 Animated transitions and micro-interactions
- 🌟 Accessibility features (ARIA labels, keyboard navigation)
- 🌟 Unit tests for critical business logic
- 🌟 TypeScript conversion
- 🌟 Your own creative feature (document why it's valuable)

**Remember:** Perfect execution of 3 required tasks > Partial execution + bonuses

---

## 🤔 Questions?

**Q: Can I use libraries beyond what's listed?**
A: Yes! Just add them to package.json and explain your choices.

**Q: What if I run into a blocker?**
A: Document your blocker, explain your attempted solutions, and move to the next task. We want to see problem-solving, not perfection.

**Q: Can I change the data structure?**
A: You can add fields to existing files, but don't break the current structure.

**Q: Is design more important than functionality?**
A: Both matter. A beautiful but broken app is bad. An ugly but functional app is also bad. Aim for both.

**Q: What if I don't finish everything?**
A: Submit what you have! Partial completion with good quality > rushed completion with bugs.

---

## 📄 License

This is a technical assessment project. Code should not be used for commercial purposes.

---

## 🚀 Good Luck!

We're excited to see what you build. This task is designed to challenge you while giving you room to show off your skills and creativity.

**Remember:** We're not looking for perfection - we're looking for developers who can deliver production-quality work under real-world constraints. Show us what you can do! 💪

---

**Questions or issues with setup?** Check that Node.js is installed and you're using a modern browser.
