# WebStorm pnpm Workspace Auto-Import Issue Reproduction

This repository reproduces the auto-import issue in WebStorm when using pnpm workspaces with scoped packages.

## Issue Description

When using workflows with pnpm, the automatic import features don't work unless a particular file has been already imported into a particular package.

### Problem Details

- **Workspace Setup**: Two packages in pnpm workspace: `@my-org/my-project-core` and `@my-org/my-project-api`
- **Dependency**: API package depends on core package via `"@my-org/my-project-core": "workspace:*"`
- **Expected Behavior**: WebStorm should auto-import functions/types from core package when typing in API package
- **Actual Behavior**: Auto-import doesn't work until you manually import a function first, then only that specific function works

## Project Structure

```
├── packages/
│   ├── core/                          # @my-org/my-project-core
│   │   ├── src/
│   │   │   ├── index.ts              # Main exports
│   │   │   ├── utils.ts              # Utility functions (validateEmail, formatDate, etc.)
│   │   │   ├── types.ts              # TypeScript interfaces and types
│   │   │   ├── services/
│   │   │   │   └── UserService.ts    # User service class
│   │   │   └── api/
│   │   │       └── ApiClient.ts      # HTTP client class
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api/                           # @my-org/my-project-api
│       ├── src/
│       │   ├── index.ts              # Main exports
│       │   ├── controllers/
│       │   │   └── UserController.ts # Uses core functions (should auto-import)
│       │   ├── middleware/
│       │   │   └── AuthMiddleware.ts # Uses core functions (should auto-import)
│       │   └── routes/
│       │       └── ApiRouter.ts      # Uses core functions (should auto-import)
│       ├── package.json
│       └── tsconfig.json
├── package.json                       # Root workspace config
├── pnpm-workspace.yaml               # pnpm workspace definition
└── tsconfig.json                     # Root TypeScript config
```

## Reproduction Steps

### Prerequisites
1. Install pnpm: `npm install -g pnpm`
2. Open this project in WebStorm

### Steps to Reproduce

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Open API Package Files**: Navigate to any file in `packages/api/src/` (e.g., `UserController.ts`)

3. **Try Auto-Import**: 
   - Look for functions like `validateEmail`, `UserService`, `ApiClient`, etc. that are used but not imported
   - Try to trigger auto-import by:
     - Placing cursor on the unresolved symbol
     - Using Alt+Enter (or Cmd+Enter on Mac)
     - Using Ctrl+Space for code completion

4. **Expected vs Actual**:
   - **Expected**: WebStorm should suggest importing from `@my-org/my-project-core`
   - **Actual**: No auto-import suggestions appear

5. **Manual Import Test**:
   - Manually add one import: `import { validateEmail } from '@my-org/my-project-core';`
   - Now try auto-import for `validateEmail` in other places - it should work
   - Try auto-import for other functions like `formatDate` - it still won't work

## Files Demonstrating the Issue

### Core Package Exports (`packages/core/src/index.ts`)
```typescript
export { validateEmail, formatDate } from './utils';
export { UserService } from './services/UserService';
export { ApiClient } from './api/ApiClient';
export type { User, ApiResponse } from './types';
```

### API Package Files Using Core Functions

1. **`packages/api/src/controllers/UserController.ts`**:
   - Uses: `UserService`, `validateEmail`, `User`, `capitalize`, `formatDate`
   - All should auto-import from `@my-org/my-project-core`

2. **`packages/api/src/middleware/AuthMiddleware.ts`**:
   - Uses: `ApiClient`, `generateId`, `ApiResponse`
   - All should auto-import from `@my-org/my-project-core`

3. **`packages/api/src/routes/ApiRouter.ts`**:
   - Uses: `UserService`, `ApiClient`, `User`, `validateEmail`, `capitalize`, `formatDate`, `CreateUserRequest`, `UpdateUserRequest`, `ApiResponse`, `generateId`
   - All should auto-import from `@my-org/my-project-core`

## Expected Behavior

When typing any of these functions/types in the API package files:
- `validateEmail` → should suggest import from `@my-org/my-project-core`
- `UserService` → should suggest import from `@my-org/my-project-core`
- `ApiClient` → should suggest import from `@my-org/my-project-core`
- `User` → should suggest import from `@my-org/my-project-core`
- etc.

## Workaround

Currently, you need to manually import each function/type once, then auto-import works for that specific symbol in other places within the same package.

## Environment

- **IDE**: WebStorm (any recent version)
- **Package Manager**: pnpm
- **Workspace Type**: pnpm workspace with scoped packages
- **TypeScript**: Enabled with proper configuration
- **Dependency Type**: `workspace:*` dependency

## Additional Notes

- This issue specifically affects pnpm workspaces with scoped package names
- The problem persists even with proper TypeScript configuration
- Manual imports work fine, but defeat the purpose of auto-import functionality
- Once a symbol is manually imported, auto-import works for that specific symbol but not others
