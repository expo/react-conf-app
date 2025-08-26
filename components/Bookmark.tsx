import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Pressable } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";

import { useBookmarkStore } from "@/store/bookmarkStore";
import { theme } from "@/theme";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { isPast, subMinutes } from "date-fns";
import { Session } from "@/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Bookmark({ session }: { session: Session }) {
  const toggleBookmarked = useBookmarkStore((state) => state.toggleBookmarked);
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const currentBookmark = bookmarks.find((b) => b.sessionId === session.id);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const setNotification = async () => {
    const fiveMinutesTillSession = subMinutes(new Date(session.startsAt), 5);

    if (isPast(fiveMinutesTillSession)) {
      return undefined;
    }

    const status = await registerForPushNotificationsAsync();

    if (status === "granted") {
      return Notifications.scheduleNotificationAsync({
        content: {
          title: `"${session.title}" starts in 5 minutes`,
          data: {
            url: `/talk/${session.id}`,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: fiveMinutesTillSession,
        },
      });
    }
  };

  const handlePress = async () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }

    if (currentBookmark) {
      if (currentBookmark?.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(
          currentBookmark?.notificationId,
        );
      }
      toggleBookmarked(session.id);
    } else {
      const notificationId = await setNotification();
      toggleBookmarked(session.id, notificationId);
    }
  };

  return (
    <AnimatedPressable
      hitSlop={20}
      onPress={() => {
        if (Platform.OS !== "web" && !currentBookmark) {
          Haptics.selectionAsync();
        }
        handlePress();
      }}
      onPressIn={() => {
        scale.value = withTiming(0.8);
      }}
      onPressOut={() => {
        scale.value = withTiming(1);
      }}
      style={animatedStyle}
    >
      <MaterialCommunityIcons
        name={currentBookmark ? "bookmark-check" : "bookmark"}
        size={24}
        color={currentBookmark ? theme.colorWhite : `rgba(255, 255, 255, 0.5)`}
      />
    </AnimatedPressable>
  );
}
