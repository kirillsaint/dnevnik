import React from "react";
import { Spinner, Center, useColorModeValue } from "@chakra-ui/react";

function Loader() {
  return (
    <Center minH="100vh">
      <Spinner color={useColorModeValue("black", "white")} size="xl" />
    </Center>
  );
}

export default Loader;
