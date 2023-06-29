import { LastFileChanged } from "./LastChangedFiles/lastChangedFiles";
import { Piechart } from "./Piechart/piechart"

export const Dashboard = () => {
    return (
        <div>
            <Piechart />
            <LastFileChanged/> 
        </div>
    );
}

export default Dashboard;