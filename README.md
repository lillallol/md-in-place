# md-in-place

> CAUTION: To avoid unintentional irreversible loss of sections of your markdown file, read and understand the documentation before using this node module. Even then you might lose sections of your markdown file since this program is not battle tested and bugs can occur. However I personally trust it and use it in my own projects and have not encountered any unwanted results. Use on your own risk.

## Table of contents

<!--#region toc-->

- [md-in-place](#md-in-place)
    - [Table of contents](#table-of-contents)
    - [Installation](#installation)
    - [Description](#description)
    - [Example](#example)
    - [Documentation](#documentation)
        - [Toc generation](#toc-generation)
        - [File injection](#file-injection)
        - [Links with relative paths](#links-with-relative-paths)
        - [More on special comments](#more-on-special-comments)
    - [Best practices](#best-practices)
    - [Motivation](#motivation)
    - [Contributing](#contributing)
        - [How it works](#how-it-works)
        - [Limitations](#limitations)
    - [Acknowledgments](#acknowledgments)
    - [Changelog](#changelog)
    - [License](#license)

<!--#endregion toc-->

## Installation

```bash
npm install --save-dev md-in-place
```

## Description

Node.js CLI executable that injects in place the provided github flavoured markdown, with file imports and auto generated toc. The injection regions and imported files are specified via special html comments inside the markdown file. Useful for creating `README.md` files that work for both github and npmjs. Testing code coverage is around 90%.

## Example

The input file in path `./input.md`:

```md
## Table of contents

<!--#region toc-->

<!--#endregion toc-->

## Documentation

<!--#region keyword ./relative/path/to/documentation.md-->

<!--#endregion keyword-->

<!--#region keyword !./relative/path/to/documentation.ts-->

<!--#endregion keyword-->
```

gets mutated in place after executing:

```bash
npx md-in-place -i ./input.md
```

to:

````md
## Table of contents

<!--#region toc-->

-   [Table of contents](#table-of-contents)
-   [Documentation](#documentation)

<!--#endregion toc-->

## Documentation

<!--#region keyword ./relative/path/to/documentation.md-->

Hello world!

<!--#endregion keyword-->

<!--#region another-keyword !./relative/path/to/documentation.ts-->

```ts
const a: number = 1;
```

<!--#endregion another-keyword-->
````

Where the file in path `./relative/path/to/documentation.md` contains the following:

```md
Hello world!
```

and the file in path `./relative/path/to/documentation.ts` contains the following:

```ts
const a: number = 1;
```

## Documentation

Use:

```bash
npx md-in-place --help
```

to get information on how to use the CLI.

### Toc generation

-   The place to inject the auto generated toc is specified via special HTML comments:

    > CAUTION: Everything between these two comments gets irreversibly deleted on toc injection.

    ```md
    <!--#region toc-->

    <!--#endregion toc-->
    ```

-   Both markdown and HTML headings are taken into account when creating the toc.

-   Headings inside markdown or HTML code blocks are ignored.

-   Headings from imported files are also taken into account.

### File injection

-   The place to inject an imported file is specified via special HTML comments:

    > CAUTION: Everything between these two comments gets irreversibly deleted on file injection.

    ```md
    <!--#region keyword ./relative/path/to/file-->

    <!--#endregion keyword-->
    ```

-   The `keyword` can be any word you choose as long as the starting and ending comment have the same keyword.
-   For relative path that starts with exclamation mark:

    ```md
    <!--#region keyword !./relative/path/to/file-->

    <!--#endregion keyword-->
    ```

    the injected file is wrapped in markdown code block with the same extension as the injected file extension.

### Links with relative paths

If any markdown or html link has relative path, the program will throw error.

### More on special comments

-   The special comments are not deleted after injection. This enables re-injection after you have updated something.

-   Special comments can not wrap other special comments.

-   Special comments inside html and markdown code blocks are ignored.

-   If there is something wrong with the special comments (keywords not matching, missing starting or ending comment, etc.), the program throws error without injecting.

## Best practices

-   The special comments can be collapsed in vscode. Keep them always collapsed to avoid editing their content.

-   Add two empty lines before and after each special comment.

    <!-- prettier-ignore -->
    ```md
    Good

    <!--#region toc-->

    <!--#endregion toc-->

    ```

    ```md
    Bad

    <!--#region toc-->
    <!--#endregion toc-->
    ```

-   Try to use the program only at the distribution stage. Avoid using it in the development stage.

-   After you have edited the markdown file, make sure you have saved it before using the program.

## Motivation

I was looking for a node module that manipulates markdown files by doing the following:

-   inject files into markdown in place without having to write an extra file that defines how the injections happen
-   automatic toc generation that gets injected in place for github flavoured markdown, that takes into account html and markdown headings even if they are from injected files
-   preserve injection regions in markdown after injections take place, so that I can re inject after I update something
-   delete everything that is inside injection regions, before injecting
-   throw error if there are relative links in the markdown file

Since I could not find such a module in npmjs, I decided to create my own.

## Contributing

I am open to suggestions/pull request to improve this program.

You will find the following commands useful:

-   Clones the github repository of this project:

    ```bash
    git clone https://github.com/lillallol/md-in-place
    ```

-   Installs the node modules (nothing will work without them):

    ```bash
    npm install
    ```

-   Tests the code and generates code coverage:

    ```bash
    npm run test
    ```

    The generated code coverage is saved in `./coverage`.

-   Builds the typescript code from the `./src` folder to javascript code in `./dist`:

    ```bash
    npm run build-ts
    ```

-   Creates the CLI executable of this program in `./bin/bin.js`:

    ```bash
    npm run build-bin
    ```

    Make sure that the `./dist` exists when you execute this command, otherwise it will not work.

-   Injects in place the generated toc and imported files to `README.md`:

    ```bash
    npm run build-md
    ```

    Make sure that `./bin/bin.js` exists when you execute this command, otherwise it will not work.

-   Checks the project for spelling mistakes:

    ```bash
    npm run spell-check
    ```

    Take a look at the related configuration `./cspell.json`.

-   Checks `./src` for dead typescript files:

    ```bash
    npm run dead-files
    ```

    Take a look at the related configuration `./unimportedrc.json`.

### How it works

The markdown file is parsed to abstract syntax tree (ast) using [remark](https://www.npmjs.com/package/remark). The ast consists of markdown and html fragments that include information such as:

-   source code
-   line relative to the markdown file
-   offset start relative to the markdown file
-   offset end relative to the markdown file

The markdown fragments are converted to html and together with the rest of the html fragments are searched using [jsdom](https://www.npmjs.com/package/jsdom), for anchor tags, comments and headings.

### Limitations

-   Validation for:

    -   path of file to be imported
    -   id of heading to be used in the generated toc
    -   title of heading to be used in the generated toc

    is too strict. Open an issue so I can improve it.

-   Empty lines define the beginning and end of html fragments. That can potentially lead to unexpected results. For example this markdown fragment:

    ```md
    <details>
    <summary>Some summary</summary>
    </details>
    ```

    is parsed as a single html fragment, while this:

    ```md
    <details>
    <summary>Some summary</summary>

    </details>
    ```

    is parsed as two html fragments because of the line that separates them.

## Acknowledgments

This program would not be possible without [remark](https://www.npmjs.com/package/remark) and [jsdom](https://www.npmjs.com/package/jsdom).

## Changelog

**0.0.0**

-   Published the package in npm.

## License

MIT
