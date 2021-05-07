#!/usr/bin/env node

// @ts-check

const {mdInPlace} = require("./../dist/md-in-place/mdInPlace.js");

const {cli} = require("fn-to-cli");

/**
 * @type {import("fn-to-cli").parsedCommandForCli[]}
*/
const parsedCommands = [
    {
        description : "Injects in place the provided github flavoured markdown, with file imports\nand auto generated toc.",
        command : mdInPlace,
        options : 
            [
                {
                    "optionName": "input",
                    "flag": "i",
                    "defaultValue": "./README.md",
                    "description": "Path to the markdown file.",
                    "isOptional": true,
                    "type": "string"
                }
            ]
    }
];
const {argv} = process;
const cliVersion = "0.0.0";
const cliName = "md-in-place";
const strict = false;
cli({
    parsedCommands,
    argv,
    cliVersion,
    cliName,
    strict
});