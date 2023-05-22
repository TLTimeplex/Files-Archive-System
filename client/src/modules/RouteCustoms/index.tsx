import { useLocation} from 'react-router-dom';

export interface RouteCustomsProps {
  element: JSX.Element;
  blocked?: string[];
}

export const RouteCustoms = (props: RouteCustomsProps) : React.ReactElement | null => {
  const location = useLocation();

  if(props.blocked?.includes(location.pathname))
    return null;
    
  return props.element;
};