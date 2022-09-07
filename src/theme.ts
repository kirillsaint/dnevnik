import { extendTheme } from "@chakra-ui/react";
import "./css/theme.css";

const fonts = {
	heading: `'Manrope', sans-serif`,
	body: `'Manrope', sans-serif`,
};

const global = {
	body: {
		bg: "#F8F8F8",
		color: "#333333",
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
};

const colors = {
	black: "#333333",
};

const config = {
	cssVarPrefix: "kirillsaint",
};

export default extendTheme({
	fonts,
	config,
	colors,
	styles: {
		global: global,
	},
});
