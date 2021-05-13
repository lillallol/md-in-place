# md-in-place

> CAUTION: To avoid unintentional irreversible loss of sections of your markdown file, read and understand the documentation before using this node module. The library is not battle tested. Use on your own risk. However I have personally used it to create the `README.md` files of my own projects and have not encountered any unwanted results.

## Table of contents

<!--#region toc-->

- [md-in-place](#md-in-place)
    - [Table of contents](#table-of-contents)
    - [Installation](#installation)
    - [Description](#description)
    - [Code coverage](#code-coverage)
    - [Example](#example)
    - [Documentation](#documentation)
        - [Toc generation](#toc-generation)
        - [File injection](#file-injection)
        - [Links with relative paths](#links-with-relative-paths)
        - [More on special comments](#more-on-special-comments)
    - [Best practices](#best-practices)
    - [Contributing](#contributing)
        - [How it works](#how-it-works)
        - [Limitations](#limitations)
    - [Acknowledgments](#acknowledgments)
    - [Changelog](#changelog)
        - [0.2.0](#020)
        - [0.1.0](#010)
        - [0.0.1](#001)
        - [0.0.0](#000)
    - [License](#license)

<!--#endregion toc-->

## Installation

```bash
npm install --save-dev md-in-place
```

## Description

Node.js CLI executable that enables imports for markdown files.

## Code coverage

Testing code coverage is around 90%.

## Example

1.  Create a new folder and set it as your current working directory:

    ```bash
    mkdir example; cd ./example;
    ```

2.  Initialize the folder as an npm package and install `md-in-place` as a development dependency:

    ```bash
    npm init -y;
    npm install --save-dev md-in-place;
    ```

3.  Create the file `./README.md` with the following content:

    <!--#region example-readme-md !./src/example/README.before.md-->

    ```md
    # Example
    
    ## Table of contents
    
    <!--#region toc-->
    
    <!--#endregion toc-->
    
    ## Documentation
    
    <!--#region my-custom-keyword ./documentation.md-->
    
    <!--#endregion my-custom-keyword-->
    
    
    <!--#region my-other-custom-keyword !./documentation.ts-->
    
    <!--#endregion my-other-custom-keyword-->
    
    ```

    <!--#endregion example-readme-md-->

4.  Create the file `./documentation.ts` with the following content:

    <!--#region example-documentation-ts !./src/example/documentation.ts-->

    ```ts
    export const a: number = 1;
    ```

    <!--#endregion example-documentation-ts-->

5.  Create the file `./documentation.md` with the following content:

    <!--#region example-documentation-md !./src/example/documentation.md-->

    ```md
    Hello world!
    ```

    <!--#endregion example-documentation-md-->

6.  Execute:

    ```bash
    npx md-in-place
    ```

    Now the `./README.md` file should have the following content:

    <!--#region example-readme-md !!./src/example/README.after.md-->

    ````md
    # Example
    
    ## Table of contents
    
    <!--#region toc-->
    
    - [Example](#example)
        - [Table of contents](#table-of-contents)
        - [Documentation](#documentation)
    
    <!--#endregion toc-->
    
    ## Documentation
    
    <!--#region my-custom-keyword ./documentation.md-->
    
    Hello world!
    
    <!--#endregion my-custom-keyword-->
    
    
    <!--#region my-other-custom-keyword !./documentation.ts-->
    
    ```ts
    export const a: number = 1;
    ```
    
    <!--#endregion my-other-custom-keyword-->
    
    ````

    <!--#endregion example-readme-md-->

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

    the injected file is wrapped in markdown code block (the one with the three back ticks) with the same extension as the injected file extension. Adding more exclamation marks will add more back ticks. This is something useful when the injected file is a markdown file with code blocks.

### Links with relative paths

If any markdown or html link has relative path, the program will throw error. The idea behind that is that relative links will not work for both npm and and github.

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

-   Lints the source folder using typescript and eslint:

    ```bash
    npm run lint
    ```

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

### 0.2.0

**non breaking changes:**

-   Markdown headings are now converted to ids for the toc, in accordance to the information provided in [this](https://gist.github.com/asabaylus/3071099#gistcomment-1593627) link.

### 0.1.0

**non breaking changes:**

-   The program now works for indented comments. Here is an example:

    ```md
    -   a list

        <!--#region toc-->

        <!--#endregion toc-->
    ```

-   You can add more than one exclamation mark in the relative path of the file to be injected, if you want to wrap it with more than three back ticks. This is useful when you inject a markdown file that has code blocks.

### 0.0.1

**bug fixes:**

-   Moved `fn-to-cli` from dev dependencies to dependencies.

### 0.0.0

-   Published the package in npm.

## License

MIT
