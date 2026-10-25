# Califnco Admin & Operations Portal (Live Vercel Deployment)

Enterprise administration console for Califnco Water Systems. Allows operations teams to manage incoming customer orders, review and approve B2B wholesale dealers, and dispatch certified service technicians.

---

## 🚀 How to Deploy to Vercel (1-Click)

### Method 1: Using Vercel CLI
```bash
cd c:\Users\HP\Desktop\e-commerce\admin-portal
npx vercel
```
Follow the 3 interactive terminal prompts (Set project name: `califnco-admin`, confirm defaults). Vercel will generate your live production URL (e.g. `https://califnco-admin.vercel.app`) in under 30 seconds!

### Method 2: Git Repository Push
1. Push `admin-portal` folder or entire repository to GitHub.
2. In your [Vercel Dashboard](https://vercel.com/new), import the repository.
3. Select `admin-portal` as the root directory.
4. Click **Deploy**!

---

## 🛠 Features Implemented
1. **Order Management**:
   - Live feed of Customer and Dealer wholesale orders.
   - Status advancement (`Placed` -> `Processing` -> `Shipped` -> `Out for Delivery` -> `Delivered`).
   - Integrated DTDC / Courier tracking ID generator.
2. **Dealer Approvals & B2B Whitelist**:
   - Review pending dealership applications with GSTIN and business details.
   - 1-click **Approve Wholesale Dealer** (assigns ₹2,00,000 credit limit & unlocks wholesale pricing).
   - 1-click **Reject** for unverified entities.
3. **RO Service Desk**:
   - Doorstep repair and maintenance tickets.
   - 1-click Certified Technician assignment (M. Ramesh, V. Prakash, S. Dinesh).
   - Mark service tickets as Resolved / Completed.
4. **Operations KPI Summary**:
   - Real-time gross revenue counter.
   - Active orders counter.
   - Verified dealer count.
   - Field technician dispatch tracker.
