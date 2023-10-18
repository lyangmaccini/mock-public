import { mocked_files } from "./mockedJSON";

/**
 * This class mocks the behavior of a CSV Parser and Searcher by
 * returning lists of rows, which are themselves lists of strings. 
 * This class creates a layer between REPLInput and our mocked files,
 * so we never have to reference mocked files in the actual logic and 
 * implementation of our program.
 */
export class csvProcessor {
  file: string[][];
  hasHeader: boolean;
  exists: boolean;
  tableView: boolean;

  /**
   * Gets the file associated with the given filepath, if possible. 
   * @param filepath 
   * @param hasHeader 
   */

  constructor(filepath: string, hasHeader: boolean) {
    this.tableView = false;
    this.hasHeader = hasHeader;
    if (mocked_files.has(filepath)) {
      this.exists = true;
      this.file = mocked_files.get(filepath);
    } else {
      this.exists = false;
      this.file = [[]];
    }
  }
  /**
   * Returns a 2D string array representing a parsed CSV file.
   * @returns
   */
  parseFile() {
    return this.file;
  }
  search(column: string, value: string) {
    var header = this.file[0];
    var intCol = parseInt(column);
    if (isNaN(intCol)) {
      if (!this.hasHeader) {
        return [
          ["CSV file has no header but column name identifier was provided"],
        ];
      }
      if (!header.includes(column)) {
        return [["Provided column identifier not in header"]];
      }
    } else {
      if (intCol >= this.file[0].length || intCol < 0) {
        return [["Provided column indentifier out of bounds"]];
      }
    }
    if (this.hasHeader) {
      if (this.file.length <= 1) {
        return [["No results"]];
      } else {
        this.tableView = true;
        return [this.file[0], this.file[1]];
      }
    }
    if (this.file.length < 1) {
      return [["No results"]];
    }
    this.tableView = true;
    return [this.file[0]]; // no header in file - return some line of data
  }

  /**
   * Returns a number of string arrays representing CSV search results.
   * @param value
   * @returns
   */

  searchTargetOnly(value: string) {
    if (this.file.length > 0) {
      if (this.hasHeader) {
        if (this.file.length > 1) {
          this.tableView = true;
          return [this.file[0], this.file[1]];
        }
        this.tableView = true;
        return [this.file[0]];
      }
      this.tableView = true;
      return [this.file[0]];
    }
    return [["No results"]];
  }

  /**
   * Returns a boolean representing whether a given filepath maps
   * to a mocked file.
   * @returns 
   */

  getExistence() {
    return this.exists;
  }

  /**
   * Returns a boolean representing whether a returned array should
   * be displayed in a table or as a single string. 
   * @returns 
   */

  getTableView() {
    return this.tableView;
  }
}
