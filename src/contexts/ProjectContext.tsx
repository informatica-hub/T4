import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

export interface ProjectItem {
  product_id: string;
  product_name: string;
}

const STORAGE_KEY = "t4-project-items";
const TRIGGER_KEY = "t4-project-trigger";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be blocked in embedded previews; keep in-memory state working.
  }
}

function removeFromStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage can be blocked in embedded previews; keep in-memory state working.
  }
}

interface ProjectContextType {
  items: ProjectItem[];
  triggerProduct: ProjectItem | null;
  itemCount: number;
  addItem: (item: ProjectItem) => void;
  removeItem: (productId: string) => void;
  clearProject: () => void;
  setTriggerProduct: (item: ProjectItem | null) => void;
  hasItem: (productId: string) => boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ProjectItem[]>(() => loadFromStorage(STORAGE_KEY, []));
  const [triggerProduct, setTriggerProduct] = useState<ProjectItem | null>(() => loadFromStorage(TRIGGER_KEY, null));

  useEffect(() => {
    saveToStorage(STORAGE_KEY, items);
  }, [items]);

  useEffect(() => {
    if (triggerProduct) {
      saveToStorage(TRIGGER_KEY, triggerProduct);
    } else {
      removeFromStorage(TRIGGER_KEY);
    }
  }, [triggerProduct]);

  const itemCount = items.length;

  const addItem = useCallback((item: ProjectItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.product_id === item.product_id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  }, []);

  const clearProject = useCallback(() => {
    setItems([]);
    setTriggerProduct(null);
  }, []);

  const hasItem = useCallback(
    (productId: string) => items.some((i) => i.product_id === productId),
    [items]
  );

  return (
    <ProjectContext.Provider
      value={{
        items,
        triggerProduct,
        itemCount,
        addItem,
        removeItem,
        clearProject,
        setTriggerProduct,
        hasItem,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
