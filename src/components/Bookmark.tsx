import { Session } from "@/types";
import { BaseBookmark } from "./BaseBookmark";
import { StyleProp, ViewStyle } from "react-native";

export function Bookmark({
  session,
}: {
  session: Session;
  size?: "small" | "large";
  style?: StyleProp<ViewStyle>;
}) {
  return <BaseBookmark session={session} size="large" />;
}
