import React, { ReactNode } from "react";
import { Box, Link, Stack, Center, Heading, Text } from "@chakra-ui/react";
import { Link as RLink, useLocation, useNavigate } from "react-router-dom";
//import { CheckAuth, Logout } from "../hooks/Auth";
import {
	Icon28HomeOutline,
	Icon28GraphOutline,
	Icon28ListOutline,
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
		userSelect="none"
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
		let navigate = useNavigate();
		return (
			<Box
				w="100%"
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
					color={tColor}
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
			bgColor="white"
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
		<Box w="full" bgColor="white" position="fixed" zIndex={3}>
			<UPHeader isMobile={isMobile} />
			{isMobile && <MobileMenu />}
		</Box>
	);
}

export default Header;
