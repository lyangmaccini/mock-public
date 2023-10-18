import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { isPropertySignature } from "typescript";
import { csvProcessor } from "../datasource/csvProcessor";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";

/* 
Here, we set up the higher level REPL component with the necessary variables
for the REPLInput and REPLHistory components.
*/

export default function REPL() {
  const [mode, setMode] = useState<string>("brief");
  const [loadedFile, setLoadedFile] = useState<string[][]>([[]]);
  const [history, setHistory] = useState<ReactElement[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasHeader, setHasHeader] = useState<boolean>(false);
  const [filepath, setFilepath] = useState<string>("");

  return (
    <div className="repl">
      <REPLHistory history={history} />
      <hr></hr>
      <REPLInput
        history={history}
        setHistory={setHistory}
        mode={mode}
        filepath={filepath}
        loadedFile={loadedFile}
        setMode={setMode}
        setFilepath={setFilepath}
        setLoadedFile={setLoadedFile}
        isLoaded={isLoaded}
        setIsLoaded={setIsLoaded}
        hasHeader={hasHeader}
        setHasHeader={setHasHeader}
      />
    </div>
  );
}
