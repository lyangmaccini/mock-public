/**
 * A file for our mocked data containing a variety of sizes, shapes, and
 * types of mocked JSON files. 
 */
const mockedJSONHeaders = [
  ["First Name", "Last Name", "State", "Phone Number", "Favorite Fruit"],
  ["Miley", "Cyrus", "California", "123", "apple"],
  ["Bob", "Nelson", "Rhode Island", "401401401", "pear"],
  ["Tim", "Nelson", "Pennsylvania", "456", "apple"],
];

const mockedJSONNoHeaders = [
  ["Female", "Professor", "33"],
  ["Male", "Nurse", "27"],
  ["Female", "Lawyer", "46"],
];

const mockedJSONEmpty = [[]];

const mockedJSONOneColumn = [
  ["red"],
  ["orange"],
  ["yellow"],
  ["green"],
  ["blue"],
  ["purple"],
];

const mockedJSONOneRow = [["one", "two", "three", "four", "five"]];
const mockedJSONOneItem = [["hello"]];

const mockedJSONIrregularShape = [["hello"], ["hello", "goodbye"]];

export const mocked_files: any = new Map([
  ["file1", mockedJSONHeaders],
  ["file2", mockedJSONNoHeaders],
  ["file3", mockedJSONEmpty],
  ["file4", mockedJSONOneColumn],
  ["file5", mockedJSONOneItem],
  ["file6", mockedJSONOneRow],
  ["file7", mockedJSONIrregularShape],
]);
