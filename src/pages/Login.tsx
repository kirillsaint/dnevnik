import {
	Center,
	Container,
	Heading,
	Stack,
	Text,
	FormControl,
	FormErrorMessage,
	Input,
	Button,
	useToast,
	useColorModeValue,
	useColorMode,
} from "@chakra-ui/react";
import React from "react";
import { login } from "../hooks/Auth";
import { useForm } from "react-hook-form";

function Login() {
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

	const { colorMode } = useColorMode();
	const border = colorMode === "light" ? "borderLight" : "borderDark";

	const isMobile = width <= 768;

	const toast = useToast();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	type FormData = {
		login: string;
		password: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = handleSubmit(async (data) => {
		setIsLoading(true);
		try {
			const res = await login(data.login, data.password);
			if (!res.error) {
				window.location.href = "/";
				return;
			}

			if (res.error === "AxiosError: Request failed with status code 403") {
				toast({
					title: "Произошла ошибка",
					description: "Неправильный логин или пароль",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: isMobile ? "top" : "bottom",
				});
			} else {
				toast({
					title: "Произошла ошибка",
					description: `${res.error}`,
					status: "error",
					duration: 3000,
					isClosable: true,
					position: isMobile ? "top" : "bottom",
				});
			}
		} catch (e) {
			toast({
				title: "Произошла ошибка",
				description: `${e}`,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: isMobile ? "top" : "bottom",
			});
		} finally {
			setIsLoading(false);
		}
	});

	return (
		<Container minH="100vh">
			<Center minH="100vh">
				<Stack direction="column" spacing="15px">
					<Center>
						<Heading size="2xl">Авторизация</Heading>
					</Center>
					<Text fontSize={[16, 22]} textAlign="center">
						Для продолжения необходимо войти в аккаунт Дневник.ру
					</Text>

					<form onSubmit={onSubmit}>
						<Stack direction="column" spacing="10px">
							<Center>
								<FormControl maxW="sm" isInvalid={errors.login ? true : false}>
									<Input
										variant="filled"
										bgColor={useColorModeValue(
											"rgba(243, 243, 243, 1)",
											"#19191a"
										)}
										_hover={{
											bgColor: useColorModeValue("#fcfcfc", "#2e2e2e"),
										}}
										_focus={{
											bgColor: useColorModeValue("#fcfcfc", "#2e2e2e"),
										}}
										focusBorderColor="black"
										placeholder="Логин"
										borderColor={border}
										_placeholder={{ color: "rgba(143, 143, 143, 1)" }}
										borderRadius="10px"
										h="50px"
										isDisabled={isLoading}
										{...register("login", { required: true })}
									/>
									{errors.login && (
										<FormErrorMessage>Укажите логин</FormErrorMessage>
									)}
								</FormControl>
							</Center>
							<Center>
								<FormControl
									maxW="sm"
									isInvalid={errors.password ? true : false}
								>
									<Input
										variant="filled"
										bgColor={useColorModeValue(
											"rgba(243, 243, 243, 1)",
											"#19191a"
										)}
										_hover={{
											bgColor: useColorModeValue("#fcfcfc", "#2e2e2e"),
										}}
										_focus={{
											bgColor: useColorModeValue("#fcfcfc", "#2e2e2e"),
										}}
										focusBorderColor="black"
										placeholder="Пароль"
										borderColor={border}
										_placeholder={{ color: "rgba(143, 143, 143, 1)" }}
										borderRadius="10px"
										h="50px"
										type="password"
										isDisabled={isLoading}
										{...register("password", { required: true })}
									/>
									{errors.password && (
										<FormErrorMessage>Укажите пароль</FormErrorMessage>
									)}
								</FormControl>
							</Center>
							<Center>
								<Button
									variant="outline"
									borderColor={useColorModeValue("black", "white")}
									borderRadius="15px"
									_hover={{
										bgColor: useColorModeValue("black", "white"),
										color: useColorModeValue("white", "black"),
									}}
									w="sm"
									h="50px"
									type="submit"
									isLoading={isLoading}
								>
									Войти
								</Button>
							</Center>
						</Stack>
					</form>
				</Stack>
			</Center>
		</Container>
	);
}

export default Login;
