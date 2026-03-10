import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import { CompressTool, ResizeTool, CropTool, ConvertTool, RotateTool, RemoveBgTool } from "./pages/Tools";
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import NotFound from './components/NotFound';
import Blog from './pages/Blog';


const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/compress",
        element: <CompressTool />,
    },
    {
        path: "/resize",
        element: <ResizeTool />,
    },
    {
        path: "/crop",
        element: <CropTool />,
    },
    {
        path: "/convert",
        element: <ConvertTool />,
    },
    {
        path: "/rotate",
        element: <RotateTool />,
    },
    {
        path: "/remove-bg",
        element: <RemoveBgTool />,
    },
    {
        path: "/privacy",
        element: <PrivacyPolicy />,
    },
    {
        path: "/terms",
        element: <Terms />,
    },
    {
        path: "/contact",
        element: <Contact />,
    }, // <--- এখানে কমাটি মিস হয়েছিল
    {
        path: "*",
        element: <NotFound />,
    },
    {
        path: "/blog",
        element: <Blog />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;