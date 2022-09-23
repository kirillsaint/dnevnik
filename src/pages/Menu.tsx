import React from "react";
import {
	Box,
	Center,
	Container,
	Stack,
	Avatar,
	Text,
	useColorMode,
	Switch,
	Link,
} from "@chakra-ui/react";
import { getUser, logout } from "../hooks/Auth";
import { getSettings, SettingsType, updateSettings } from "../hooks/Settings";
import {
	Icon28MoonOutline,
	Icon28SortOutline,
	Icon28NameTagOutline,
	Icon28SchoolOutline,
} from "@vkontakte/icons";

function Menu() {
	const user = getUser();
	const [settings, setSettings] = React.useState<SettingsType | null>(null);

	const { colorMode, toggleColorMode } = useColorMode();
	const block = colorMode === "light" ? "blockLight" : "blockDark";
	const border = colorMode === "light" ? "borderLight" : "borderDark";

	React.useEffect(() => {
		setSettings(getSettings());
	}, []);

	return (
		<Center>
			<Container
				bg={block}
				borderRadius="15px"
				borderWidth="1px"
				padding={0}
				borderColor={border}
			>
				<Box
					padding="48px"
					paddingRight="32px"
					paddingLeft="32px"
					w="100%"
					textAlign="center"
					borderBottomWidth="1px"
					borderBottomColor={border}
				>
					<Stack direction="column" spacing="5px">
						<Center>
							<Avatar
								name={
									settings?.showName
										? `${user?.lastName} ${user?.firstName}`
										: undefined
								}
								src={
									settings?.showName
										? user?.avatarUrl
											? user.avatarUrl
											: ""
										: ""
								}
								borderRadius="30px"
								size="lg"
							></Avatar>
						</Center>
						<Center>
							<Text fontWeight="bold" fontSize={16}>
								{(settings?.showName && (
									<span>
										{user?.lastName} {user?.firstName} {user?.middleName}
									</span>
								)) || <span>Имя скрыто</span>}
							</Text>
						</Center>
						<Center>
							<Text fontWeight="bold" fontSize={13} color="#aaa">
								{(settings?.showSchool && <span>{user?.schoolName}</span>) || (
									<span>Имя школы скрыто</span>
								)}
							</Text>
						</Center>
					</Stack>
				</Box>
				<Stack
					borderBottomWidth="1px"
					borderBottomColor={border}
					direction="column"
					spacing="10px"
					padding={5}
				>
					<Center>
						<Stack w="100%" direction="row" justifyContent="space-between">
							<Center>
								<Stack direction="row" spacing="10px">
									<Center>
										<Icon28MoonOutline />
									</Center>
									<Center>
										<Text fontSize={16}>Темная тема</Text>
									</Center>
								</Stack>
							</Center>
							<Center>
								<Switch
									id="darkTheme"
									isChecked={colorMode === "dark" ? true : false}
									onChange={toggleColorMode}
								/>
							</Center>
						</Stack>
					</Center>
					<Center>
						<Stack w="100%" direction="row" justifyContent="space-between">
							<Center>
								<Stack direction="row" spacing="10px">
									<Center>
										<Icon28SortOutline />
									</Center>
									<Center>
										<Text fontSize={16}>Заменять плохие оценки на 4</Text>
									</Center>
								</Stack>
							</Center>
							<Center>
								<Switch
									id="replaceBadMarks"
									isChecked={settings?.replaceBadMarks ? true : false}
									onChange={(e: any) => {
										updateSettings("replaceBadMarks", e.target.checked);
									}}
								/>
							</Center>
						</Stack>
					</Center>
					<Center>
						<Stack w="100%" direction="row" justifyContent="space-between">
							<Center>
								<Stack direction="row" spacing="10px">
									<Center>
										<Icon28NameTagOutline />
									</Center>
									<Center>
										<Text fontSize={16}>Отображать ФИО</Text>
									</Center>
								</Stack>
							</Center>
							<Center>
								<Switch
									id="showName"
									isChecked={settings?.showName ? true : false}
									onChange={(e: any) => {
										updateSettings("showName", e.target.checked);
									}}
								/>
							</Center>
						</Stack>
					</Center>
					<Center>
						<Stack w="100%" direction="row" justifyContent="space-between">
							<Center>
								<Stack direction="row" spacing="10px">
									<Center>
										<Icon28SchoolOutline />
									</Center>
									<Center>
										<Text fontSize={16}>Отображать имя школы</Text>
									</Center>
								</Stack>
							</Center>
							<Center>
								<Switch
									id="showSchool"
									isChecked={settings?.showSchool ? true : false}
									onChange={(e: any) => {
										updateSettings("showSchool", e.target.checked);
									}}
								/>
							</Center>
						</Stack>
					</Center>
				</Stack>
				<Center padding={5}>
					<Link
						onClick={() => {
							logout();
							window.location.href = "/";
						}}
					>
						Выйти из аккаунта
					</Link>
				</Center>
			</Container>
		</Center>
	);
}

export default Menu;
