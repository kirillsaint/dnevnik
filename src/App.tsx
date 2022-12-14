import React from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import { getAuth, updateAuth } from "./hooks/Auth";
import Loader from "./components/Loader";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Schedule from "./pages/Schedule";
import Menu from "./pages/Menu";

function App() {
	const [auth, setAuth] = React.useState<boolean | null>(null);

	React.useEffect(() => {
		const checkAuth = async () => {
			const check = await getAuth();

			setAuth(check);

			if (check) {
				updateAuth();
			}
		};

		checkAuth();
	}, []);
	return (
		<HashRouter>
			<ScrollToTop />
			{auth && <Header />}
			<Container
				maxW={["full", "full", "full", "full", "full", "8xl"]}
				paddingInlineStart={0}
				paddingInlineEnd={0}
				paddingLeft={[3, 10]}
				paddingRight={[3, 10]}
				zIndex={2}
				paddingTop={auth ? [16, 20] : 0}
				paddingBottom={auth ? 20 : 0}
			>
				<Routes>
					{(auth === null && <Route path="*" element={<Loader />} />) || (
						<>
							{(auth === false && <Route path="*" element={<Login />} />) || (
								<>
									<Route path="/" element={<Main />} />
									<Route path="/schedule" element={<Schedule />} />
									<Route path="/menu" element={<Menu />} />
									<Route path="*" element={<Navigate to="/" />} />
								</>
							)}
						</>
					)}
				</Routes>
			</Container>
		</HashRouter>
	);
}

export default App;
