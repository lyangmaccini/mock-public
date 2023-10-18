import "../styles/App.css";
import REPL from "./REPL";

/**
 * This is the highest level component! Here, we set up the opening text and inner
 * components of the program.
 */
function App() {
  return (
    <div className="App">
      <p className="App-header">
        <h1>Hello!</h1>
        Please load a file with the command
          load_file [filepath] [optional: does the file have a header? (default
          false)]. Then, view its contents with the view command, search
        for a given value with the search [value], search for a
        given value in a specific column with the search [column identifier: name or index] [value]
        command, or change from modes from brief to verbose (and vice versa)
        with the mode command. Verbose mode will display your
        command and the output each time the submit button is clicked, while
        brief mode will just display the output.
      </p>
      <REPL />
    </div>
  );
}

export default App;
