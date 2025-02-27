import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AllRecipesPage from "./pages/AllRecipesPage";
import SingleRecipePage from "./pages/SingleRecipePage";
import FavoriteRecipesPage from "./pages/SelectedRecipesPage";
import NotFound from "./pages/404";
import Layout from "./components/layout/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<AllRecipesPage />} />
            <Route path="/recipe/:id" element={<SingleRecipePage />} />
            <Route path="/favorites" element={<FavoriteRecipesPage />} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
