import { PropsWithChildren, forwardRef } from "react";
import { Pressable, PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// eslint-disable-next-line react/display-name
export const PressableArea = forwardRef(
  (props: PropsWithChildren<PressableProps>, ref: React.Ref<any>) => {
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    return (
      <AnimatedPressable
        {...props}
        ref={ref}
        style={[props.style, animatedStyle]}
        onPressIn={() => {
          // eslint-disable-next-line react-compiler/react-compiler
          opacity.value = withTiming(0.75, { duration: 150 });
        }}
        onPressOut={() => {
          opacity.value = withTiming(1, { duration: 150 });
        }}
      />
    );
  },
);
