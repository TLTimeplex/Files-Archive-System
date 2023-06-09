export interface horizontalDividerProps {
  title: string;
}

export const HorizontalDivider = (props: horizontalDividerProps): React.ReactElement | null => {
  return (
    <div className="horizontalDivider">
      <span className="horizontalDividerLine" />
      <h3 className="horizontalDividerText">{props.title}</h3>
      <span className="horizontalDividerLine" />
    </div>
  );
}

export default HorizontalDivider;