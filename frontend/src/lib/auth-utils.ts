import Cookies from "js-cookie";

const COOKIE_OPTIONS = {
  path: "/",
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  expires: 30,
};

export function saveUserSession(userId: string, name?: string) {
  if (typeof window !== "undefined") {
    Cookies.set("userId", userId, COOKIE_OPTIONS);
    if (name) {
      Cookies.set("userName", name, COOKIE_OPTIONS);
    }
  }
}

export function getUserName(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return Cookies.get("userName");
}

export function clearSession() {
  if (typeof window !== "undefined") {
    Cookies.remove("userId", { path: "/" });
    Cookies.remove("userName", { path: "/" });
  }
}

export function getCurrentUserId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return Cookies.get("userId");
}
