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
  Skeleton,
  SkeletonText,
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
  }

  interface IMark {
    marks: { mood: string; value: string }[];
  }

  const Day = ({
    day,
    dayName,
    isLoading,
  }: {
    day: IDay | null;
    dayName: string;
    isLoading?: boolean;
  }) => {
    return (
      <Stack direction="column" spacing="5px">
        <Text>{dayName}</Text>
        <Box
          bgColor="blockColor"
          borderRadius="15px"
          border="1px solid #BBBBBB"
        >
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
                      <Divider opacity="1" borderColor="border" />
                    )}
                  </Stack>
                );
              })}
            </Stack>
          )) || (
            <>
              {(!isLoading && (
                <Center w="100%" mt="10px" mb="10px">
                  <Text color="rgba(187, 187, 187, 1)" fontWeight="bold">
                    Уроков не найдено
                  </Text>
                </Center>
              )) || (
                <Stack direction="column" spacing="0px">
                  {[1, 2, 3, 4].map((key) => (
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
                            <Skeleton>
                              <Text fontSize={18}>Зачем ты это читаешь?</Text>
                            </Skeleton>

                            <Skeleton>
                              <Text fontSize={14} color="#AAAAAA">
                                1 урок
                              </Text>
                            </Skeleton>
                          </Stack>

                          <Stack direction="row" spacing="2px">
                            <Center>
                              <Skeleton
                                minW="35px"
                                minH="35px"
                                borderRadius="6px"
                              >
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
                                  bgColor={"rgba(0, 255, 25, 0.5)"}
                                >
                                  <Heading fontSize={20}>5</Heading>
                                </Box>
                              </Skeleton>
                            </Center>

                            <Center>
                              <Skeleton
                                minW="35px"
                                minH="35px"
                                borderRadius="6px"
                              >
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
                                  bgColor={"rgba(0, 255, 25, 0.5)"}
                                >
                                  <Heading fontSize={20}>5</Heading>
                                </Box>
                              </Skeleton>
                            </Center>
                          </Stack>
                        </Stack>
                        <SkeletonText noOfLines={4} spacing="1">
                          <Text>НЕ ЧИТАЙ ЭТО!!</Text>
                        </SkeletonText>
                      </Stack>

                      {key !== 4 && (
                        <Divider opacity="1" borderColor="border" />
                      )}
                    </Stack>
                  ))}
                </Stack>
              )}
            </>
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
