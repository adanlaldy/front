import PWABadge from './PWABadge.tsx'
import './App.css'
import MyRouter from "./router/MyRouter.tsx";
import {Toaster} from "sonner";

function App() {
    return (
        <>
            <MyRouter/>
            <Toaster richColors position="top-center" />
            <PWABadge/>
        </>
    )
}

export default App
