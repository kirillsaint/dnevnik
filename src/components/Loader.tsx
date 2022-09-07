import React from "react";
import { Spinner, Center } from "@chakra-ui/react";

function Loader() {
	return (
		<Center minH="100vh">
			<Spinner color="black" size="xl" />
		</Center>
	);
}

export default Loader;
