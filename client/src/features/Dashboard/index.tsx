import { LastFileChanged } from "./LastChangedFiles/lastChangedFiles";
import { Piechart } from "./Piechart/piechart"
import "./style.css"

export const Dashboard = () => {
  return (
    <div id="DashboardGrid">
      <div className="DashboardBox">
        <Piechart />
      </div>
      <div className="DashboardBox">
        <LastFileChanged />
      </div>
      <div className="DashboardBox" />
      <div className="DashboardBox" />
      <div className="DashboardBox" />
      <div className="DashboardBox" />
    </div>
  );
}

export default Dashboard;