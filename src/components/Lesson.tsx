import React from "react";
import {
	Stack,
	Text,
	Box,
	Heading,
	Divider,
	useColorMode,
} from "@chakra-ui/react";
import Linkify from "react-linkify";

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

function Lesson({ lesson, isLast }: { lesson: ILesson; isLast?: boolean }) {
	const { colorMode } = useColorMode();
	const border = colorMode === "light" ? "borderLight" : "borderDark";

	return (
		<Stack direction="column" spacing="1px">
			<Stack direction="column" spacing="1px" m="20px" mt="10px" mb="10px">
				<Stack direction="row" justifyContent="space-between">
					<Text fontSize={18}>
						{lesson.number}. {lesson.subject.name}
					</Text>
					{(!lesson.isCanceled && (
						<>
							{lesson.hours.startHour && (
								<Text fontWeight="bold" color="#AAAAAA">
									{lesson.hours.startHour}:{lesson.hours.startMinute} –{" "}
									{lesson.hours.endHour}:{lesson.hours.endMinute}
								</Text>
							)}
						</>
					)) || (
						<Text fontWeight="bold" color="red">
							Урок отменен
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
									minW={["28px", "35px"]}
									minH={["28px", "35px"]}
									overflow="hidden"
									bgColor={bgColor}
								>
									<Heading fontSize={[14, 18]}>{mark.marks[0].value}</Heading>
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
			{!isLast && <Divider opacity="1" borderColor={border} />}
		</Stack>
	);
}

export default Lesson;
