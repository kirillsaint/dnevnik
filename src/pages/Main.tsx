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
	Skeleton,
	SkeletonText,
	useColorMode,
} from "@chakra-ui/react";
import { getUser, UserData } from "../hooks/Auth";
import Loader from "../components/Loader";
import "../css/main.css";
import {
	getImportant,
	getTodayAndTomorrowLessons,
	getLessonInfo,
	getMainContent,
} from "../hooks/Api";
import moment from "moment";
import parse from "html-react-parser";
import "moment/locale/ru";
import Linkify from "react-linkify";
import { Icon20DocumentOutline, Icon16UserOutline } from "@vkontakte/icons";
import Lesson from "../components/Lesson";

function Main() {
	const { colorMode } = useColorMode();
	const block = colorMode === "light" ? "blockLight" : "blockDark";
	const border = colorMode === "light" ? "borderLight" : "borderDark";
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

	let slider: any = document.getElementById("grades");
	let isDown: boolean = false;
	let startX: number;
	let scrollLeft: number;

	const setSlider = () => {
		slider = document.getElementById("grades");
		slider.addEventListener("mousedown", (e: any) => {
			isDown = true;
			slider.classList.add("active");
			startX = e.pageX - slider.offsetLeft;
			scrollLeft = slider.scrollLeft;
		});
		slider.addEventListener("mouseleave", () => {
			isDown = false;
			slider.classList.remove("active");
		});
		slider.addEventListener("mouseup", () => {
			isDown = false;
			slider.classList.remove("active");
		});
		slider.addEventListener("mousemove", (e: any) => {
			if (!isDown) return;
			e.preventDefault();
			const x = e.pageX - slider.offsetLeft;
			const walk = (x - startX) * 1;
			slider.scrollLeft = scrollLeft - walk;
		});
	};

	React.useEffect(() => {
		try {
			setSlider();
		} catch {}
	});

	const [user, setUser] = React.useState<UserData | null>(null);
	const [todayLessons, setTodayLessons] = React.useState<any>(null);
	const [tomorrowLessons, setTomorrowLessons] = React.useState<any>(null);
	const [recentMarks, setRecentMarks] = React.useState<any>(null);
	const [news, setNews] = React.useState<any>(null);

	React.useEffect(() => {
		const getInfo = async () => {
			setUser(getUser());
			try {
				const content = await getMainContent();
				setTodayLessons(content.todayLessons);
				setTomorrowLessons(content.tomorrowLessons);
				setRecentMarks(content.recentMarks);
				setNews(content.news);
			} catch (e) {
				console.log(e);
				toast({
					title: "Произошла ошибка!",
					description: `${e}`,
					status: "error",
					duration: 3000,
					isClosable: true,
					position: isMobile ? "top" : "bottom",
				});
			}
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
				borderColor={
					isSelected ? (colorMode === "light" ? "black" : "white") : "#BBBBBB"
				}
				borderRadius="15px"
				color={
					isSelected ? (colorMode === "light" ? "black" : "white") : "#BBBBBB"
				}
				_hover={{
					bgColor: isSelected
						? colorMode === "light"
							? "black"
							: "white"
						: "#BBBBBB",
					color: colorMode === "light" ? "white" : "black",
				}}
				_active={{
					bgColor: isSelected
						? colorMode === "light"
							? "black"
							: "white"
						: "#BBBBBB",
					color: colorMode === "light" ? "white" : "black",
				}}
				w="100%"
				h="40px"
				{...tabProps}
			>
				{tabProps.children}
			</Button>
		);
	});

	const Grade = (props: any) => {
		let bgColor: string = "";

		switch (props.grade.marks[0].mood) {
			case "Good":
				bgColor = "rgba(0, 255, 25, 0.5)";
				break;
			case "Average":
				bgColor = "rgba(255, 122, 0, 0.5)";
				break;
			case "Bad":
				bgColor = "rgba(255, 0, 0, 0.5)";
				break;
		}

		return props.isLoading ? (
			<Stack direction="column" spacing="5px" userSelect="none">
				<Skeleton borderRadius="15px">
					<Stack
						minW={"120px"}
						minH={"120px"}
						bgColor={bgColor}
						borderRadius="15px"
						justifyContent="center"
						direction="column"
					>
						<Box />
						<Box flex="1" />
						<Center>
							<Heading color="white" size="3xl">
								5
							</Heading>
						</Center>
						<Box flex="1" />
					</Stack>
				</Skeleton>
				<Stack direction="column" spacing="0px">
					<SkeletonText noOfLines={2} />
				</Stack>
			</Stack>
		) : (
			<Stack direction="column" spacing="5px" userSelect="none">
				<Stack
					minW={"120px"}
					minH={"120px"}
					bgColor={bgColor}
					borderRadius="15px"
					justifyContent="center"
					direction="column"
				>
					<Box />
					<Box flex="1" />
					<Center>
						<Heading color="white" size="3xl">
							{props.grade.marks[0].value}
						</Heading>
					</Center>
					<Box flex="1" />
				</Stack>
				<Stack direction="column" spacing="0px">
					<Text fontSize={14}>
						{props.grade.lesson.name}
						<br />
						<span style={{ color: "#818c99" }}>
							{moment.unix(props.grade.lesson.date).format("L")}
						</span>
					</Text>
				</Stack>
			</Stack>
		);
	};

	const NewsBlock = ({ item, isLoading }: any) => {
		return item.type === "Post" ? (
			<Box
				bgColor={block}
				border="1px solid"
				borderColor={border}
				borderRadius="15px"
				w="100%"
			>
				<Stack direction="column" spacing="20px" m="20px" overflow="hidden">
					<Stack direction="column" spacing="10px">
						<Stack direction="row" spacing="10px">
							{(isLoading && (
								<Skeleton borderRadius="15px">
									<Avatar
										name={item.content.title}
										src={item.content.topicLogoUrl}
										borderRadius="15px"
									></Avatar>
								</Skeleton>
							)) || (
								<Avatar
									name={item.content.title}
									src={item.content.topicLogoUrl}
									borderRadius="15px"
								></Avatar>
							)}
							{(isLoading && (
								<Stack direction="column" spacing="1px">
									<Skeleton>
										<Text fontSize={16}>{item.content.title}</Text>
										<Text fontSize={15} color="#AAAAAA">
											{`${moment.unix(item.timeStamp).format("LLL")}`}
										</Text>
									</Skeleton>
								</Stack>
							)) || (
								<Stack direction="column" spacing="1px">
									<Text fontSize={16}>{item.content.title}</Text>
									<Text fontSize={15} color="#AAAAAA">
										{`${moment.unix(item.timeStamp).format("LLL")}`}
									</Text>
								</Stack>
							)}
						</Stack>
						<Text className="news-text">
							{(isLoading && <SkeletonText noOfLines={5} />) || (
								<Linkify>{parse(item.content.text)}</Linkify>
							)}
						</Text>
					</Stack>
					{item.content.files && (
						<Stack direction="column" spacing="5px" className="news-files">
							{item.content.files.map((file: any) => (
								<Link
									color="#0072B2"
									_hover={{ textDecoration: "none", color: "black" }}
									href={`${file.fileLink}?fileName=${file.fileName}.${file.extension}`}
									isExternal
								>
									<Stack direction="row" spacing="3px">
										<Icon20DocumentOutline />

										<span>
											{file.fileName}.{file.extension}
										</span>
									</Stack>
								</Link>
							))}
						</Stack>
					)}
					{item.content.authorName && (
						<Text color="#0072B2" fontSize={14}>
							<Stack direction="row" spacing="3px">
								<Center>
									<Icon16UserOutline />
								</Center>

								<Center>
									<span>{item.content.authorName}</span>
								</Center>
							</Stack>
						</Text>
					)}
				</Stack>
			</Box>
		) : null;
	};

	return (
		<>
			{(user === null && <Loader />) || (
				<Stack direction={["column", "row"]} spacing={["20px", "50px"]}>
					<Box
						overflow="hidden"
						w={["100%", "35%"]}
						borderRadius="20px"
						bgColor={block}
						border="1px solid"
						borderColor={border}
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
							<Divider opacity="1" borderColor={border} />
							<Box mt="10px!important" mb="10px!important">
								<Stack
									className="grades"
									direction="row"
									cursor="grab"
									overflow="auto"
									overflowX="auto"
									spacing="10px"
									id="grades"
								>
									<Box />
									<Box />
									{(recentMarks === null && (
										<>
											{[1, 2, 3, 4, 5, 6].map((key) => (
												<Grade
													grade={{ marks: [{ id: key, mood: "Bad" }] }}
													isLoading
												/>
											))}
										</>
									)) || (
										<>
											{recentMarks.map((item: any) => (
												<Grade grade={item} />
											))}
										</>
									)}
									<Box />
								</Stack>
							</Box>
							<Divider opacity="1" borderColor={border} />
							<Tabs pb={"0px"}>
								<TabList borderBottomColor={border} borderBottom="1px">
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
									<TabPanel padding={0}>
										{(todayLessons !== null && (
											<>
												{todayLessons.length === 0 && (
													<Center paddingTop={5}>
														<Text
															color="rgba(187, 187, 187, 1)"
															fontWeight="bold"
														>
															Уроков не найдено
														</Text>
													</Center>
												)}
												{todayLessons.map((item: any, key: number) => (
													<Lesson
														lesson={item}
														isLast={
															key + 1 === todayLessons.length ? true : false
														}
													/>
												))}
											</>
										)) || (
											<>
												{[1, 2, 3, 4, 5, 6].map((key) => (
													<Stack
														direction="column"
														spacing="1px"
														id={key.toString()}
													>
														<Stack
															direction="column"
															spacing="1px"
															m="20px"
															mt="10px"
															mb="10px"
														>
															<SkeletonText noOfLines={2} />
														</Stack>
														{key !== 6 && (
															<Divider opacity="1" borderColor={border} />
														)}
													</Stack>
												))}
											</>
										)}
									</TabPanel>
									<TabPanel padding={0}>
										{(tomorrowLessons !== null && (
											<>
												{tomorrowLessons.length === 0 && (
													<Center paddingTop={5}>
														<Text
															color="rgba(187, 187, 187, 1)"
															fontWeight="bold"
														>
															Уроков не найдено
														</Text>
													</Center>
												)}
												{tomorrowLessons.map((item: any, key: number) => (
													<Lesson
														lesson={item}
														isLast={
															key + 1 === todayLessons.length ? true : false
														}
													/>
												))}
											</>
										)) || (
											<>
												{[1, 2, 3, 4, 5, 6].map((key) => (
													<Stack
														direction="column"
														spacing="1px"
														id={key.toString()}
													>
														<Stack
															direction="column"
															spacing="1px"
															m="20px"
															mt="10px"
															mb="10px"
														>
															<SkeletonText noOfLines={2} />
														</Stack>
														{key !== 6 && (
															<Divider opacity="1" borderColor={border} />
														)}
													</Stack>
												))}
											</>
										)}
									</TabPanel>
								</TabPanels>
							</Tabs>
						</Stack>
					</Box>
					{(news !== null && (
						<>
							{(news.length !== 0 && (
								<Stack w={["100%", "65%"]} direction="column" spacing="20px">
									{news.map((item: any) => (
										<NewsBlock item={item} />
									))}
								</Stack>
							)) || (
								<Center w={["100%", "65%"]}>
									<Text color="rgba(187, 187, 187, 1)" fontWeight="bold">
										Новостей не найдено
									</Text>
								</Center>
							)}
						</>
					)) || (
						<Stack w={["100%", "65%"]} direction="column" spacing="20px">
							{[1, 2, 3, 4, 5, 6, 7].map((key) => (
								<NewsBlock
									item={{
										type: "Post",
										content: {
											id: key,
											title: "Загрузка",
											text: "Загрузка",
											topicLogoUrl: "Загрузка",
										},
									}}
									isLoading
								/>
							))}
						</Stack>
					)}
				</Stack>
			)}
		</>
	);
}

export default Main;
