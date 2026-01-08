# Google Cloud Deployment Guide: Investment Analysis Tool

This guide provides two distinct plans for deploying the Investment Analysis Tool to Google Cloud.

1.  **Part 1: Simple Static Deployment**: A quick method for testing or demonstration purposes. **This is not recommended for production** due to security vulnerabilities.
2.  **Part 2: Secure Production Deployment**: A robust, secure, and scalable setup suitable for a live application.

---

## Part 1: Simple Static Deployment (for Testing/Demo)

This approach is the quickest way to get the application online. It involves deploying the built static files directly to a public Google Cloud Storage bucket.

**Security Warning**: This method leaves your external API keys exposed in the client-side JavaScript code, which is a significant security risk. Do not use this method for production environments or with real API keys you wish to protect.

### Architecture

```mermaid
graph TD
    subgraph "User's Browser"
        A[React App]
    end
    subgraph "Google Cloud"
        B[Cloud Storage Bucket]
    end
    subgraph "External Services"
        C[Financial Modeling Prep API]
        D[OpenRouter AI API]
    end

    User -->|1. Requests site| B;
    B -->|2. Serves static files (HTML/JS/CSS)| A;
    A -->|3. Makes API call with hardcoded key| C;
    A -->|4. Makes API call with hardcoded key| D;
```

### Deployment Steps

1.  **Build the Project**
    *   Open your terminal in the project's root directory.
    *   Run the build command:
        ```bash
        npm run build
        ```
    *   This will generate a `dist` directory containing the production-ready static files (`index.html`, CSS, and JavaScript bundles).

2.  **Create a Google Cloud Storage (GCS) Bucket**
    *   Navigate to the **Cloud Storage browser** in the Google Cloud Console.
    *   Click **Create bucket**.
    *   Choose a globally unique name. It's a common practice to use the domain name you intend to use (e.g., `www.your-investment-app.com`).
    *   Select a location (region) for your bucket and click **Create**. Use the default settings for the remaining steps.

3.  **Upload Files to GCS**
    *   In the Cloud Console, navigate to your newly created bucket.
    *   Click the **Upload folder** button.
    *   Select the `dist` directory from your local project to upload its entire contents.

4.  **Configure Public Access**
    *   Once the upload is complete, you need to make the files publicly accessible.
    *   Go to the **Permissions** tab for your bucket.
    *   Click **Grant Access**.
    *   In the "New principals" field, enter `allUsers`.
    *   In the "Select a role" dropdown, choose **Storage Object Viewer**.
    *   Click **Save**.

5.  **Configure the Bucket for Website Hosting**
    *   In the bucket details, go to the **Configurations** tab.
    *   Click on **Edit website configuration**.
    *   For the **Index (main) page suffix**, enter `index.html`.
    *   For the **Error (not found) page**, you can also enter `index.html`, which is a common practice for single-page applications (SPAs) to handle client-side routing.
    *   Click **Save**.

6.  **Test Your Deployment**
    *   Your site is now live. You can access it via its public URL, which follows the format `http://storage.googleapis.com/BUCKET_NAME/index.html`.

---

## Part 2: Secure Production Deployment (Recommended)

This plan addresses the security vulnerability of exposed API keys by introducing a serverless backend proxy. It also adds a CDN for better performance and SSL for security, making it the recommended approach for a live application.

### Architecture

```mermaid
graph TD
    subgraph "User's Browser"
        App[React App]
    end
    subgraph "Google Cloud"
        CDN[Cloud CDN & Load Balancer]
        GCS[Cloud Storage Bucket]
        Proxy[Cloud Function Proxy]
        Secrets[Secret Manager]
    end
    subgraph "External Services"
        FMP[Financial Modeling Prep API]
        OpenRouter[OpenRouter AI API]
    end

    User -->|1. HTTPS Request| CDN;
    CDN -->|2. Serves static files| GCS;
    GCS -->|HTML/JS/CSS| CDN;
    CDN -->|Response| App;

    App -->|3. API Request (no keys)| CDN;
    CDN -->|4. Forwards to backend| Proxy;
    Proxy -->|5. Fetches API keys| Secrets;
    Secrets -->|API Keys| Proxy;
    Proxy -->|6. Proxies request with key| FMP;
    Proxy -->|7. Proxies request with key| OpenRouter;
    FMP & OpenRouter -->|Response| Proxy;
    Proxy -->|Response| App;
```

### Deployment Steps

1.  **Secure API Keys in Secret Manager**
    *   Navigate to **Secret Manager** in the Google Cloud Console.
    *   Create two new secrets: one for your Financial Modeling Prep API key and one for your OpenRouter API key.
    *   For each secret, give it a name (e.g., `FMP_API_KEY`, `OPENROUTER_API_KEY`) and add the key value.

2.  **Create a Backend Proxy with Cloud Functions**
    *   Navigate to **Cloud Functions** in the Google Cloud Console.
    *   Create a new function.
    *   Configure the function:
        *   **Environment**: 1st gen or 2nd gen.
        *   **Trigger**: HTTP.
        *   **Authentication**: Allow unauthenticated invocations (the load balancer will be the gatekeeper).
    *   Write the code for the function (e.g., in Node.js) to:
        1.  Receive a request from your frontend.
        2.  Access the keys from Secret Manager.
        3.  Make the appropriate call to the external API (FMP or OpenRouter).
        4.  Return the API's response to the frontend.
    *   In the function's settings, grant its service account the **Secret Manager Secret Accessor** IAM role to allow it to read the secrets.

3.  **Refactor the Frontend Application**
    *   Modify the service files: [`src/services/financialData.ts`](IUIQ-Multistep-TGPT/src/services/financialData.ts:1) and [`src/services/openrouter.ts`](IUIQ-Multistep-TGPT/src/services/openrouter.ts:1).
    *   Change the API endpoints to point to your new Cloud Function's trigger URL. You will likely want to pass information in the request to tell your function which external API to call.
    *   **Completely remove the hardcoded API keys from the frontend code.**
    *   Re-build the project with `npm run build`.

4.  **Deploy Frontend to a Private GCS Bucket**
    *   Create a new GCS bucket as in Part 1, but **do not** make it public. The default private setting is correct.
    *   Upload the contents of your newly built `dist` directory to this private bucket.

5.  **Set up Cloud CDN and HTTP(S) Load Balancer**
    *   Navigate to **Load balancing** in the Google Cloud Console.
    *   Create an **External HTTP(S) Load Balancer**.
    *   **Backend Configuration**:
        *   Create a **backend bucket** and point it to your private GCS bucket.
        *   Enable **Cloud CDN** on this backend service.
        *   Create a second backend service of type **Serverless Network Endpoint Group (NEG)** and point it to your Cloud Function.
    *   **Host and Path Rules**:
        *   Create a path rule to direct traffic. For example, route all requests to `/api/*` to your Cloud Function backend.
        *   The default rule should direct all other traffic to the GCS backend bucket.
    *   **Frontend Configuration**:
        *   Create a forwarding rule.
        *   Reserve a new **static IP address**.
        *   Create a **Google-managed SSL certificate** for your custom domain.
        *   Point your domain's DNS "A" record to the static IP address you reserved.

After completing these steps, your application will be served securely and efficiently via Google's global network.