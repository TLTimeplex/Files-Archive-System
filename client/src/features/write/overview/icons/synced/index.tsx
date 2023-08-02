import "./style.css"

export interface SyncedIconProps {
  on: boolean;
}

export const SyncedIcon = ({ on }: SyncedIconProps) => {
  return (
    <div className={"SyncedIcon" + (on ? " enabled" : " ")} title={(on ? "Synced" : "Not synced")} >
      <div className="SyncedIcon-LeftShaft" />
      <div className="SyncedIcon-RightShaft" />
      <div className="SyncedIcon-LeftPoint" />
      <div className="SyncedIcon-RightPoint" />
    </div>
  );
};