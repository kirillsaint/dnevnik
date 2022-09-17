import { extendTheme, ComponentStyleConfig } from "@chakra-ui/react";
import "./css/theme.css";
import { mode } from "@chakra-ui/theme-tools";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";

const fonts = {
  heading: `'Manrope', sans-serif`,
  body: `'Manrope', sans-serif`,
};

const global = (props: StyleFunctionProps) => ({
  body: {
    bg: mode("#F8F8F8", "#19191a")(props),
    color: mode("#333333", "#ffffff")(props),
  },
  button: {
    _focus: {
      boxShadow: "none",
    },
  },
  a: {
    _focus: {
      boxShadow: "none",
    },
  },
});

const colors = {
  black: "#333333",
  blockLight: "#ffffff",
  blockDark: "#232324",
  borderLight: "rgba(187, 187, 187, 1)",
  borderDark: "#333333",
};

const config = {
  cssVarPrefix: "kirillsaint",
  initialColorMode: "light",
  useSystemColorMode: true,
};

const Skeleton: ComponentStyleConfig = {
  defaultProps: {
    startColor: "#bbbbbb",
    endColor: "#ababab",
  },
};

const SkeletonText: ComponentStyleConfig = {
  defaultProps: {
    startColor: "#bbbbbb",
    endColor: "#ababab",
  },
};

export default extendTheme({
  fonts,
  config,
  colors,
  styles: {
    global: global,
  },
  components: {
    Skeleton,
    SkeletonText,
  },
});
