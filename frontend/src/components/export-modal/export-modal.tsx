import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { store } from "../../store";

import "./export-modal.scss";
import SessionDropdown from "./session-dropdown/session-dropdown";
import Modal from "../modal/modal";
import { BasicSessionInfo, CourseGradesResponse } from "../../types";
import { getCourseGrades, catchError, exportGrades } from "../../util/api";

const ExportModal = (): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;
  const state = global.state;

  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const [sessions, setSessions] = useState<BasicSessionInfo[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [assignmentPoints, setAssignmentPoints] = useState<number>(10);
  const [assignmentName, setAssignmentName] = useState<string>("");

  const [warnEmptyName, setWarnEmptyName] = useState<boolean>(false);
  const [warnNoneSelected, setWarnNoneSelected] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const location = useLocation();
  const path: string = location.pathname;
  // if the path is /gradebook/:id get the id else set it to null
  const id: number | null = path.match(/\/gradebook\/\d+/)
    ? parseInt(path.split("/")[2])
    : null;

  useEffect(() => {
    if (firstLoad) {
      if (id !== null) {
        setSelectedIds([id]);
      }

      getCourseGrades(state.courseId, state.jwt)
        .then((response) => {
          return response.json();
        })
        .then((response: CourseGradesResponse): void => {
          setSessions(response.sessions);
          setDataLoaded(true);
        })
        .catch(catchError);

      setFirstLoad(false);
    }
  }, [firstLoad, dataLoaded, state.courseId, state.jwt, id]);

  const updateAssignmentPoints = (event: SyntheticEvent): void => {
    const value = Number((event.target as HTMLInputElement).value);

    setAssignmentPoints(value);
  };

  const updateAssignmentName = (event: SyntheticEvent): void => {
    const value: string = (event.target as HTMLInputElement).value;

    setAssignmentName(value);
  };

  const cancel = (): void => {
    dispatch({ type: "close-export-modal" });
  };

  const exportGradesToCanvas = (event: SyntheticEvent): void => {
    event.preventDefault();

    if (!assignmentName) {
      setWarnEmptyName(true);
    }

    if (selectedIds.length <= 0) {
      setWarnNoneSelected(true);
    }

    if (!assignmentName || selectedIds.length <= 0) {
      return;
    }

    setIsExporting(true);

    exportGrades(
      state.courseId,
      {
        name: assignmentName,
        points: assignmentPoints,
        sessionIds: selectedIds,
      },
      state.jwt
    )
      .then(() => {
        dispatch({ type: "close-export-modal" });
      })
      .catch(catchError);
  };

  return (
    <Modal>
      <form className="export-modal">
        <div className="export-header">
          <h3>Export to Webcourses</h3>

          <button className="exit-button" onClick={cancel}>
            X
          </button>
        </div>

        <div className="session-list">
          <div className="labels">
            <span>Session</span>

            <span className="points">Points</span>
          </div>

          {sessions.map(
            (session: BasicSessionInfo, index: number): ReactElement => {
              if (id !== undefined && id === session.id) {
                return (
                  <SessionDropdown
                    key={index}
                    name={session.name}
                    points={session.SessionGrades[0]["maxPoints"]}
                    index={index}
                    preSelected={true}
                    id={session.id}
                    setSelectedIds={setSelectedIds}
                    selectedIds={selectedIds}
                  />
                );
              }

              return (
                <SessionDropdown
                  key={index}
                  name={session.name}
                  points={session.SessionGrades[0]["maxPoints"]}
                  index={index}
                  preSelected={false}
                  id={session.id}
                  setSelectedIds={setSelectedIds}
                  selectedIds={selectedIds}
                />
              );
            }
          )}
        </div>

        <div className="metadata">
          <div className="assignment-input">
            <label htmlFor="export-assignment-name">Assignment Name:</label>

            <input
              id="export-assignment-name"
              placeholder="Assignment 1"
              value={assignmentName}
              onChange={updateAssignmentName}
            />
          </div>

          <div>
            <label htmlFor="export-assignment-points">Assignment Points:</label>

            <input
              id="export-assignment-points"
              type="number"
              placeholder="10"
              value={assignmentPoints}
              onChange={updateAssignmentPoints}
            />
          </div>

          {warnEmptyName ? (
            <p className="warning">Please choose an assignment name.</p>
          ) : null}

          {warnNoneSelected ? (
            <p className="warning">
              Please select at least one assignment to export.
            </p>
          ) : null}

          {isExporting ? <p className="waiting-warning">Exporting...</p> : null}
        </div>

        <div className="export-footer">
          <button className="cancel" onClick={cancel}>
            Cancel
          </button>

          <button className="export" onClick={exportGradesToCanvas}>
            Export
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExportModal;
