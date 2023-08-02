import "./style.css";

export interface LocalIconProps {
  on: boolean;
}

export const LocalIcon = ({ on }: LocalIconProps) => {
  return (
    <div className={"LocalIcon" + (on ? " enabled" : " ")} title={(on ? "Locally available" : "Not locally available")} >
      <div className="LocalIcon-Shaft" />
      <div className="LocalIcon-Point" />
      <div className="LocalIcon-Plate" />
    </div>
  );
}