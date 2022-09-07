import React, { ReactNode } from "react";
import { Box, Link, Stack, Center, Heading } from "@chakra-ui/react";
import { Link as RLink, useLocation } from "react-router-dom";
//import { CheckAuth, Logout } from "../hooks/Auth";

const Logo = () => (
	<RLink to="/">
		<Heading>Дневник</Heading>
	</RLink>
);

const DesktopHeader = () => (
	<Stack
		direction="row"
		justifyContent="space-between"
		w="full"
		padding={3}
		paddingLeft={[3, 10]}
		paddingRight={[3, 10]}
	>
		<Logo />
		<Stack direction="row" spacing="20px">
			<MenuItem to="/">Главная</MenuItem>
			<MenuItem to="/performance">Успеваемость</MenuItem>
			<MenuItem to="/schedule">Расписание</MenuItem>
		</Stack>
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
	return (
		<Box w="full" bgColor="white" position="fixed" zIndex={3}>
			<DesktopHeader />
		</Box>
	);
}

export default Header;
