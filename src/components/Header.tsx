import React, { ReactNode } from "react";
import {
  Box,
  Link,
  Stack,
  Center,
  Heading,
  Text,
  useColorModeValue,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import { Link as RLink, useLocation, useNavigate } from "react-router-dom";
//import { CheckAuth, Logout } from "../hooks/Auth";
import {
  Icon28HomeOutline,
  Icon28GraphOutline,
  Icon28ListOutline,
  Icon28MoonOutline,
  Icon28SunOutline,
} from "@vkontakte/icons";

const Logo = ({ isMobile }: { isMobile: boolean }) => {
  let name: string = "";
  switch (useLocation().pathname) {
    case "/":
      name = "Главная";
      break;
    case "/performance":
      name = "Успеваемость";
      break;
    case "/schedule":
      name = "Расписание";
      break;
    default:
      name = "Страница не найдена";
      break;
  }

  return isMobile ? (
    <Center>
      <Heading size="md">{name}</Heading>
    </Center>
  ) : (
    <RLink to="/">
      <Heading>Дневник</Heading>
    </RLink>
  );
};

const UPHeader = ({ isMobile }: { isMobile: boolean }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const block = colorMode === "light" ? "blockLight" : "blockDark";
  if (isMobile) {
    let prevScrollpos = window.pageYOffset;
    window.onscroll = function () {
      var currentScrollPos = window.pageYOffset;
      let header: any = document.getElementById("header");
      if (prevScrollpos > currentScrollPos) {
        header.style.top = "0";
      } else {
        header.style.top = "-50px";
      }
      prevScrollpos = currentScrollPos;
    };
  }
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      w="full"
      bgColor={useColorModeValue("blockLight", "blockDark")}
      position="fixed"
      zIndex={3}
      padding={3}
      paddingLeft={[3, 10]}
      paddingRight={[3, 10]}
      userSelect="none"
      className="header"
      id="header"
    >
      <Logo isMobile={isMobile} />

      <Stack direction="row" spacing="20px">
        {!isMobile && (
          <>
            <MenuItem to="/">Главная</MenuItem>
            <MenuItem to="/performance">Успеваемость</MenuItem>
            <MenuItem to="/schedule">Расписание</MenuItem>
          </>
        )}
        <IconButton
          bgColor={block}
          w={["28px", "48px"]}
          h={["28px", "48px"]}
          aria-label="Сменить тему"
          onClick={toggleColorMode}
          icon={
            colorMode === "light" ? <Icon28MoonOutline /> : <Icon28SunOutline />
          }
        />
      </Stack>
    </Stack>
  );
};

interface ItemProps {
  children: ReactNode;
  to: string;
}

const MenuItem = (props: ItemProps) => {
  const { colorMode } = useColorMode();
  return (
    <Center>
      <Link
        _hover={{
          color: colorMode === "light" ? "gray.600" : "gray.300",
          textDecoration: "none",
        }}
        fontWeight={(useLocation().pathname === props.to && 700) || 500}
        as={RLink}
        to={props.to}
      >
        {props.children}
      </Link>
    </Center>
  );
};

function MobileMenu() {
  const { colorMode } = useColorMode();
  const MenuButton = ({
    icon,
    name,
    to,
  }: {
    icon: any;
    name: string;
    to: string;
  }) => {
    const location = useLocation();
    let navigate = useNavigate();
    return (
      <Box
        w="100%"
        userSelect="none"
        as={Link}
        onClick={() => {
          navigate(to);
        }}
        _active={{
          bgColor: "rgba(0,0,0,.04)",
          textDecoration: "none",
          borderRadius: "10px",
        }}
        _hover={{ textDecoration: "none" }}
      >
        <Stack
          position="relative"
          top="2px"
          direction="column"
          color={
            location.pathname === to
              ? colorMode === "light"
                ? "black"
                : "white"
              : colorMode === "light"
              ? "#99a2ad"
              : "#76787a"
          }
          spacing="1px"
        >
          <Center>{icon}</Center>
          <Center>
            <Text fontSize="12px">{name}</Text>
          </Center>
        </Stack>
      </Box>
    );
  };
  return (
    <Box
      w="full"
      bgColor={useColorModeValue("blockLight", "blockDark")}
      bottom="-1px"
      height="48px"
      position="fixed"
      zIndex={3}
    >
      <Stack direction="row" spacing="0px">
        <MenuButton icon={<Icon28HomeOutline />} name="Главная" to="/" />
        <MenuButton
          icon={<Icon28GraphOutline />}
          name="Успеваемость"
          to="/performance"
        />
        <MenuButton
          icon={<Icon28ListOutline />}
          name="Расписание"
          to="/schedule"
        />
      </Stack>
    </Box>
  );
}

function Header() {
  const [width, setWidth] = React.useState<number>(window.innerWidth);
  React.useEffect(() => {
    const handleWindowSizeChange = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  const isMobile = width <= 768;
  return (
    <Box>
      <UPHeader isMobile={isMobile} />
      {isMobile && <MobileMenu />}
    </Box>
  );
}

export default Header;
