# Monu Gents Parlour — Queue & Salon Management App

A React Native (Expo) + Firebase Firestore queue, chair, rate card, and earnings management application built for **Monu Gents Parlour** (Azadnagar, Gomoh, Dhanbad, Jharkhand).

## Key Features

### Customer Experience
- **Live Queue & Estimated Wait Time:** Real-time visibility into 2-chair occupancy, waiting queue count, and estimated wait time on Home and Services screens.
- **Per-Device Active Passes:** Tokens booked on a device are persisted locally (`AsyncStorage`) so each customer only sees their own active pass (`#Q-01`, `#Q-02`, ...).
- **Token Cancellation & Completed Card Dismiss:** Customers can cancel waiting tokens directly or dismiss completed cards (`✕`) after/without rating.
- **Ratings & Store Directory:** Submit star ratings/feedback, view parlour photos, and open Google Maps, Instagram, YouTube, or direct call actions.
- **Bilingual Support:** English and Hindi (`हिंदी`) support across customer and owner views.

### Owner Admin Console
- **2-Chair Command Center (`Floor`):** Toggle shop open/closed status (`isOnline`), view active customers on Chair 01 and Chair 02, adjust final prices, choose payment mode (`CASH` / `UPI`), and complete services.
- **Walk-In & Live Queue (`Queue`):** Generate walk-in tokens with active service selection (`OwnerWalkInCard`), view queue position & estimated wait, call customers, mark no-show/skip, or seat customers on Chair 1 / Chair 2.
- **Earnings & Reports (`Earnings`):** Track revenue across `TODAY`, `WEEK`, `MONTH`, and `YEAR` with Cash/UPI split, per-chair stats, dynamic **Service Summary** based on active services, ledger history, and CSV export including monthly and yearly summaries.
- **Settings & Rate Card (`Settings`):** Manage services (add, adjust price `+/-`, delete), update salon contact number, configure Google Maps / Instagram / YouTube links, update hero portrait, and change admin password.

## Tech Stack
- **Frontend:** React Native, Expo, TypeScript
- **Backend / Realtime DB:** Firebase Firestore
- **Local Persistence:** `@react-native-async-storage/async-storage`

## Project Structure

```text
├── app/
├── components/
│   ├── common/
│   ├── customer/
│   │   ├── details.tsx
│   │   ├── home.tsx
│   │   ├── services.tsx
│   │   └── token.tsx
│   └── owner/
│       ├── earnings.tsx
│       ├── floor.tsx
│       ├── queue.tsx
│       ├── settings.tsx
│       └── WalkInCard.tsx
├── config/
│   └── firebase.ts
├── constants/
│   └── theme.ts
├── context/
│   └── SalonContext.tsx
└── types/
    └── database.ts
