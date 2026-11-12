interface ImportMetaEnv {
  /** 'true' makes all pages indexable (launch on the real domain). Default: noindex preview. */
  readonly PUBLIC_INDEXABLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
