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
	Button,
	ButtonGroup,
} from "@chakra-ui/react";
import Loader from "../components/Loader";
import moment from "moment";
import "moment/locale/ru";
import Linkify from "react-linkify";
import { getDaysOfWeek } from "../hooks/Helpers";

function Schedule() {
	moment.locale("ru");

	const [schedule, setSchedule] = React.useState<IDay[] | []>([]);
	const [currentWeek, setCurrentWeek] = React.useState<number[]>([]);
	React.useEffect(() => {
		setCurrentWeek(
			getDaysOfWeek(
				new Date(moment().year(), moment().month(), moment().date())
			)
		);
	}, []);
	React.useEffect(() => {
		setSchedule([]);
		const getSchedule = async () => {
			const schedule = await getScheduleWeek(currentWeek);

			setSchedule(schedule);
		};

		getSchedule();
	}, [currentWeek]);

	const getPrevWeek = () => {
		setCurrentWeek(
			getDaysOfWeek(
				new Date(
					moment.unix(currentWeek[0]).utc().add(-7, "days").year(),
					moment.unix(currentWeek[0]).utc().add(-7, "days").month(),
					moment.unix(currentWeek[0]).utc().add(-7, "days").date()
				)
			)
		);
	};

	const getNextWeek = () => {
		setCurrentWeek(
			getDaysOfWeek(
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
	}

	interface IMark {
		marks: { mood: string; value: string }[];
	}

	const Day = ({ day, dayName }: { day: IDay | null; dayName: string }) => {
		return (
			<Stack direction="column" spacing="5px">
				<Text>{dayName}</Text>
				<Box bgColor="white" borderRadius="15px" border="1px solid #BBBBBB">
					{(day !== null && (
						<Stack direction="column" spacing="0px">
							{day.lessons.map((lesson, key) => {
								return (
									<Stack direction="column" spacing="1px">
										<Stack
											direction={["column", "row"]}
											spacing={["10px", "0px"]}
											m="20px"
											mt="10px"
											mb="10px"
											justifyContent="space-between"
										>
											<Stack
												direction={["column", "row"]}
												spacing={["10px", "50px"]}
											>
												<Stack direction="column" spacing="1px">
													<Text fontSize={18}>{lesson.subject.name}</Text>

													<Text fontSize={14} color="#AAAAAA">
														{lesson.number} урок
													</Text>
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
																<Center>
																	<Box
																		alignItems="center"
																		borderRadius="6px"
																		color="white"
																		display="flex"
																		fontSize="16px"
																		justifyContent="center"
																		userSelect="none"
																		minW="35px"
																		minH="35px"
																		overflow="hidden"
																		bgColor={bgColor}
																	>
																		<Heading fontSize={20}>
																			{mark.marks[0].value}
																		</Heading>
																	</Box>
																</Center>
															);
														})}
													</Stack>
												)}
											</Stack>
											<Text
												maxW={["auto", "200px"]}
												overflow="hidden"
												fontSize={14}
												color="#AAAAAA"
												className="homework"
											>
												<Linkify>{lesson.homework?.text}</Linkify>
											</Text>
										</Stack>
										{key + 1 !== day.lessons.length && (
											<Divider
												opacity="1"
												borderColor="rgba(187, 187, 187, 1)"
											/>
										)}
									</Stack>
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

	return schedule.length === 0 ? (
		<Loader />
	) : (
		<Container maxW={["full", "7xl"]}>
			<Stack direction="column" spacing="10px">
				<Stack direction="column" spacing="5px">
					<Heading size="md">
						{moment.unix(currentWeek[0]).format("LL")} –{" "}
						{moment.unix(currentWeek[6]).format("LL")}
					</Heading>
					<ButtonGroup variant="outline" spacing="2px">
						<Button
							borderRadius="10px"
							borderColor="black"
							w={["full", "100px"]}
							h="40px"
							color={"black"}
							_hover={{
								bgColor: "black",
								color: "white",
							}}
							onClick={getPrevWeek}
						>
							Назад
						</Button>
						<Button
							borderRadius="10px"
							borderColor="black"
							color={"black"}
							w={["full", "100px"]}
							h="40px"
							_hover={{
								bgColor: "black",
								color: "white",
							}}
							onClick={getNextWeek}
						>
							Далее
						</Button>
					</ButtonGroup>
				</Stack>
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
			</Stack>
		</Container>
	);
}

export default Schedule;
