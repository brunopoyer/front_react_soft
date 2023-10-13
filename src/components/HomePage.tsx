import {Route, Routes} from "react-router-dom";
import {Wines} from "./Wines.tsx";
import Sales from "./Sales.tsx";
import {Sale} from "./Sale.tsx";

export function HomePage() {
    return (
        <>
            <header className="w-screen bg-cyan-500 px-4 py-5 flex justify-between align-items">
                <h1 className="font-bold text-4xl text-white"><a href="/">Teste SoftExpert</a></h1>
                <ul className="grid grid-flow-col gap-x-4 text-white pt-2">
                    <li><a href="/wines">Vinhos</a></li>
                    <li><a href="/sales">Vendas</a></li>
                </ul>
            </header>
            <Routes>
                <Route path="/wines" element={<Wines/>}/>
                <Route path="/sales" element={<Sales/>}/>
                <Route path="/sale" element={<Sale/>}/>
            </Routes>
        </>
    );
}
