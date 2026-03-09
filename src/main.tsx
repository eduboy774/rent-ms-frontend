import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ApolloProvider } from '@apollo/client';
import createApolloClient from './apollo/createApolloClient.ts';
import { UserProvider } from "./store/userContext.tsx";
import { LoaderProvider } from "./hooks/LoaderContext.tsx";

const client = createApolloClient();
createRoot(document.getElementById("root")!).render(
    <ApolloProvider client={client}>
      <StrictMode>
        <LoaderProvider>
        <ThemeProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
            style={{ zIndex: 99999 }}
          />
        <UserProvider>
        <AppWrapper>
        <App />
      </AppWrapper>
      </UserProvider>
    </ThemeProvider>
        </LoaderProvider>
  </StrictMode>,
  </ApolloProvider>
);
