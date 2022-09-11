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
} from "@chakra-ui/react";
import { getUser, UserData } from "../hooks/Auth";
import Loader from "../components/Loader";
import "../css/main.css";
import {
	getImportant,
	getTodayAndTomorrowLessons,
	getLessonInfo,
} from "../hooks/Api";
import moment from "moment";
import parse from "html-react-parser";
import "moment/locale/ru";
import Linkify from "react-linkify";
import { Icon20DocumentOutline } from "@vkontakte/icons";

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
				const important = await getImportant();
				setNews(important.feed);
				try {
					if (important.recentMarks.length === 0) {
						setRecentMarks([]);
					} else {
						let marks: any = [];

						for (const mark of important.recentMarks) {
							let lesson = await getLessonInfo(mark.lesson.id);

							marks.push({
								lesson: {
									date: mark.lesson.date,
									id: mark.lesson.id,
									name: lesson.subject.name,
								},
								marks: mark.marks,
							});
						}

						setRecentMarks(marks);
					}
				} catch {
					if (important.recentMarks === null) {
						setRecentMarks([]);
					} else {
						let marks: any = [];

						for (const mark of important.recentMarks) {
							let lesson = await getLessonInfo(mark.lesson.id);

							marks.push({
								lesson: {
									date: mark.lesson.date,
									id: mark.lesson.id,
									name: lesson.subject.name,
								},
								marks: mark.marks,
							});
						}

						setRecentMarks(marks);
					}
				}
			} catch (e) {
				toast({
					title: "Произошла ошибка при получении новостей и расписания",
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
				} else {
					setTodayLessons([]);
				}

				if (lessons.tomorrow.length !== 0) {
					setTomorrowLessons(lessons.tomorrow[0].lessons);
				} else {
					setTomorrowLessons([]);
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
				_active={{
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
				{lesson.workMarks.length !== 0 && (
					<Stack direction="row" spacing="2px">
						{lesson.workMarks.map((mark: any) => {
							let bgColor: string = "";

							switch (mark.marks[0].mood) {
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

							return (
								<Box
									alignItems="center"
									borderRadius="6px"
									color="white"
									display="flex"
									fontSize="16px"
									justifyContent="center"
									userSelect="none"
									minW="28px"
									minH="28px"
									overflow="hidden"
									bgColor={bgColor}
								>
									<Heading fontSize={14}>{mark.marks[0].value}</Heading>
								</Box>
							);
						})}
					</Stack>
				)}
				{lesson.homework?.text && (
					<Text className="homework" fontSize={14} color="#AAAAAA">
						<Linkify>{lesson.homework.text}</Linkify>
					</Text>
				)}
			</Stack>
			<Divider opacity="1" borderColor="rgba(187, 187, 187, 1)" />
		</Stack>
	);

	const NewsBlock = ({ item, isLoading }: any) => {
		return item.type === "Post" ? (
			<Box
				bgColor="white"
				border="1px solid #BBBBBB"
				borderRadius="15px"
				w="100%"
			>
				<Stack direction="column" spacing="20px" m="20px">
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
										{item.content.authorName && (
											<span>, {item.content.authorName}</span>
										)}
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
											<Grade grade={{ marks: [{ mood: "Bad" }] }} isLoading />

											<Grade grade={{ marks: [{ mood: "Bad" }] }} isLoading />

											<Grade grade={{ marks: [{ mood: "Bad" }] }} isLoading />

											<Grade grade={{ marks: [{ mood: "Bad" }] }} isLoading />

											<Grade grade={{ marks: [{ mood: "Bad" }] }} isLoading />

											<Grade grade={{ marks: [{ mood: "Bad" }] }} isLoading />
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
												{todayLessons.map((item: any) => (
													<Lesson lesson={item} />
												))}
											</>
										)) || (
											<>
												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>

												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>
												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>
												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>
												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>
												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>
												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>
											</>
										)}
									</TabPanel>
									<TabPanel padding={0} paddingBottom={5}>
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
												{tomorrowLessons.map((item: any) => (
													<Lesson lesson={item} />
												))}
											</>
										)) || (
											<>
												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>

												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>
												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>
												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>
												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>
												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>
												<Stack direction="column" spacing="1px">
													<Stack
														direction="column"
														spacing="1px"
														m="20px"
														mt="10px"
														mb="10px"
													>
														<SkeletonText noOfLines={2} />
													</Stack>
													<Divider
														opacity="1"
														borderColor="rgba(187, 187, 187, 1)"
													/>
												</Stack>
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
							<NewsBlock
								item={{
									content: {
										title: "Загрузка",
										text: "Загрузка",
										topicLogoUrl: "Загрузка",
									},
								}}
								isLoading
							/>
							<NewsBlock
								item={{
									content: {
										title: "Загрузка",
										text: "Загрузка",
										topicLogoUrl: "Загрузка",
									},
								}}
								isLoading
							/>
							<NewsBlock
								item={{
									content: {
										title: "Загрузка",
										text: "Загрузка",
										topicLogoUrl: "Загрузка",
									},
								}}
								isLoading
							/>
							<NewsBlock
								item={{
									content: {
										title: "Загрузка",
										text: "Загрузка",
										topicLogoUrl: "Загрузка",
									},
								}}
								isLoading
							/>
							<NewsBlock
								item={{
									content: {
										title: "Загрузка",
										text: "Загрузка",
										topicLogoUrl: "Загрузка",
									},
								}}
								isLoading
							/>
							<NewsBlock
								item={{
									content: {
										title: "Загрузка",
										text: "Загрузка",
										topicLogoUrl: "Загрузка",
									},
								}}
								isLoading
							/>
						</Stack>
					)}
				</Stack>
			)}
		</>
	);
}

export default Main;
