import "../styles/main.css";
import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { csvProcessor } from "../datasource/csvProcessor";

/**
 * Here, we handle the actual creation of React components, which are 
 * added to a history array and displayed in REPLHistory. 
 */

interface REPLInputProps {
  history: ReactElement[];
  loadedFile: string[][];
  filepath: string;
  isLoaded: boolean;
  hasHeader: boolean;
  mode: string;
  setHistory: Dispatch<SetStateAction<ReactElement[]>>;
  setMode: Dispatch<SetStateAction<string>>;
  setFilepath: Dispatch<SetStateAction<string>>;
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
  setLoadedFile: Dispatch<SetStateAction<string[][]>>;
  setHasHeader: Dispatch<SetStateAction<boolean>>;
}

/**
 * This is where we do the majority of our handling of inputted commands. REPLInput
 * takes in a series of properties: history, the current loaded file, the filepath,
 * whether a file is laoded, if the file has a header, and the mode. From there, it
 * handles inputs in the form of command strings the user submits with a button,
 * displaying the result of the command through a list of React elements in history.
 * @param props
 * @returns
 */

export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");

  function handleSubmit(commandString: string) {
    var result;
    var splitString = commandString.split(" ");
    var myMode = props.mode;
    var loadedFile;
    var tableView = false;
    var resultTable = (
      <table>
        <tr>
          <td> </td>
        </tr>
      </table>
    );
    if (splitString[0] == "load_file" && splitString.length < 4) {
      var filepath = splitString[1];
      const datasource = new csvProcessor(filepath, props.hasHeader);
      loadedFile = datasource.parseFile();

      props.setFilepath(filepath);
      props.setLoadedFile(loadedFile);
      props.setIsLoaded(true);
      props.setHasHeader(false);

      result = [["File without headers successfully loaded: " + filepath]];
      if (!datasource.getExistence()) {
        result = [["Please enter a valid file path"]];
      } else if (splitString.length == 3) {
        if (splitString[2] == "true") {
          props.setHasHeader(true);
          result = [["File with headers successfully loaded: " + filepath]];
        } else if (splitString[2] != "false") {
          result = [
            [
              "Please enter command in the format load_file <file path> \
          or load_file <file path> <has headers? (true/false)>",
            ],
          ];
        }
      }
    } else if (splitString[0] == "mode" && splitString.length == 1) {
      var newMode = "brief";
      if (props.mode == "brief") {
        newMode = "verbose";
      }
      result = [["Mode changed: " + newMode]];
      myMode = newMode;
      props.setMode(newMode);
    } else if (splitString[0] == "view") {
      if (splitString.length > 1) {
        result = [["Please enter command in the format view"]];
      } else if (props.loadedFile[0].length == 0 && props.isLoaded) {
        result = [["This file is empty"]];
      } else {
        if (props.isLoaded) {
          result = props.loadedFile;
          tableView = true;
        } else {
          result = [
            ["Please load a valid CSV file before attempting to view it"],
          ];
        }
      }
    } else if (splitString[0] == "search") {
      if (props.loadedFile[0].length == 0 && props.isLoaded) {
        result = [["This file is empty"]];
      } else {
        const datasource = new csvProcessor(props.filepath, props.hasHeader);
        if (!props.isLoaded) {
          result = [
            ["Please load a valid CSV file before attempting to search it"],
          ];
        } else {
          if (splitString.length == 3) {
            var column = splitString[1];
            var value = splitString[2];
            result = datasource.search(column, value);
            tableView = datasource.getTableView();
          } else if (splitString.length == 2) {
            var value = splitString[1];
            result = datasource.searchTargetOnly(value);
            tableView = datasource.getTableView();
          } else {
            result = [
              [
                "Please enter command in the format search <column identifier> <value> or search <value>",
              ],
            ];
          }
        }
      }
    } else {
      result = [
        [
          "Please submit a valid command: load_file <file path>, mode, view, \
        or search <column [optional]> <value>. Command submitted: " +
            commandString,
        ],
      ];
    }
    var output;
    if (tableView == false) {
      resultTable = (
        <table>
          <tr>
            <td>{result[0][0]}</td>
          </tr>
        </table>
      );
    } else {
      var innerHTML = parseIntoTable(result);
      resultTable = <div dangerouslySetInnerHTML={{ __html: innerHTML }} />;
    }
    if (myMode == "brief") {
      output = resultTable;
    } else {
      output = (
        <div>
          <p>
            Command: <br></br>{commandString}</p>
          <p>Output: {resultTable}</p>
        </div>
      );
    }
    props.setHistory([...props.history, output]);
    setCommandString("");
  }
  return (
    <div className="repl-input">
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button onClick={() => handleSubmit(commandString)}>Submit</button>
    </div>
  );
}

/**
 * A function to return a string representing the HTML formatting of a 2D
 * array of strings given by the file parameter into a table.
 * @param file
 * @returns
 */

function parseIntoTable(file: string[][]) {
  var innerHTML = "<table border=1>";
  for (var i = 0; i < file.length; i++) {
    innerHTML += "<tr>";
    for (var j = 0; j < file[i].length; j++) {
      innerHTML += "<td>" + file[i][j] + "</td>";
    }
    innerHTML += "</tr>";
  }
  innerHTML += "</table>";

  return innerHTML;
}
