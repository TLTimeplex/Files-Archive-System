import { Tabs, Tab } from "react-bootstrap";
import Saved from "./saved";
import Archived from "./archived";

export const Overview = () => {
  return (
    <>
      <Tabs
        defaultActiveKey={navigator.onLine ? "archive" : "saved"}
        id="archive-tabs"
        className="mb-3"
        justify
      >
        <Tab eventKey="archive" title="Archive" disabled={!navigator.onLine}>
          <Archived />
        </Tab>
        <Tab eventKey="saved" title="Saved">
          <Saved />
        </Tab>
      </Tabs>
    </>
  );
}

export default Overview;