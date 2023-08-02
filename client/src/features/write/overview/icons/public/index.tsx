import "./style.css"

export interface PublicIconProps {
  on: boolean;
}

export const PublicIcon = ({ on }: PublicIconProps) => {
  return (
    <div className={"PublicIcon" + (on ? " enabled" : " ")} title={(on ? "Public" : "Not public")} >
      <div className="PublicIcon-Head">
        <div className="PublicIcon-Bow" />
        <div className="PublicIcon-BowInner" />
        <div className="PublicIcon-BowMask" />

        <div className="PublicIcon-PinLeft" />
        <div className="PublicIcon-PinRight" />
      </div>
      <div className="PublicIcon-Body" />
    </div>
  );
}