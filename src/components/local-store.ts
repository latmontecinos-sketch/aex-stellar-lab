// Lo que una demo recuerda entre visitas, en localStorage. Es solo una caché:
// el estado real se lee de la red. Las llaves que guarda son de cuentas de
// prueba (testnet) creadas para la demo; nunca se muestran ni se envían.
//
// Se expone como un store externo (`useSyncExternalStore`): cada escritura
// relee lo último guardado y le aplica el cambio, así dos pestañas abiertas no
// se pisan la sesión entera.

export type LocalStore<T> = {
  get: () => T;
  getServer: () => T;
  subscribe: (callback: () => void) => () => void;
  /** Aplica un cambio sobre lo último guardado. `null` borra la sesión. */
  update: (patch: T | null) => void;
};

type Legacy<T> = { key: string; migrate: (value: Record<string, unknown>) => T };

function parse(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
  } catch {
    return null; // Una sesión corrupta se descarta y la demo empieza de cero.
  }
}

export function createLocalStore<T extends object>(key: string, empty: T, legacy?: Legacy<T>): LocalStore<T> {
  const listeners = new Set<() => void>();
  // Si el navegador bloquea localStorage (modo privado estricto), la sesión vive
  // solo en memoria: la demo funciona igual, pero no se recuerda al recargar.
  let memory: string | null = null;
  let cache: { raw: string | null; value: T } = { raw: null, value: empty };

  function getItem(k: string): string | null {
    try {
      return localStorage.getItem(k);
    } catch {
      return k === key ? memory : null;
    }
  }

  function get(): T {
    const raw = getItem(key) ?? (legacy ? getItem(legacy.key) : null);
    if (raw === cache.raw) return cache.value;
    const current = parse(getItem(key));
    const old = !current && legacy ? parse(getItem(legacy.key)) : null;
    cache = { raw, value: current ? (current as T) : old && legacy ? legacy.migrate(old) : empty };
    return cache.value;
  }

  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) callback();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", onStorage);
    };
  }

  function update(patch: T | null) {
    const next = patch === null ? empty : { ...get(), ...patch };
    const raw = JSON.stringify(next);
    try {
      localStorage.setItem(key, raw);
      if (legacy) localStorage.removeItem(legacy.key);
    } catch {
      memory = raw;
    }
    listeners.forEach((listener) => listener());
  }

  return { get, getServer: () => empty, subscribe, update };
}
