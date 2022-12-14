import React from "react";
import {
	Stack,
	Text,
	Box,
	Heading,
	Divider,
	useColorMode,
	useDisclosure,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Link,
} from "@chakra-ui/react";
import Linkify from "react-linkify";
import moment from "moment";
import { getSettings } from "../hooks/Settings";

export type LessonType = {
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
	status: string;
	theme: string;
	startTime: number;
	place: string;
};

interface IMark {
	marks: { mood: string; value: string }[];
}

function Lesson({ lesson, isLast }: { lesson: LessonType; isLast?: boolean }) {
	moment.locale("ru");
	const settings = getSettings();
	const { colorMode } = useColorMode();
	const border = colorMode === "light" ? "borderLight" : "borderDark";
	const block = colorMode === "light" ? "blockLight" : "blockDark";
	const { isOpen, onOpen, onClose } = useDisclosure();
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

	const Mark = ({ mark }: any) => {
		let bgColor: string = "";

		switch (mark.marks[0].mood) {
			case "Good":
				bgColor = "rgba(0, 255, 25, 0.5)";
				break;
			case "Average":
				bgColor = "rgba(255, 122, 0, 0.5)";
				break;
			case "Bad":
				if (!settings?.replaceBadMarks) {
					bgColor = "rgba(255, 0, 0, 0.5)";
				} else {
					bgColor = "rgba(0, 255, 25, 0.5)";
				}
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
				minW={["28px", "35px"]}
				minH={["28px", "35px"]}
				overflow="hidden"
				bgColor={bgColor}
			>
				<Heading fontSize={[14, 18]}>
					{(settings?.replaceBadMarks && (
						<>
							{(mark.marks[0].mood === "Bad" && <span>4</span>) || (
								<span>{mark.marks[0].value}</span>
							)}
						</>
					)) || <span>{mark.marks[0].value}</span>}
				</Heading>
			</Box>
		);
	};

	return (
		<Stack direction="column" spacing="1px">
			<Drawer
				placement={isMobile ? "bottom" : "right"}
				onClose={onClose}
				isOpen={isOpen}
			>
				<DrawerOverlay />
				<DrawerContent bgColor={block}>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth="1px" borderBottomColor={border}>
						<Stack direction="column" spacing="10px">
							<Stack direction="column" spacing="0px">
								{lesson.startTime && (
									<Text fontSize={16}>
										{lesson.hours.startHour}:{lesson.hours.startMinute} ???{" "}
										{lesson.hours.endHour}:{lesson.hours.endMinute},{" "}
										{moment.unix(lesson.startTime).format("LL")}
									</Text>
								)}
								<Text fontSize={16}>
									{lesson.number} ????????
									{lesson.place && <span>, {lesson.place}</span>}
									{lesson.isCanceled && (
										<span>
											, <span style={{ color: "red" }}>??????????????</span>
										</span>
									)}
								</Text>
							</Stack>
							<Stack direction="column" spacing="0px">
								<Text>{lesson.subject.name}</Text>
								{lesson.theme && (
									<Text fontSize={16} color="#aaa">
										{lesson.theme}
									</Text>
								)}
							</Stack>
						</Stack>
					</DrawerHeader>
					<DrawerBody padding={0}>
						<Stack direction="column">
							<Box borderBottomWidth="1px" borderBottomColor={border}>
								<Stack
									direction="column"
									spacing={lesson.workMarks.length === 0 ? "0px" : "5px"}
									padding={5}
									paddingTop={2}
									paddingBottom={2}
								>
									<Text fontWeight="bold" fontSize={18}>
										????????????
									</Text>
									{(lesson.workMarks.length === 0 && (
										<Text fontSize={16}>???????????? ??????</Text>
									)) || (
										<Stack direction="row" spacing="2px">
											{lesson.workMarks.map((mark: any) => (
												<Mark mark={mark} />
											))}
										</Stack>
									)}
								</Stack>
							</Box>
							<Box borderBottomWidth="1px" borderBottomColor={border}>
								<Stack
									direction="column"
									spacing="0px"
									padding={5}
									paddingTop={2}
									paddingBottom={2}
								>
									<Text fontWeight="bold" fontSize={18}>
										???????????????? ??????????????
									</Text>
									<Text fontSize={16} className="homework">
										<Linkify>
											{lesson.homework?.text
												? lesson.homework.text
												: "?????? ?????????????????? ??????????????"}
										</Linkify>
									</Text>
								</Stack>
							</Box>
						</Stack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
			<Stack direction="column" spacing="1px" m="20px" mt="10px" mb="10px">
				<Stack direction="row" justifyContent="space-between">
					<Link fontSize={18} onClick={onOpen}>
						{lesson.number}. {lesson.subject.name}
					</Link>
					{(!lesson.isCanceled && (
						<>
							{lesson.hours.startHour && (
								<Text fontWeight="bold" color="#AAAAAA">
									{lesson.hours.startHour}:{lesson.hours.startMinute} ???{" "}
									{lesson.hours.endHour}:{lesson.hours.endMinute}
								</Text>
							)}
						</>
					)) || (
						<Text fontWeight="bold" color="red">
							???????? ??????????????
						</Text>
					)}
				</Stack>
				{lesson.workMarks.length !== 0 && (
					<Stack direction="row" spacing="2px">
						{lesson.workMarks.map((mark: any) => (
							<Mark mark={mark} />
						))}
					</Stack>
				)}
				{lesson.homework?.text && (
					<Text className="homework" fontSize={14} color="#AAAAAA">
						<Linkify>{lesson.homework.text}</Linkify>
					</Text>
				)}
			</Stack>
			{!isLast && <Divider opacity="1" borderColor={border} />}
		</Stack>
	);
}

export default Lesson;
