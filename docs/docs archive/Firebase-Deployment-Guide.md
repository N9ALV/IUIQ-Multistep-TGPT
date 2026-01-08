# Firebase Hosting Deployment Guide

This guide provides instructions for deploying the Investment Analysis Tool to Firebase Hosting, a fast, secure, and reliable way to host your web application.

## Prerequisites

1.  **Firebase Project**: You need a Firebase project. If you don't have one, create one at the [Firebase Console](https://console.firebase.google.com/).
2.  **Firebase CLI**: You need to have the Firebase CLI installed on your local machine. If you don't have it, install it using npm:
    ```bash
    npm install -g firebase-tools
    ```

## Deployment Steps

1.  **Login to Firebase**
    *   Open your terminal and log in to your Google account:
        ```bash
        firebase login
        ```

2.  **Initialize Firebase in your project**
    *   In your project's root directory (`IUIQ-Multistep-TGPT`), run the following command:
        ```bash
        firebase init
        ```
    *   Follow the prompts:
        *   **Which Firebase features do you want to set up?**: Select **Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys**.
        *   **Please select an option**: Choose **Use an existing project** and select the Firebase project you created.
        *   **What do you want to use as your public directory?**: Enter `dist`. This is the directory where your built project assets are located.
        *   **Configure as a single-page app (rewrite all urls to /index.html)?**: Enter `Yes`. This is important for React applications that use client-side routing.
        *   **Set up automatic builds and deploys with GitHub?**: Enter `No` for now. You can set this up later if you want.
    *   This will create two new files in your project root: `.firebaserc` and `firebase.json`.

3.  **Build the Project**
    *   If you haven't already, build your project to generate the `dist` directory:
        ```bash
        npm run build
        ```

4.  **Deploy to Firebase Hosting**
    *   After the build is complete, deploy your application:
        ```bash
        firebase deploy
        ```

5.  **Access Your Deployed Site**
    *   Once the deployment is finished, the Firebase CLI will give you a URL for your live site (e.g., `https://<your-project-id>.web.app`).

That's it! Your application should now be live on Firebase Hosting.

### Regarding API Keys

The `Google Cloud Deployment-Guide.md` correctly points out the security risk of exposing API keys on the client-side. For a production application, you should use the "Secure Production Deployment" architecture from that guide, but adapt it for Firebase. You can use **Cloud Functions for Firebase** as your backend proxy to keep your API keys safe. The frontend would then call these functions instead of the external APIs directly.
