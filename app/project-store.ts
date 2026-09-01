const databaseName = "brian-portfolio-studio";
const storeName = "projects";
const legacyKey = "portfolio_custom_projects_v1";

type OrderedRecord = { id: string; order?: number };

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName)) {
        request.result.createObjectStore(storeName, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getStudioProjects<T extends OrderedRecord>(): Promise<T[]> {
  const database = await openDatabase();
  const records = await new Promise<T[]>((resolve, reject) => {
    const transaction = database.transaction(storeName, "readonly");
    const request = transaction.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
  database.close();

  if (records.length) return records.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  try {
    const legacy = window.localStorage.getItem(legacyKey);
    if (!legacy) return [];
    const migrated = JSON.parse(legacy) as T[];
    await saveStudioProjects(migrated);
    window.localStorage.removeItem(legacyKey);
    return migrated;
  } catch {
    return [];
  }
}

export async function saveStudioProjects<T extends OrderedRecord>(projects: T[]): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    store.clear();
    projects.forEach((project, index) => store.put({ ...project, order: index }));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
  database.close();
}

export function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function optimizeImage(file: File, maxSize = 1800): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
  canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Image conversion failed")), "image/webp", .84);
  });
  return fileToDataUrl(blob);
}

export function notifyPortfolioUpdated() {
  window.dispatchEvent(new Event("portfolio-projects-updated"));
  try {
    const channel = new BroadcastChannel("portfolio-projects");
    channel.postMessage("updated");
    channel.close();
  } catch {
    // BroadcastChannel is an optional enhancement; navigation still reloads the data.
  }
}
