# UPS Optimization Tool

This project is a React and TypeScript application built with Vite. It allows you to upload a CSV inventory file and calculates the optimal UPS (Units Per Sheet) distribution across a given number of printing plates. The app includes a login screen, dark mode support, and a PDF export of the results.

## Prerequisites

- Node.js >= 18
- npm (comes with Node.js)

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173` by default.

To create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Login Credentials

Default accounts are defined in `src/services/auth.ts`:

- **Admin:** `horizon` / `HS@Ratio@123!@#`
- **User:** `azeem` / `azeem321`

## Sample Data

A sample CSV file is provided in `public/sample.csv`. Use this file to test the upload and optimization workflow.

## New Features

- **User Profiles** — logged-in users can view their name, role and last login in the header and log out at any time.
- **Optimization Suggestions** — the results view now displays tips to help reduce waste.
- **Advanced Analytics** — an additional waste percentage chart provides deeper insight into plate efficiency.
- **Plate Preview** — visualize how items are distributed across plates.
- **Prediction Panel** — see estimated waste if one more plate were used.
- **Improved Calculations** — optimizer now respects the plate count for leftover items.

## Linting

Run ESLint to check code quality (ensure dependencies are installed with `npm install` first):

```bash
npm run lint
```

## License

This project is provided as-is without a specific license.
