import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type BookmarkState = {
  bookmarks: { sessionId: string; notificationId?: string }[];
  toggleBookmarked: (sessionId: string, notificationId?: string) => void;
};

export const useBookmarkStore = create(
  persist<BookmarkState>(
    (set) => ({
      bookmarks: [],
      toggleBookmarked: (sessionId: string, notificationId?: string) => {
        set((state) => {
          if (state.bookmarks.find((b) => b.sessionId === sessionId)) {
            const newBookmarks = state.bookmarks.filter(
              (b) => b.sessionId !== sessionId,
            );
            return {
              bookmarks: newBookmarks,
            };
          } else {
            return {
              bookmarks: [...state.bookmarks, { sessionId, notificationId }],
            };
          }
        });
      },
    }),
    {
      name: "react-conf-2025-bookmarks",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
