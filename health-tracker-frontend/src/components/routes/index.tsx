import { Routes, Route} from 'react-router-dom';
// import Dashboard from '../pages/Dashboard';
import Login from '../../pages/Login';
import ImcCalculator from '../ImcCalculator';
import ImcAcompanhamento from '../ImcAcompanhamento';
import Register from '../../pages/Register';

export default function AppRoutes() {
    
    return (
        <Routes>
            <Route path='/' element={<Login/>} />
            {/* <Route path='/Profile' element={<Profile/>}/> */}
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
            <Route path="/imc-calculator" element={<ImcCalculator />} />
            <Route path="/acompanhamento" element={<ImcAcompanhamento />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}