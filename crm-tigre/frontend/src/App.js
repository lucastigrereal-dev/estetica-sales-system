import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";

import { ptBR } from "@material-ui/core/locale";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import ColorModeContext from "./layout/themeContext";

import Routes from "./routes";

const queryClient = new QueryClient();

const App = () => {
    const [locale, setLocale] = useState();

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const preferredTheme = window.localStorage.getItem("preferredTheme");
    const [mode, setMode] = useState(preferredTheme ? preferredTheme : prefersDarkMode ? "dark" : "light");

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    const theme = createTheme(
        {
            scrollbarStyles: {
                "&::-webkit-scrollbar": {
                    width: '8px',
                    height: '8px',
                },
                "&::-webkit-scrollbar-thumb": {
                    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
                    backgroundColor: "#C9A050",
                },
            },
            scrollbarStylesSoft: {
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: mode === "light" ? "#F5F5F5" : "#2D4A6F",
                },
            },
            palette: {
                type: mode,
                // PREMIUM COLORS - Instituto Rodovansky
                primary: { main: "#C9A050" }, // Dourado Premium
                secondary: { main: "#1A2E4C" }, // Azul Marinho
                textPrimary: mode === "light" ? "#1A2E4C" : "#E8D5A3",
                borderPrimary: mode === "light" ? "#C9A050" : "#9A7B3D",
                dark: { main: mode === "light" ? "#1A2E4C" : "#9A7B3D" },
                light: { main: mode === "light" ? "#FAF8F5" : "#2D4A6F" },
                tabHeaderBackground: mode === "light" ? "#F5ECDA" : "#2D4A6F",
                optionsBackground: mode === "light" ? "#FAF8F5" : "#1A2E4C",
                options: mode === "light" ? "#FAF8F5" : "#2D4A6F",
                fontecor: mode === "light" ? "#C9A050" : "#E8D5A3",
                fancyBackground: mode === "light" ? "#FAF8F5" : "#1A2E4C",
                bordabox: mode === "light" ? "#E8D5A3" : "#2D4A6F",
                newmessagebox: mode === "light" ? "#E8D5A3" : "#2D4A6F",
                inputdigita: mode === "light" ? "#FFFFFF" : "#2D4A6F",
                contactdrawer: mode === "light" ? "#FFFFFF" : "#2D4A6F",
                announcements: mode === "light" ? "#F5ECDA" : "#2D4A6F",
                login: mode === "light" ? "#FFFFFF" : "#1A2E4C",
                announcementspopover: mode === "light" ? "#FFFFFF" : "#2D4A6F",
                chatlist: mode === "light" ? "#E8D5A3" : "#2D4A6F",
                boxlist: mode === "light" ? "#F5ECDA" : "#2D4A6F",
                boxchatlist: mode === "light" ? "#F5ECDA" : "#1A2E4C",
                total: mode === "light" ? "#FFFFFF" : "#1A2E4C",
                messageIcons: mode === "light" ? "#9A7B3D" : "#E8D5A3",
                inputBackground: mode === "light" ? "#FFFFFF" : "#2D4A6F",
                barraSuperior: mode === "light" ? "linear-gradient(135deg, #1A2E4C 0%, #2D4A6F 50%, #C9A050 100%)" : "#1A2E4C",
                boxticket: mode === "light" ? "#F5ECDA" : "#2D4A6F",
                campaigntab: mode === "light" ? "#E8D5A3" : "#2D4A6F",
                // Status Colors
                success: { main: "#059669" },
                warning: { main: "#D97706" },
                error: { main: "#DC2626" },
                info: { main: "#0284C7" },
            },
            mode,
        },
        locale
    );

    useEffect(() => {
        const i18nlocale = localStorage.getItem("i18nextLng");
        const browserLocale =
            i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

        if (browserLocale === "ptBR") {
            setLocale(ptBR);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("preferredTheme", mode);
    }, [mode]);



    return (
        <ColorModeContext.Provider value={{ colorMode }}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <Routes />
                </QueryClientProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;
