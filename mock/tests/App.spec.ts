import { test, expect } from "@playwright/test";

/**
 * This is carried out before every test that is run. It is responsible for
 * loading the page. By doing this in the beforeEach, we reduce redundency.
 */
test.beforeEach(async ({ page }, testInfo) => {
  await page.goto("http://localhost:8000/");
});

/**
 * This tests that the command input bar is visible on the page.
 */
test("input bar appears", async ({ page }) => {
  await expect(page.getByLabel("Command input")).toBeVisible();
});

/**
 * This tests that the history box is visible on the page.
 */
test("history box appears", async ({ page }) => {
  await expect(page.getByLabel("Past commands")).toBeVisible();
});

/**
 * This tests that the submit is visible on the page.
 */
test("submit button appears", async ({ page }) => {
  await expect(page.getByRole("button")).toBeVisible();
});

/**
 * This tests that the text in the command input bar changes after typing in
 * a some input.
 */
test("command input text changes", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");

  const mock_input = `Awesome command`;
  await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
});

/**
 * This tests that the page has the title, "Mock".
 */
test("has title", async ({ page }) => {
  await expect(page).toHaveTitle(/Mock/);
});

/**
 * This tests that the "load_file" command successfully loads a file without
 * headers when no optional third field is provided. Tests brief mode.
 */
test("load file with no header specification", async ({ page }) => {
  await page.goto("http://localhost:8000/");

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file6");
  await page.getByRole("button").click();
  const mock_output = await page.$eval(
    "#root > div > div > div.repl-history > p > table > tr > td",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output).toBe(
    "File without headers successfully loaded: file6"
  );
});

/**
 * This tests that the load_file command successfully loads a file without
 * headers when "false" is specified as the third field. Tests brief mode.
 */
test("load file with no headers", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file2 false");
  await page.getByRole("button").click();
  const mock_output = await page.$eval(
    "#root > div > div > div.repl-history > p > table > tr > td",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output).toBe(
    "File without headers successfully loaded: file2"
  );
});

/**
 * This tests that the load_file command successfully loads a file with
 * headers when "true" is specified as the third field. Tests brief mode.
 */
test("load file with headers", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file3 true");
  await page.getByRole("button").click();
  const mock_output = await page.$eval(
    "#root > div > div > div.repl-history > p > table > tr > td",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output).toBe(
    "File with headers successfully loaded: file3"
  );
});

/**
 * This tests that the view command returns a table containing elements from
 * the file that was loaded in with headers. We test this by checking that a
 * specific element from the data is in the history box. Tests brief mode.
 */
test("view file with headers", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file4 true");
  await page.getByRole("button").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button").click();
  const mock_output = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(2) > div > table > tbody > tr:nth-child(2) > td",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output).toBe("orange");
});

/**
 * This tests that the view command returns a table containing elements from
 * the file that was loaded in without headers. We test this by checking that
 * a specific element from the data is in the history box. Tests brief mode.
 */
test("view file without headers", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file2");
  await page.getByRole("button").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button").click();

  const mock_output = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(2) > div > table > tbody > tr:nth-child(3) > td:nth-child(3)",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output).toBe("46");
});

/**
 * This tests that the view command correctly returns an informative
 * error message if no file is loaded in before calling view. Tests
 * brief mode.
 */
test("view file without loading first", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button").click();

  const mock_output = await page.$eval(
    "#root > div > div > div.repl-history > p > table > tr > td",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output).toBe(
    "Please load a valid CSV file before attempting to view it"
  );
});

/**
 * This tests that the search command returns the correct (built-in through
 * mocking) rows of the file that was loaded with headers. It checks that
 * the header column is also displayed when headers are indicated. Tests
 * brief mode.
 */
test("search file with column identifier", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1 true");
  await page.getByRole("button").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 1 apple");
  await page.getByRole("button").click();

  const mock_output = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(5)",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output).toBe("Favorite Fruit");
});

/**
 * This tests that the search command without a column identifier returns
 * the correct (built-in through mocking) rows of the file that was loaded
 * without headers. Tests brief mode.
 */
test("search file without column identifier works", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByRole("button").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search apple");
  await page.getByRole("button").click();

  const mock_output = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(2)",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output).toBe("Last Name");
});

/**
 * This tests that the search command without an invalid column identifier
 * returns an informative error message specified that the identifier is
 * not a header for the loaded in file. Tests brief mode.
 */
test("search file with invalid column identifier", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1 true");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search apple apple");
  await page.getByRole("button").click();

  const mock_output = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(2) > table > tr > td",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output).toBe("Provided column identifier not in header");
});

/**
 * This tests that the search command correctly returns an informative
 * error message if no file is loaded in before calling search. Tests
 * brief mode.
 */
test("search file without loading first", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 1 apple");
  await page.getByRole("button").click();

  const mock_output = await page.$eval(
    "#root > div > div > div.repl-history > p > table > tr > td",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output).toBe(
    "Please load a valid CSV file before attempting to search it"
  );
});

/**
 * Tests that the mode command correctly switches between brief and verbose.
 * Ensures that the new mode will apply the output of the mode command
 * itself. Tests brief and verbose modes.
 */
test("load change to verbose mode and back to brief", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button").click();

  const mock_output1 = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(1) > div > p:nth-child(1)",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output1).toContain("Command: ");
  await expect(mock_output1).toContain("mode");

  const mock_output2 = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(1) > div > p:nth-child(2)",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output2).toContain("Output: ");
  await expect(mock_output2).toContain("Mode changed: verbose");

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button").click();

  const mock_output3 = await page.$eval(
    "#root > div > div > div.repl-history > p > table > tr > td",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output3).toBe("Mode changed: brief");
});

/**
 * This tests that the load_file command successfully returns a verbose
 * success result when the mode is changed before loading in the file.
 * Tests verbose mode by ensuring the command and output both display.
 */
test("load file with verbose mode", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  const command = "load_file file5";
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button").click();

  const mock_output = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(2) > div > p:nth-child(2)",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output).toContain(
    "File without headers successfully loaded: file5"
  );
  await expect(mock_output).toContain("Output: ");
});

/**
 * This tests that the view command successfully returns a verbose result
 * when the mode is changed after loading in the file. Tests verbose mode
 * by ensuring the command and output both display.
 */
test("view file with headers and mode changing", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1 true");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  const command = "view";
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button").click();

  const mock_output1 = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(3) > div > p:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(1)",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output1).toContain("First Name");

  const mock_output2 = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(3) > div > p:nth-child(1)",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output2).toBe("Command: " + command);

  const mock_output3 = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(3) > div > p:nth-child(2)",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output3).toContain("Output: ");
});

/**
 * This tests that the search command successfully returns a verbose result
 * when the mode is changed after loading in the file. Tests verbose mode
 * by ensuring the command and output both display.
 */
test("search file with column identifier works with mode changing", async ({
  page,
}) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  const command = "search 1 apple";
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button").click();

  const mock_output1 = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(3) > div > p:nth-child(2) > div > table > tbody > tr > td:nth-child(5)",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output1).toBe("Favorite Fruit");

  const mock_output2 = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(3) > div > p:nth-child(1)",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output2).toBe("Command: " + command);
});

/**
 * This tests that the same search command returns different results
 * when one a new file is loaded in after loading and searching the
 * first file. The second file loaded in only has one row, so the
 * indicated column identifier of index 2 is out of bounds in the
 * second loaded file. Uses a different method of obtaining outputted
 * information to diversify testing methods.
 */
test("search 2 different files with different shapes", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  const command = "search 2 apple";
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button").click();

  const mock_output1 = "Favorite Fruit";
  await expect(page.getByLabel("Past commands")).toContainText(mock_output1);

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file4");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button").click();

  const mock_output2 = "Provided column indentifier out of bounds";
  await expect(page.getByLabel("Past commands")).toContainText(mock_output2);
});

/**
 * Tests this sequence of interactions: successfully loads in a file without
 * headers, views that file, changes the mode to verbose, successfully loads in
 * a file with headers, then searches that file with a provided column identifier.
 */
test("load, view, search, mode interaction", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file2");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Past commands")).toContainText(
    "File without headers successfully loaded: file2"
  );

  await page.getByLabel("Command input").click();
  const command = "view";
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button").click();

  await expect(page.getByLabel("Past commands")).toContainText("Nurse");

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Past commands")).toContainText("Command: mode");
  await expect(page.getByLabel("Past commands")).toContainText("Output:");
  await expect(page.getByLabel("Past commands")).toContainText(
    "Mode changed: verbose"
  );

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1 true");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Past commands")).toContainText(
    "Command: load_file file1 true"
  );
  await expect(page.getByLabel("Past commands")).toContainText("Output:");
  await expect(page.getByLabel("Past commands")).toContainText(
    "File with headers successfully loaded: file1"
  );

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 1 apple");
  await page.getByRole("button").click();

  await expect(page.getByLabel("Past commands")).toContainText(
    "Command: search 1 apple"
  );
  await expect(page.getByLabel("Past commands")).toContainText("Output:");
  await expect(page.getByLabel("Past commands")).toContainText("State");
  await expect(page.getByLabel("Past commands")).toContainText("California");
});

/**
 * Tests that the search command correctly returns an informative error when
 * a column name identifier is provided but the file is not indivated to have
 * headers.
 */
test("search with column name identifier after specifying no header", async ({
  page,
}) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  const command = "search State apple";
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button").click();

  const mock_output =
    "CSV file has no header but column name identifier was provided";
  await expect(page.getByLabel("Past commands")).toContainText(mock_output);
});

/**
 * Tests that if the command input does not begin with 'mode', 'load_file',
 * 'view', or 'search' or exceeds 3 fields, it  will correctly return a
 * general error message that indicates what inputs are valid.
 */
test("invalid command", async ({ page }) => {
  const command = "this is not valid";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button").click();

  const mock_output =
    "Please submit a valid command: load_file <file path>, mode, view, \
        or search <column [optional]> <value>. Command submitted: " + command;
  await expect(page.getByLabel("Past commands")).toContainText(mock_output);
});

/**
 * Tests that if the command input begins with 'load_file', but its optional
 * third field is niether 'true' nor 'false, it will correctly return an error
 * message specific to load that indicates what inputs are valid for the load
 * command.
 */
test("invalid load command", async ({ page }) => {
  const command = "load_file file1 invalid";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button").click();

  const mock_output =
    "Please enter command in the format load_file <file path> \
          or load_file <file path> <has headers? (true/false)>";
  await expect(page.getByLabel("Past commands")).toContainText(mock_output);
});

/**
 * Tests that if the command input begins with 'load_file', but its filePath
 * field is not valid (does not map to one of the datasets we have in our hashmap),
 * it will correctly return an informative error message prompting it to change
 * the file path.
 */
test("invalid file path", async ({ page }) => {
  const command = "load_file invalid";
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill(command);
  await page.getByRole("button").click();

  const mock_output = "Please enter a valid file path";
  await expect(page.getByLabel("Past commands")).toContainText(mock_output);
});

/**
 * Tests that if the command input begins with 'view', but includes other fields
 * that should not be called with the view command, it will correctly return an
 * error message specific to view that indicates how it should be called.
 */
test("invalid view command", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file4");
  await page.getByRole("button").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view invalid");
  await page.getByRole("button").click();

  const mock_output = "Please enter command in the format view";
  await expect(page.getByLabel("Past commands")).toContainText(mock_output);
});

/**
 * Tests that the view command will correctly return a message indicating
 * the file is empty if an empty file is loaded in before calling view.
 */
test("view empty file", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file3");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button").click();

  const mock_output = "This file is empty";
  await expect(page.getByLabel("Past commands")).toContainText(mock_output);
});

/**
 * Tests that the search command will correctly return a message indicating
 * the file is empty if an empty file is loaded in before calling search.
 */
test("search empty file", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file3");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search apple");
  await page.getByRole("button").click();

  const mock_output = "This file is empty";
  await expect(page.getByLabel("Past commands")).toContainText(mock_output);
});

/**
 * Tests that if the command input begins with 'search', but it doesn't include
 * the necessary target value field, it will correctly return an error message
 * specific to search that indicates what inputs are valid for the search command.
 */
test("invalid search command", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search");
  await page.getByRole("button").click();

  const mock_output =
    "Please enter command in the format search <column identifier> <value> or search <value>";
  await expect(page.getByLabel("Past commands")).toContainText(mock_output);
});

/**
 * Tests that the search command will correctly return an informative message
 * indicating the search didn't return any results if the target value is not
 * found in the file that is loaded in before calling search.
 */
test("search with no results", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file6 true");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search one nine");
  await page.getByRole("button").click();

  const mock_output = "No results";
  await expect(page.getByLabel("Past commands")).toContainText(mock_output);
});

/**
 * Tests that an irregularly shaped file (containing rows of different 
 * lengths) won't cause errors and that the view command still works and
 * is formatted clearly. 
 */

test("view with irregular file", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file7");
  await page.getByRole("button").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button").click();

  const mock_output = await page.$eval(
    "#root > div > div > div.repl-history > p:nth-child(2) > div > table > tbody > tr:nth-child(2)",
    (el) => (el as HTMLTableCellElement).textContent
  );
  await expect(mock_output).toContain("goodbye");
});
