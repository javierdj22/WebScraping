interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // agrega aquí otras variables que uses
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
