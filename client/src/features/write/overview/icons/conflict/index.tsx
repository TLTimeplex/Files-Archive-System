import "./style.css"

export interface ConflictIconProps {
  on: boolean;
}

export const ConflictIcon = ({ on }: ConflictIconProps) => {
  return (
    <div className={"ConflictIcon" + (on ? " enabled" : " ")} title={(on ? "Has conflicts" : "No conflicts")} >
      <div className="ConflictIcon-Stroke" />
      <div className="ConflictIcon-Point" />
    </div>
  );
}