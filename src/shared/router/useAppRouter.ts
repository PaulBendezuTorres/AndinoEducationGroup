import { useCallback, useEffect, useState } from "react";
import type { Page } from "../types/domain";

const pageToPath: Record<Page, string> = {
  login: "/login",
  home: "/inicio",
  students: "/estudiantes",
  validation: "/estudiantes/validar",
  student: "/estudiantes/ficha",
  documents: "/documentos",
  review: "/documentos/revision",
  alerts: "/alertas",
  integrations: "/integraciones",
  users: "/usuarios",
};

const pathToPage: Record<string, Page> = Object.fromEntries(
  Object.entries(pageToPath).map(([page, path]) => [path, page as Page]),
) as Record<string, Page>;

function getCurrentRoutePath() {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash) return hash.replace(/\/+$/, "") || "/";
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function resolvePageFromLocation(): Page {
  const clean = getCurrentRoutePath();
  if (clean === "/") return "home";
  return pathToPage[clean] ?? "home";
}

export function useAppRouter(isAuthenticated: boolean) {
  const [page, setPage] = useState<Page>(() =>
    isAuthenticated ? resolvePageFromLocation() : "login",
  );

  useEffect(() => {
    const onHashChange = () => {
      setPage(isAuthenticated ? resolvePageFromLocation() : "login");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [isAuthenticated]);

  useEffect(() => {
    const targetPage = isAuthenticated ? (page === "login" ? "home" : page) : "login";
    const targetHash = `#${pageToPath[targetPage]}`;
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, "", targetHash);
    }
    if (targetPage !== page) {
      setPage(targetPage);
    }
  }, [isAuthenticated, page]);

  const go = useCallback((next: Page) => {
    const targetHash = `#${pageToPath[next]}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    setPage(next);
  }, []);

  return { page, go };
}
