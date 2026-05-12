const assetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, "");

export function publicAsset(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return assetBaseUrl ? `${assetBaseUrl}${normalizedPath}` : normalizedPath;
}
