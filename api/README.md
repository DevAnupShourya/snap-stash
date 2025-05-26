```
npm install
npm run dev
```

```
open http://localhost:3000
```

## Folder Structure
```
api/
│
├── src/
│   ├── index.ts                  # Hono app setup (entry point)
│   ├── config/
│   │   ├── db.ts               # MongoDB connection via Mongoose
│   │   └── env.ts              # Environment variables
│   │
│   ├── models/
│   │   └── User.model.ts       # Mongoose models (User, etc.)
│   │
│   ├── routes/
│   │   ├── index.ts            # Combine and export all routes
│   │   └── user.routes.ts      # Routes related to users
│   │
│   ├── controllers/
│   │   └── user.controller.ts  # Controller logic (req → res)
│   │
│   ├── services/
│   │   └── user.service.ts     # Business logic / DB calls
│   │
│   ├── middlewares/
│   │   └── auth.middleware.ts  # Auth, logging, etc.
│   │
│   ├── utils/
│   │   └── helpers.ts          # Reusable helper functions
│   │
│   └── types/
│       └── index.d.ts          # Custom TypeScript types
│
├── .env                        # Secrets, DB URI, etc.
├── package.json
├── tsconfig.json
└── README.md
```
### Database 
- Live [Data](https://cloud.mongodb.com/v2/659ea2e8a6bc5539159942d7#/metrics/replicaSet/683029903dc22f7729da73bf/explorer/test/categories/find)