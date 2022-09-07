import React from "react";
import {
	Stack,
	Box,
	Text,
	Heading,
	Link,
	Tabs,
	TabList,
	TabPanels,
	TabPanel,
	Avatar,
	Divider,
	Center,
	useTab,
	Button,
	useToast,
} from "@chakra-ui/react";
import { getUser, UserData } from "../hooks/Auth";
import Loader from "../components/Loader";
import "../css/main.css";
import { getImportant, getTodayAndTomorrowLessons } from "../hooks/Api";
import moment from "moment";
import parse from "html-react-parser";
import "moment/locale/ru";
import Linkify from "react-linkify";

function Main() {
	const toast = useToast();
	moment.locale("ru");
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

	const [user, setUser] = React.useState<UserData | null>(null);
	const [todayLessons, setTodayLessons] = React.useState<any>([]);
	const [tomorrowLessons, setTomorrowLessons] = React.useState<any>([]);
	const [news, setNews] = React.useState<any>([]);

	React.useEffect(() => {
		const getInfo = async () => {
			try {
				const important = await getImportant();
				setNews(important.feed);
			} catch (e) {
				toast({
					title: "Произошла ошибка при получении новостей",
					description: `${e}`,
					status: "error",
					duration: 3000,
					isClosable: true,
					position: isMobile ? "top" : "bottom",
				});
			}
			try {
				const lessons = await getTodayAndTomorrowLessons();
				if (lessons.today.length !== 0) {
					setTodayLessons(lessons.today[0].lessons);
				}

				if (lessons.tomorrow.length !== 0) {
					setTomorrowLessons(lessons.tomorrow[0].lessons);
				}
			} catch (e) {
				toast({
					title: "Произошла ошибка при получении расписания",
					description: `${e}`,
					status: "error",
					duration: 3000,
					isClosable: true,
					position: isMobile ? "top" : "bottom",
				});
			}

			setUser(getUser());
		};

		getInfo();
		// eslint-disable-next-line
	}, []);

	const CustomTab = React.forwardRef((props: any, ref: any) => {
		const tabProps = useTab({ ...props, ref });
		const isSelected = !!tabProps["aria-selected"];

		return (
			<Button
				variant="outline"
				borderColor={isSelected ? "black" : "#BBBBBB"}
				borderRadius="15px"
				color={isSelected ? "black" : "#BBBBBB"}
				_hover={{
					bgColor: isSelected ? "black" : "#BBBBBB",
					color: "white",
				}}
				w="100%"
				h="40px"
				{...tabProps}
			>
				{tabProps.children}
			</Button>
		);
	});

	const Grade = (props: { grade: number; lesson: string }) => {
		let bgColor: string = "";

		switch (props.grade) {
			case 5:
				bgColor = "rgba(0, 255, 25, 0.5)";
				break;
			case 4:
				bgColor = "rgba(0, 255, 25, 0.5)";
				break;
			case 3:
				bgColor = "rgba(255, 122, 0, 0.5)";
				break;
			case 2:
				bgColor = "rgba(255, 0, 0, 0.5)";
				break;
			case 1:
				bgColor = "rgba(255, 0, 0, 0.5)";
				break;
		}

		return (
			<Box
				minW={["100px", "120px"]}
				minH={["100px", "120px"]}
				userSelect="none"
				bgColor={bgColor}
				borderRadius="15px"
			>
				<Center h="full">
					<Stack direction="column" h="full">
						<Box />
						<Box flex="1" />
						<Center>
							<Heading color="white" size="3xl">
								{props.grade}
							</Heading>
						</Center>
						<Box flex="1" />
						<Text fontSize={[10, 12]} color="white">
							{props.lesson}
						</Text>
						<Box />
					</Stack>
				</Center>
			</Box>
		);
	};

	const Lesson = ({ lesson }: any) => (
		<Stack direction="column" spacing="1px">
			<Stack direction="column" spacing="1px" m="20px" mt="10px" mb="10px">
				<Stack direction="row" justifyContent="space-between">
					<Text fontSize={18}>
						{lesson.number}. {lesson.subject.name}
					</Text>
					{lesson.hours.startHour && (
						<Text fontWeight="bold" color="#AAAAAA">
							{lesson.hours.startHour}:{lesson.hours.startMinute} –{" "}
							{lesson.hours.endHour}:{lesson.hours.endMinute}
						</Text>
					)}
				</Stack>
				{lesson.homework?.text && (
					<Text fontSize={14} color="#AAAAAA">
						<Linkify>{lesson.homework.text}</Linkify>
					</Text>
				)}
			</Stack>
			<Divider opacity="1" borderColor="rgba(187, 187, 187, 1)" />
		</Stack>
	);

	const NewsBlock = ({ item }: any) => (
		<Box
			bgColor="white"
			border="1px solid #BBBBBB"
			borderRadius="15px"
			w="100%"
		>
			<Stack direction="column" spacing="20px" m="20px">
				<Stack direction="column" spacing="10px">
					<Stack direction="row" spacing="10px">
						<Avatar
							name={item.content.title}
							src={item.content.topicLogoUrl}
							borderRadius="15px"
						></Avatar>
						<Stack direction="column" spacing="1px">
							<Text fontSize={16}>{item.content.title}</Text>
							<Text fontSize={15} color="#AAAAAA">
								{`${moment.unix(item.timeStamp).format("LLL")}`}
							</Text>
						</Stack>
					</Stack>
					<Text>
						<Linkify>{parse(item.content.text)}</Linkify>
					</Text>
				</Stack>
				{item.content.files && (
					<Stack direction="column" spacing="5px">
						{item.content.files.map((file: any) => (
							<Link
								color="#0072B2"
								_hover={{ textDecoration: "none", color: "black" }}
								href={file.fileLink}
								download={file.fileLink}
							>
								{file.fileName}
							</Link>
						))}
					</Stack>
				)}
			</Stack>
		</Box>
	);

	return (
		<>
			{(user === null && <Loader />) || (
				<Stack direction={["column", "row"]} spacing={["20px", "50px"]}>
					<Box
						overflow="hidden"
						w={["100%", "35%"]}
						borderRadius="20px"
						bgColor="white"
						border="1px solid rgba(187, 187, 187, 1)"
						height="fit-content"
					>
						<Stack direction="column" spacing="1px">
							<Box m="10px" paddingLeft={4}>
								<Stack direction="row" spacing="10px">
									<Avatar
										name={`${user?.lastName} ${user?.firstName} ${user?.middleName}`}
										src={user?.avatarUrl ? user.avatarUrl : undefined}
										borderRadius="15px"
									></Avatar>
									<Stack direction="column" spacing="1px">
										<Text fontSize={16}>
											{user?.lastName} {user?.firstName} {user?.middleName}
										</Text>
										<Text fontSize={15} color="#AAAAAA">
											{user?.schoolName}
										</Text>
									</Stack>
								</Stack>
							</Box>
							<Divider opacity="1" borderColor="rgba(187, 187, 187, 1)" />
							<Box mt="10px!important">
								<Stack
									className="grades"
									direction="row"
									overflow="auto"
									overflowX="auto"
									spacing="10px"
								>
									<Box />
									<Box />
									{todayLessons.map((item: any) => (
										<Grade lesson={item.subject.name} grade={5} />
									))}
									<Box />
								</Stack>
							</Box>
							<Divider opacity="1" borderColor="rgba(187, 187, 187, 1)" />
							<Tabs>
								<TabList
									borderBottomColor="rgba(187, 187, 187, 1)"
									borderBottom="1px"
								>
									<Stack
										direction="row"
										spacing="20px"
										w="100%"
										pl={5}
										pr={5}
										pt={2}
										pb={2}
									>
										<CustomTab>Сегодня</CustomTab>
										<CustomTab>Завтра</CustomTab>
									</Stack>
								</TabList>
								<TabPanels>
									<TabPanel padding={0} paddingBottom={5}>
										{todayLessons.length === 0 && (
											<Center paddingTop={5}>
												<Text color="gray.500" fontWeight="bold">
													Уроков не найдено
												</Text>
											</Center>
										)}
										{todayLessons.map((item: any) => (
											<Lesson lesson={item} />
										))}
									</TabPanel>
									<TabPanel padding={0} paddingBottom={5}>
										{tomorrowLessons.length === 0 && (
											<Center paddingTop={5}>
												<Text color="gray.500" fontWeight="bold">
													Уроков не найдено
												</Text>
											</Center>
										)}
										{tomorrowLessons.map((item: any) => (
											<Lesson lesson={item} />
										))}
									</TabPanel>
								</TabPanels>
							</Tabs>
						</Stack>
					</Box>
					{(news.length !== 0 && (
						<Stack w={["100%", "65%"]} direction="column" spacing="20px">
							{news.map((item: any) => (
								<NewsBlock item={item} />
							))}
						</Stack>
					)) || (
						<Center w={["100%", "65%"]}>
							<Text color="gray.500" fontWeight="bold">
								Новостей не найдено
							</Text>
						</Center>
					)}
				</Stack>
			)}
		</>
	);
}

export default Main;
