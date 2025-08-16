Amber is being deployed for blockchain organizations, where each brand/org already has an existing community on **Discord**. Ambassadors are members of these communities, and they authenticate using Discord to access the Amber platform.

When an ambassador logs in:

* They authenticate with Discord.  
* Amber fetches their Discord profile (username, server memberships, role, etc.).  
* Ambassador selects which organization/community they are working for (if in multiple Discords).  
* They are redirected to that org's custom workspace within Amber.

Rewards, gamification, and leaderboards are critical for ambassador motivation.

---

## **🚀 Ambassador Journey: Step-by-Step Breakdown**

### **1\. Authentication & Org Selection**

* Sign in/Sign up via Discord OAuth2 and Gmail and Manual  
* Fetch Discord profile (avatar, tag, user ID).  
* Fetch list of Discord servers the user belongs to.  
* If user is in multiple Amber-partnered servers:  
  * Show org selection screen.  
  * Allow user to switch org later from their dashboard.

### **2\. Ambassador Dashboard (Org-specific)**

* Welcome message with ambassador name & profile pic.  
* Stats preview:  
  * Current Points  
  * Rank (Leaderboard position)  
  * Pending Tasks  
  * Total Rewards Earned  
* Quick access:  
  * View Assigned Tasks  
  * Submit New Task  
  * Check Leaderboard  
  * Wallet & Earnings

### **3\. Task Management**

* **Task List View**:  
  * Tasks grouped by status: Pending / In Review / Approved / Rejected.  
  * Tasks include: Title, Description, Deadline, Reward Points.  
* **Task Detail Page**:  
  * OKR or Campaign context  
  * Attachments / Required format  
  * Submit proof (link or upload)  
  * Submission status & feedback

### **4\. Task Submission Flow**

* Click on task \> Submit  
* Form:  
  * Upload screenshot (if required)  
  * Paste social link (e.g., X, IG, TikTok, YouTube)  
  * Optional: Add caption/context  
* Confirmation screen  
* Backend triggers n8n verification flow

### **5\. Points & Rewards Tracking**

* View total accumulated points  
* View reward breakdown (tasks, referrals, bonuses)  
* Conversion rate: 100 points \= $X  
* Claim payout button (if threshold met)  
* Reward claim history (status: pending, successful, failed)

### **6\. Leaderboard & Gamification**

* Real-time leaderboard with:  
  * Rank, Username, Avatar, Points  
  * Filter by Campaign / Cohort / Week / Month  
* Badges (earned milestones):  
  * E.g. "Top 10 of the Week", "Referral Champion", "Consistent Contributor"  
* Progress tracker: e.g., "You need 24 more points to reach Top 10"

### **7\. Profile & Settings**

* View/update Discord-connected info  
* Choose default org (if in multiple)  
* Notification preferences (email, Discord bot DM, etc.)

