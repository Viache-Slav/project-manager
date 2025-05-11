[33mcommit 5becb0522894651e86d1b3165012998d1ba986b4[m[33m ([m[1;36mHEAD -> [m[1;32mmain[m[33m)[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sun May 11 12:44:35 2025 +0200

    feat(auth & backend): Full project synchronization + Google OAuth fixes
    
    - Fixed client_id in Google Cloud + Firebase Authentication
    - Added missing authorized origins and redirect URIs
    - Cleaned up middleware:
        - checkRole is left as role validation
        - protect is responsible for token validation
    - Added CORS settings to backend
    - Checked User model and Track model
    - Added origins for local and prod builds:
        - localhost:5173
        - 127.0.0.1:5173
        - project-manager-rouge.vercel.app
    
    ✅ Status: Frontend + Backend + Firebase synchronized

[33mcommit 32f0692f5dd772f85977ca2dddc31654d976b482[m[33m ([m[1;31morigin/main[m[33m)[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 10 22:57:29 2025 +0200

    feat: switch to JWT authorization + update frontend under JWT

[33mcommit 6dd1fec7c1d967e01c108d9e40dd92c2703e715e[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 10 21:51:18 2025 +0200

    fix

[33mcommit 6693d0d05dc92f52f35b26e3fff7c8acfa0963d2[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 10 21:43:39 2025 +0200

    fix

[33mcommit 6d627224c0dc97e9e389edde6ec333c57214e59d[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 10 21:30:34 2025 +0200

    fix: added PrivateRoute import to App.jsx to fix ReferenceError

[33mcommit 4aba03fb8d3c8155afec4b3fcb2b80c1060c5f14[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 10 21:22:15 2025 +0200

    feat: added PrivateRoute for session validation and dashboard protection

[33mcommit e999b57d7d9da5a35ebea13608b38f54f46fd1d8[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 10 20:38:15 2025 +0200

    fix
    
     - changed express-session setting (saveUninitialized false) to make sessions work correctly between servers

[33mcommit 79a40dd77d2f694bf73b805b98c6a6a2799e4c0c[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 10 20:10:36 2025 +0200

    fix: added user approval checking and email normalization to loginUser

[33mcommit 5dafdda29d9f83473c9425d9d3272336f715630b[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sun May 4 10:28:38 2025 +0200

    fix: configured compatibility for local development and deployment

[33mcommit 0eb405a9c89e016da2836e8a39054dc64a1db126[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 23:06:29 2025 +0200

    fix: correct logout URL by removing duplicate /api prefix

[33mcommit 2a3974831bdcbedaed791b5a0b2a1bfeea62d484[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 23:02:40 2025 +0200

    fix: use env variable for logout redirect in Dashboard

[33mcommit fc14b586b6903861a054c7358fa25ec6fd558e22[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 22:52:31 2025 +0200

    fix: improve logout redirect and ensure cookie is cleared

[33mcommit f8ba683841709771b2127c3d300c059dd96fab49[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 22:36:06 2025 +0200

    fix: use env-based URL for Google login redirect

[33mcommit 00c8dff7c3eb8a72cfdecce8b35ded5200675f9c[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 21:33:10 2025 +0200

    fix: add vercel.json for SPA routing support

[33mcommit 3ec29d4ecbaa79291819fb4e31501a5a1611a772[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 21:15:20 2025 +0200

    fix: enable secure cross-origin session cookies

[33mcommit cdd1c1cc96fac4b42c3aa1abbf666a3a895243bc[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 20:53:07 2025 +0200

    fix: use BACKEND_URL env variable for GoogleStrategy callback

[33mcommit a75e6a4a824b9a7de2976d587faf64911d80767c[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 20:41:06 2025 +0200

    Revert "fix: enable secure cookies for cross-origin session auth"
    
    This reverts commit aab37416bd65a3055e7349454e07d572e44959ca.

[33mcommit 2f31bdc514f5138825a54db182c2229802f841ba[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 20:40:52 2025 +0200

    Revert "feat: add hardcoded admin login fallback (admin@gmail.com / 1111)"
    
    This reverts commit 563a80ffdf04142e6b542df4f2219a48fb459cb8.

[33mcommit 4024dd2b249be183ba82684ec2f4586f44a726f9[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 20:40:41 2025 +0200

    Revert "fix: admin override login now uses mock mongoose object"
    
    This reverts commit fb48003ac91d537db3414f325a9e41a29f405743.

[33mcommit fb48003ac91d537db3414f325a9e41a29f405743[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 20:15:27 2025 +0200

    fix: admin override login now uses mock mongoose object

[33mcommit 563a80ffdf04142e6b542df4f2219a48fb459cb8[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 20:07:53 2025 +0200

    feat: add hardcoded admin login fallback (admin@gmail.com / 1111)

[33mcommit 9e58ac3f0c9aa87afd5a45ca9b919af502a72110[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 19:26:43 2025 +0200

    fix: enable trust proxy to support session cookies over HTTPS

[33mcommit 9b5a1addeaa70ccad678b806a4eec46fd1fe27a6[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 19:06:07 2025 +0200

    fix: restore /user route for authenticated session check

[33mcommit 9fce07bd7c96646d6d85ed661115e68f82717247[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 18:52:20 2025 +0200

    fix
    
     - OAuth redirect and cookie origin support for Google login in production

[33mcommit a964b23f8cc75f6ed645e6dcc98e3672344e440d[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 18:14:48 2025 +0200

    fix: use FRONTEND_URL for redirect after Google login/logout

[33mcommit aab37416bd65a3055e7349454e07d572e44959ca[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 18:08:03 2025 +0200

    fix: enable secure cookies for cross-origin session auth

[33mcommit 3c39c801023c961e0e1680b77f9dbfaee046f9cc[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 17:59:19 2025 +0200

    change FRONTEND_URL in index.js

[33mcommit fd1059a6f699f109159851f8801667e58cecdb38[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 17:45:33 2025 +0200

    ♻️ trigger redeploy for updated env

[33mcommit e7e1061da224508cb09ac0f1769fc62337638f88[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 17:06:20 2025 +0200

    trigger redeploy for correct VITE_API_URL

[33mcommit 74a34d78d762d46e831b42a8c3f1582f63a4b851[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 16:49:29 2025 +0200

    Deploy
    
    - A link to the production backend (Render) is provided
    - Deploy to Vercel and Render

[33mcommit d84214706d6d9df20d811728d9721c81573fe575[m
Author: Viache-Slav <82282144+Viache-Slav@users.noreply.github.com>
Date:   Sat May 3 16:42:36 2025 +0200

    Update README.md
    
    +

[33mcommit 69df7e42a93bb862446464b1ef246073180ea51c[m
Author: Viache-Slav <82282144+Viache-Slav@users.noreply.github.com>
Date:   Sat May 3 16:29:43 2025 +0200

    Update README.md
    
    +

[33mcommit c13f7bdbbfe1a345fc37bb323bdf975b780c7aa9[m
Author: Viache-Slav <82282144+Viache-Slav@users.noreply.github.com>
Date:   Sat May 3 16:18:35 2025 +0200

    Update README.md
    
    +

[33mcommit b720163c5dbfbe5cbf19a7dd46cc0d577e19bbff[m
Author: Viache-Slav <82282144+Viache-Slav@users.noreply.github.com>
Date:   Sat May 3 16:02:21 2025 +0200

    Update README.md
    
    link

[33mcommit 234467a709007603f7b7446a0263b7c4175a5033[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 15:05:01 2025 +0200

    refactor: switch from fetch to axios throughout the frontend
    
    - Added axios-instance to client/src/api/axios.js
    - All components rewritten from fetch to axios:
      - AuthForm.jsx
      - ChooseRolePage.jsx
      - UploadForm.jsx
      - Dashboard.jsx
      - AdminPanel.jsx
      - TrackManager.jsx
    - Queries are now centralized, support credentials and baseURL
    - Behavior unchanged, improved readability and consistency

[33mcommit 3a76cb0c00eb81a0cccf7b1a35140bac474f2614[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat May 3 12:52:30 2025 +0200

    feat: modal window of track creation and alphabetical sorting of products
    
    - TrackManager.jsx component completely rewritten
    - Realized modal window with displaying all items alphabetically
    - Selection of date and time of track sending
    - The total list is presented in several columns via CSS Grid
    - uploadController: added sorting with collation by title (locale: ‘en’, strength: 1)
    - Updated TrackManager.module.css file - styles for modal, grid and fields.
    
    Functionality tested: products are displayed correctly, tracks are created, sorting works.

[33mcommit e79f37eb2ec30c8241637759634030db6997ee91[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Thu May 1 18:39:01 2025 +0200

    feat: refactor track creation form
    
    - Added dynamic product selection in the track creation form
    - Users can add multiple products with quantities for a track
    - Implemented "Add product" functionality to add additional rows to the form
    - Added ability to delete rows from the product list within the form
    - Products fetched dynamically from the backend API
    - Track items are now stored in an array with productId and quantity

[33mcommit 8db710f2492584a7b18a10ebb12b1dd9f4f38509[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Thu May 1 17:30:11 2025 +0200

    feat: add admin TrackManager with track creation
    
    - Added new TrackManager component to the admin dashboard
    - Enables creating production tracks with dispatch time and product distribution
    - Fetches products from backend and saves tracks via POST /api/routes
    - Lists existing tracks via GET /api/routes
    - Uses fetch API with credentials (not axios)
    - Styled using TrackManager.module.css (modular CSS)
    - Backend: added ES module-based trackController and trackRoutes
    - Model Track (ESM) added to MongoDB via Mongoose

[33mcommit 3d308076e8f103f75146dedf3792fdf799de993b[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Mon Apr 28 19:44:38 2025 +0200

    feat: added product uploads for executives
    
    - Created UploadForm component with fields for product name and description
    - Styling in a separate UploadForm.module.css file according to BEM methodology
    - Implemented a secure POST /api/upload route on the server
    - Restricted access to uploading products to users with admin role
    - Prepared server and client structure for future product management.

[33mcommit 63a512e65a9e6614961ea4cf7f80dd46bc0ba6e8[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sun Apr 27 18:44:12 2025 +0200

    Enhance AdminPanel: role handling improvements
    
    - Show role selected by user during registration
    - Allow correction of role only if missing
    - Fix approval process for pending users
    - Improve overall UX for administrators

[33mcommit 5d930c81d440f4195722ba0ff0001ebc3cdadde4[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sun Apr 27 17:17:04 2025 +0200

    Enforce mandatory approval for all users after registration
    
    - Redirect all users to /pending-approval after registration.
    - Fix Dashboard routing: role no longer skips approval check.
    - Ensure safe access to system only after manual confirmation.

[33mcommit fce36f2cd4e7c8231ed6cbe392a9f1abd39f6076[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sun Apr 27 16:36:29 2025 +0200

    Add AdminPanel for user approval with BEM-styling

[33mcommit a61715e39ded69b9d0c501ff07842574d99f8edf[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sun Apr 27 15:57:46 2025 +0200

    Fix Google login flow: add role selection before pending approval

[33mcommit a96b9a3ab670a8e8835aa7fd57f37e96c0cbc2e2[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sun Apr 27 15:48:40 2025 +0200

    Implement role selection, approval system and refine login/register flows

[33mcommit 84b80e68ca78a0a8b95d7e74d8cc4416cdb901a2[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sun Apr 20 15:51:29 2025 +0200

    Remove client.zip from tracking and ignore future ZIP files

[33mcommit db235cc57dd744289da0eed32f37c64ca5ed5211[m
Author: Viache-Slav <82282144+Viache-Slav@users.noreply.github.com>
Date:   Sun Apr 20 15:48:18 2025 +0200

    Delete client.zip

[33mcommit e737886a902e9338eb0629197d251fac70e6fcbd[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sun Apr 20 15:44:56 2025 +0200

    Refactor styling to BEM, fix Google login display

[33mcommit 42cc12c72be0a508c11488c1c14668ea3868fdab[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sun Apr 20 12:15:38 2025 +0200

    Setup frontend and backend for email/password authentication

[33mcommit 78bbffabac3120231ebf8e82f21cd9503de8585d[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sun Apr 20 12:00:33 2025 +0200

    Protect Dashboard route and fix CORS settings

[33mcommit 2662b4292ca701399e725d862c319a6cec783e0b[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sun Apr 20 11:41:33 2025 +0200

    Add successful Google OAuth login and Dashboard page

[33mcommit 75226b7ef5e43f17e483e71cbaaeaa81df3c1fef[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sun Apr 20 09:47:45 2025 +0200

    Finalize project structure: client, server, Google OAuth setup

[33mcommit adb6cce3d3cffbe6f38edd99f51cb0829a78671f[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat Apr 19 23:43:26 2025 +0200

    Added AuthMenu and HomePage components, updated App.jsx

[33mcommit bd6534ffac04db7687871c0bdc0736a88f155990[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat Apr 19 23:24:37 2025 +0200

    Project cleanup: fixed client package.json, updated .gitignore

[33mcommit a763d3673d58a981d4e78811114196bfb09f18b2[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Sat Apr 19 23:22:03 2025 +0200

    Project cleanup: fixed client package.json, updated .gitignore

[33mcommit aae7d95c09ac1d8e294da54da7fda7484f07d0f0[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Wed Apr 9 20:50:31 2025 +0200

    fix

[33mcommit 818bf55da60b12ed94e86e5562489c1946307c28[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Mon Apr 7 20:16:03 2025 +0200

    init: full project setup with backend + frontend

[33mcommit 7f0396d38c7ddc38e8d9f66b6e3e5b76335a36f0[m
Author: Viache-Slav <slavikfedko@gmail.com>
Date:   Mon Apr 7 19:34:54 2025 +0200

    init: fresh project setup
