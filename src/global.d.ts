declare namespace NodeJS {
  interface ProcessEnv {
    readonly GOOGLE_OAUTH2_CLIENT_ID: string;
    readonly GOOGLE_OAUTH2_CLIENT_SECRET: string;
    readonly GOOGLE_OAUTH2_CALLBACK_URL: string;
    readonly DATABASE_URL: string;
    readonly OPENAI_API_KEY: string;
    readonly YOUTUBE_DATA_API_KEY: string;
    readonly GCS_PUBLIC_BUCKET_NAME: string;
  }
}
