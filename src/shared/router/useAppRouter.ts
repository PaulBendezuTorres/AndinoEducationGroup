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

function resolvePageFromPath(pathname: string): Page {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/") return "home";
  return pathToPage[clean] ?? "home";
}

export function useAppRouter(isAuthenticated: boolean) {
  const [page, setPage] = useState<Page>(() =>
    isAuthenticated ? resolvePageFromPath(window.location.pathname) : "login",
  );

  useEffect(() => {
    const onPopState = () => {
      setPage(isAuthenticated ? resolvePageFromPath(window.location.pathname) : "login");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isAuthenticated]);

  useEffect(() => {
    const targetPage = isAuthenticated ? (page === "login" ? "home" : page) : "login";
    const targetPath = pageToPath[targetPage];
    if (window.location.pathname !== targetPath) {
      window.history.replaceState(null, "", targetPath);
    }
    if (targetPage !== page) {
      setPage(targetPage);
    }
  }, [isAuthenticated, page]);

  const go = useCallback((next: Page) => {
    const targetPath = pageToPath[next];
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
    setPage(next);
  }, []);

  return { page, go };
}
