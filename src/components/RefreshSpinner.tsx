import React from "react";
import { Spinner, Box, useColorMode, Center } from "@chakra-ui/react";
import "../css/RefreshSpinner.css";

export type SpinnerProps = {
	loading: boolean;
};

function RefreshSpinner(props: SpinnerProps) {
	const { colorMode } = useColorMode();
	const block = colorMode === "light" ? "blockLight" : "blockDark";
	return (
		<Center>
			<Box className="DNUI__RefreshSpinner" bgColor={block}>
				<Spinner speed={props.loading ? "0.45s" : "0.0s"} />
			</Box>
		</Center>
	);
}

export default RefreshSpinner;
