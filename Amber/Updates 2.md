## **1\. On-Chain Rewards (Crypto/Token Distribution)**

* **Direct Wallet Payouts:**  
  * Amber integrates with the ecosystem’s blockchain (e.g., Stellar SDK for Lumens/XLM).  
  * Each ambassador connects their wallet (Stellar, Solana, etc.) to Amber.  
  * When tasks are verified, rewards are automatically sent via smart contract or API call.  
  * Supports **batch payouts** to reduce transaction fees.  
* **Custom Token Support:**  
  * Ecosystem-native tokens (e.g., a Stellar ecosystem might use a project’s token).  
  * Amber handles token contract integration for automated distribution.

---

## **2\. Off-Chain Rewards (Fiat, Gift Cards, Merchandise)**

* **Voucher/Gift Card API:**  
  * Integration with platforms like Tremendous, Bitrefill, or local providers.  
  * Ambassadors redeem points for vouchers.  
* **Manual Fulfillment:**  
  * For physical goods (merch, event tickets), Amber generates a fulfillment list for the organization.

---

## **3\. Hybrid Points System**

* **Amber Points:**  
  * Ambassadors earn points for completed tasks.  
  * Points can be redeemed for either on-chain rewards or off-chain perks.  
  * Organizations can pre-fund a reward pool in crypto or fiat.  
* **Dynamic Reward Conversion:**  
  * Admins can set point-to-token or point-to-fiat conversion rates.  
  * Ensures flexibility for both global and local ambassadors.

---

### **Reward Distribution Flow Example (Stellar Integration)**

1. **Task Creation:** Admin posts a task/mission with a reward in tokens or points.  
2. **Task Completion:** Ambassador completes the task and submits proof (via link, screenshot, or on-chain activity).  
3. **Verification:** Task is auto-verified (via API) or manually approved by an admin.  
4. **Payout Trigger:** Smart contract/API sends reward to ambassador’s wallet, or points are credited to their Amber account.  
5. **Reward History:** Ambassador sees payout history in their dashboard.

**1\. Country-Based Organization Structure**

* **Multi-Level Hierarchy:**  
  * **Global Admin (Stellar Core Team):** Full visibility across all countries.  
  * **Country Head (e.g., Nigeria Lead):** Manages only ambassadors in their country.  
  * **Regional Ambassador:** Oversees ambassadors in a specific city/region under a Country Head.  
  * **Regular Ambassador:** Executes tasks/missions, reports to a Regional or Country Head.  
* **Dynamic Role Assignment:**  
  * Roles (Head, Lead, Ambassador) are tied to a **geographic tag** (country, state, or city).  
  * Allows easy filtering for country-specific campaigns.

---

## **2\. Role & Permission System**

* **Global Admin:**  
  * Creates tasks for all countries.  
  * Sees analytics across the whole network.  
  * Approves or escalates disputes.  
* **Country Head:**  
  * Posts country-specific missions.  
  * Approves ambassadors for that country.  
  * Manages payouts for their own country’s reward pool.  
* **Ambassador:**  
  * Sees only missions assigned to their country or region.  
  * Can request to join missions outside their region (pending approval).

---

## **3\. Country & Region Dashboards**

* **Global Dashboard:** For Stellar’s main team to see activity broken down by country.  
* **Country Dashboard:** Shows local tasks, completion rates, rewards distributed, and top-performing ambassadors.  
* **Regional Dashboard:** Optional — for sub-country leads to monitor city-based performance.

---

## **4\. Reward Pools by Country**

* **Separate Reward Wallets:**  
  * Each country can have its own funded wallet in Stellar tokens.  
  * Amber ensures payouts from the correct pool.  
* **Multi-Currency Support:**  
  * If a country prefers local stablecoins or gift cards, Amber can configure it without affecting others.

---

## **5\. Task Assignment Logic**

* Missions can be:  
  * **Global:** Visible to all ambassadors.  
  * **Country-Specific:** Only ambassadors in that country see them.  
  * **Region-Specific:** Narrowed down to cities or communities.

---

## **6\. Communication & Coordination**

* Built-in **country forums or group chats** (integrated with Discord/Telegram APIs).  
* Event scheduling tools for country meetups.  
* Announcement channels for quick communication from country heads to members.

