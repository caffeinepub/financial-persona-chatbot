# Specification

## Summary
**Goal:** Build a financial persona chatbot with a results dashboard — a guided 5-question chat flow that computes 5 persona scores and displays them as donut charts on a dashboard.

**Planned changes:**
- Chatbot conversational UI presenting 5 financial questions sequentially as message bubbles, with a progress indicator (e.g., "1 of 5")
- Question 1: Multiselect chips for asset class preferences (FD/RD/Savings, Gold/Silver/ETFs, Real Estate, MFs/Equity, Debt)
- Question 2: Numeric fill-in-the-blank input with INR label for monthly income
- Question 3: Multiselect with conditional INR amount inputs per loan type; "No Loans" disables all other options
- Question 4: Percentage fill-in-the-blank input (0–100) for family contribution
- Question 5: Multiselect for upcoming expenses with a free-text input only for "Other" option
- Backend scoring engine (Motoko) that accepts all 5 answers and returns 5 integer scores (0–100): Risk Appetite, Debt Profile, Earning Potential, Emergency Broke Likelihood, Upcoming Expense Fulfillment Likelihood
- Results dashboard rendered after submission, showing 5 individual donut charts — each with label, numeric score, and qualitative descriptor — in a responsive grid layout
- Dark navy/slate theme with gold and teal accents, card-based layouts, distinct bot/user message bubbles

**User-visible outcome:** Users complete a guided 5-question financial chat, then see a premium fintech-style dashboard with 5 personalized persona scores visualized as donut charts.
