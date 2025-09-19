import {
  Host,
  Button,
  Image,
  ButtonProps,
  ImageProps,
} from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";

export interface HeaderButtonProps {
  imageProps?: ImageProps;
  buttonProps?: ButtonProps;
}

export function HeaderButton({ imageProps, buttonProps }: HeaderButtonProps) {
  return (
    <Host matchContents>
      <Button {...buttonProps} variant={buttonProps?.variant || "glass"}>
        <Image
          {...imageProps}
          systemName={imageProps?.systemName || "xmark"}
          color={imageProps?.color || "primary"}
          size={imageProps?.size || 24}
          modifiers={[frame({ height: 33 }), ...(imageProps?.modifiers || [])]}
        />
      </Button>
    </Host>
  );
}
