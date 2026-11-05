"use client";
import {
  createContext,
  useContext,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { people, seedPosts } from "@/mocks/data";
import type { Post } from "@/types/models";

function useDemoState() {
  const feedScroll = useRef(0);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [posts, setPosts] = useState<Post[]>([]);
  const [userKey, setUserKey] = useState<string | null>(null);
  const [following, setFollowing] = useState<string[]>([]);
  const user = people.find((person) => person.localKey === userKey);
  function login(key: string) {
    feedScroll.current = 0;
    setUserKey(key);
    setPosts(seedPosts());
    setFollowing([]);
  }
  function logout() {
    feedScroll.current = 0;
    posts
      .flatMap((post) => post.images)
      .forEach((url) => URL.revokeObjectURL(url));
    setUserKey(null);
    setPosts([]);
    setFollowing([]);
  }
  function updatePost(key: string, update: (post: Post) => Post) {
    setPosts((current) =>
      current.map((post) => (post.localKey === key ? update(post) : post)),
    );
  }
  return {
    feedScroll,
    theme,
    setTheme,
    posts,
    setPosts,
    user,
    login,
    logout,
    updatePost,
    following,
    setFollowing,
  };
}
const DemoContext = createContext<ReturnType<typeof useDemoState> | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const state = useDemoState();
  return <DemoContext.Provider value={state}>{children}</DemoContext.Provider>;
}
export function useDemo() {
  const state = useContext(DemoContext);
  if (!state) throw new Error("DemoProvider is missing");
  return state;
}
