import React, { ReactNode } from "react";
import { Box, Link, Stack, Center, Heading } from "@chakra-ui/react";
import { Link as RLink, useLocation } from "react-router-dom";
//import { CheckAuth, Logout } from "../hooks/Auth";

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
		<Heading size="md">{name}</Heading>
	) : (
		<RLink to="/">
			<Heading>Дневник</Heading>
		</RLink>
	);
};

const DesktopHeader = ({ isMobile }: { isMobile: boolean }) => (
	<Stack
		direction="row"
		justifyContent="space-between"
		w="full"
		padding={3}
		paddingLeft={[3, 10]}
		paddingRight={[3, 10]}
	>
		<Logo isMobile={isMobile} />
		{!isMobile && (
			<Stack direction="row" spacing="20px">
				<MenuItem to="/">Главная</MenuItem>
				<MenuItem to="/performance">Успеваемость</MenuItem>
				<MenuItem to="/schedule">Расписание</MenuItem>
			</Stack>
		)}
	</Stack>
);

interface ItemProps {
	children: ReactNode;
	to: string;
}

const MenuItem = (props: ItemProps) => {
	return (
		<Center>
			<Link
				color="black"
				_hover={{
					color: "gray.600",
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
		<Box w="full" bgColor="white" position="fixed" zIndex={3}>
			<DesktopHeader isMobile={isMobile} />
		</Box>
	);
}

export default Header;
