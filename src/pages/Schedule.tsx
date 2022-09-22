import React from "react";
import { getScheduleWeek } from "../hooks/Api";
import {
	Box,
	Stack,
	Heading,
	Text,
	Center,
	SimpleGrid,
	Divider,
	Container,
	Spinner,
	useColorMode,
	IconButton,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/ru";
import Linkify from "react-linkify";
import { getDaysOfWeek } from "../hooks/Helpers";
import {
	Icon28ArrowRightOutline,
	Icon28ArrowLeftOutline,
} from "@vkontakte/icons";
import Lesson from "../components/Lesson";

function Schedule() {
	const { colorMode } = useColorMode();
	const block = colorMode === "light" ? "blockLight" : "blockDark";
	const border = colorMode === "light" ? "borderLight" : "borderDark";
	moment.locale("ru");

	const [schedule, setSchedule] = React.useState<IDay[] | []>([]);
	const [currentWeek, setCurrentWeek] = React.useState<number[]>([]);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
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
	React.useEffect(() => {
		const getDays = async () => {
			setCurrentWeek(
				await getDaysOfWeek(
					new Date(moment().year(), moment().month(), moment().date())
				)
			);
		};
		getDays();
	}, []);
	React.useEffect(() => {
		setSchedule([]);
		const getSchedule = async () => {
			try {
				setIsLoading(true);
				const schedule = await getScheduleWeek(currentWeek);

				setSchedule(schedule);
			} finally {
				setIsLoading(false);
			}
		};

		getSchedule();
	}, [currentWeek]);

	const getPrevWeek = async () => {
		setIsLoading(true);
		setCurrentWeek(
			await getDaysOfWeek(
				new Date(
					moment.unix(currentWeek[0]).utc().add(-7, "days").year(),
					moment.unix(currentWeek[0]).utc().add(-7, "days").month(),
					moment.unix(currentWeek[0]).utc().add(-7, "days").date()
				)
			)
		);
	};

	const getNextWeek = async () => {
		setIsLoading(true);
		setCurrentWeek(
			await getDaysOfWeek(
				new Date(
					moment.unix(currentWeek[0]).utc().add(7, "days").year(),
					moment.unix(currentWeek[0]).utc().add(7, "days").month(),
					moment.unix(currentWeek[0]).utc().add(7, "days").date()
				)
			)
		);
	};

	interface IDay {
		date: number;
		lessons: ILesson[];
	}

	interface ILesson {
		id: number;
		subject: {
			id: number;
			name: string;
		};
		homework: {
			text: string;
		} | null;
		number: number | string;
		workMarks: IMark[];
		hours: {
			startHour?: string | number;
			startMinute?: string | number;
			endHour?: string | number;
			endMinute?: string | number;
		};
		isCanceled: boolean;
	}

	interface IMark {
		marks: { mood: string; value: string }[];
	}

	const Day = ({ day, dayName }: { day: IDay | null; dayName: string }) => {
		return (
			<Stack direction="column" spacing="5px">
				<Text>{dayName}</Text>
				<Box
					bgColor="blockColor"
					borderRadius="15px"
					border="1px solid"
					borderColor={border}
				>
					{(day !== null && (
						<Stack direction="column" spacing="0px">
							{day.lessons.map((lesson, key) => {
								return (
									<Lesson
										lesson={lesson}
										isLast={key + 1 === day.lessons.length ? true : false}
									/>
								);
							})}
						</Stack>
					)) || (
						<Center w="100%" mt="10px" mb="10px">
							<Text color="rgba(187, 187, 187, 1)" fontWeight="bold">
								Уроков не найдено
							</Text>
						</Center>
					)}
				</Box>
			</Stack>
		);
	};

	return (
		<Container maxW={["full", "7xl"]}>
			<Stack direction="column" spacing="10px">
				<Stack direction="column" spacing="5px">
					<Stack
						bgColor={block}
						direction="row"
						spacing="10px"
						borderRadius={"8px"}
						justifyContent={"space-between"}
						w="full"
					>
						<IconButton
							bgColor={block}
							w="48px"
							h="48px"
							aria-label="Назад"
							onClick={getPrevWeek}
							isLoading={isLoading}
							icon={<Icon28ArrowLeftOutline />}
						/>
						{currentWeek.length !== 0 && (
							<span
								style={{
									alignItems: "center",
									boxSizing: "border-box",
									display: "flex",
									justifyContent: "center",
									minHeight: "inherit",
									textAlign: "center",
									width: "100%",
								}}
							>
								<Text fontWeight={600} fontSize={"16px"}>
									{(isMobile && (
										<span>
											{moment.unix(currentWeek[0]).format("L")} –{" "}
											{moment.unix(currentWeek[6]).format("L")}
										</span>
									)) || (
										<span>
											{moment.unix(currentWeek[0]).format("LL")} –{" "}
											{moment.unix(currentWeek[6]).format("LL")}
										</span>
									)}
								</Text>
							</span>
						)}
						<IconButton
							bgColor={block}
							w="48px"
							h="48px"
							aria-label="Далее"
							onClick={getNextWeek}
							isLoading={isLoading}
							icon={<Icon28ArrowRightOutline />}
						/>
					</Stack>
				</Stack>

				{(schedule.length !== 0 && (
					<SimpleGrid columns={[1, 2]} spacing={["10px", "20px"]}>
						<Stack direction="column" spacing={["10px", "20px"]}>
							<Day day={schedule[0]} dayName="Понедельник" />
							<Day day={schedule[1]} dayName="Вторник" />
							<Day day={schedule[2]} dayName="Среда" />
						</Stack>

						<Stack direction="column" spacing={["10px", "20px"]}>
							<Day day={schedule[3]} dayName="Четверг" />
							<Day day={schedule[4]} dayName="Пятница" />
							<Day day={schedule[5]} dayName="Суббота" />
							<Day day={schedule[6]} dayName="Воскресенье" />
						</Stack>
					</SimpleGrid>
				)) || (
					<Box h="100%" w="100%">
						<Center>
							<Spinner
								color={colorMode === "light" ? "black" : "white"}
								size="xl"
							/>
						</Center>
					</Box>
				)}
			</Stack>
		</Container>
	);
}

export default Schedule;
