import { ConflictIcon } from "./icons/conflict";
import { LocalIcon } from "./icons/local";
import { OptionsIcon } from "./icons/options";
import { PublicIcon } from "./icons/public";
import { SyncedIcon } from "./icons/synced";

export interface ListItemProps {
  Title: string;
  Tags?: null; // NOT IMPLEMENTED YET
  isArchived: boolean;
  statusSet: statusSet;
  date: Date;
  content: string;
  viewCallback?: () => void;
  deleteCallback?: () => void;
  syncCallback?: () => void;
  mergeCallback?: () => void;
  archiveCallback?: () => void;
}

export interface statusSet {
  isLocallyAvailable?: boolean; // Archive & Report
  isSynced?: boolean; // Report
  isPublic?: boolean; // Report
  hasConflicts?: boolean; // Report & Archive
}

export const ListItem = (props: ListItemProps) => {

  return (
    <tr className="ListItem">
      <td className="ListItem-Items" onClick={props.viewCallback}>
        <div className="ListItem-Title">{props.Title}</div>
        <div className="ListItem-Tags">{props.Tags}</div>
        <div className="ListItem-Status">
          <div className="ListItem-Status-Local"><LocalIcon on={props.statusSet.isLocallyAvailable || false} /></div>
          <div className="ListItem-Status-Conflict"><ConflictIcon on={props.statusSet.hasConflicts || false} /></div>
          {!props.isArchived ? <div className="ListItem-Status-Synced"><SyncedIcon on={props.statusSet.isSynced || false} /></div> : null}
          {!props.isArchived ? <div className="ListItem-Status-Public"><PublicIcon on={props.statusSet.isPublic || false} /></div> : null}
        </div>
        <div className="ListItem-Date">{props.date.toLocaleDateString()}</div>
        <div className="ListItem-Content">{props.content}</div>
      </td>
      <td className="ListItem-Actions" onClick={(event) => {
        event.stopPropagation();
        const thisElement = event.currentTarget as HTMLElement;
        const allOtherElements = document.querySelectorAll(".ListItem-Actions.active");
        allOtherElements.forEach((element) => {
          if (element !== thisElement)
            element.classList.remove("active");
        });
        thisElement.classList.toggle("active");
      }}>
        <OptionsIcon />
        <div className="ListItem-ActionsContainer">
          {props.deleteCallback ? <div className="ListItem-Action-Delete" onClick={props.deleteCallback}>Delete</div> : null}
          {props.syncCallback ? <div className="ListItem-Action-Sync" onClick={props.syncCallback}>Sync</div> : null}
          {props.mergeCallback ? <div className="ListItem-Action-Merge" onClick={props.mergeCallback}>Merge</div> : null}
          {props.archiveCallback ? <div className="ListItem-Action-Archive" onClick={props.archiveCallback}>Archive</div> : null}
        </div>
      </td>
    </tr>
  );
}