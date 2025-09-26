import { Session } from "@/types";
import { BaseBookmark } from "./BaseBookmark";

export function Bookmark({
  session,
}: {
  session: Session;
  size?: "small" | "large";
}) {
  return <BaseBookmark session={session} size="large" />;
}
