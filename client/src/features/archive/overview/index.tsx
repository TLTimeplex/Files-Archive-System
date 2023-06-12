import { Tabs, Tab } from "react-bootstrap";

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
          Tab content for Home
        </Tab>
        <Tab eventKey="saved" title="Saved">
          Tab content for Profile
        </Tab>
      </Tabs>
    </>
  );
}

export default Overview;