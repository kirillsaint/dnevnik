import React, { ReactNode } from "react";
import { Box, Link, Stack, Center, Heading, Text } from "@chakra-ui/react";
import { Link as RLink, useLocation } from "react-router-dom";
//import { CheckAuth, Logout } from "../hooks/Auth";
import { FaHome } from "react-icons/fa";
import { IoAnalytics } from "react-icons/io5";
import { AiOutlineCalendar } from "react-icons/ai";

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

const UPHeader = ({ isMobile }: { isMobile: boolean }) => (
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

function MobileMenu() {
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
		let tColor: string = "#99a2ad";
		if (location.pathname === to) {
			tColor = "black";
		}
		return (
			<Box w="100%" as={RLink} to={to}>
				<Stack m="10px" direction="column" color={tColor} spacing="1px">
					<Center>{icon}</Center>
					<Center>
						<Text>{name}</Text>
					</Center>
				</Stack>
			</Box>
		);
	};
	return (
		<Box w="full" bgColor="white" bottom="0" position="fixed" zIndex={3}>
			<Stack direction="row" spacing="0px">
				<MenuButton icon={<FaHome size={24} />} name="Главная" to="/" />
				<MenuButton
					icon={<IoAnalytics size={24} />}
					name="Успеваемость"
					to="/performance"
				/>
				<MenuButton
					icon={<AiOutlineCalendar size={24} />}
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
		<Box w="full" bgColor="white" position="fixed" zIndex={3}>
			<UPHeader isMobile={isMobile} />
			{isMobile && <MobileMenu />}
		</Box>
	);
}

export default Header;
