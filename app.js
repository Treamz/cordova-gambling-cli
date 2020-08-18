#!/usr/bin/env node

var ncp = require('ncp').ncp;

ncp.limit = 16;

const commander = require('commander'),
    {
        prompt
    } = require('inquirer'),
    chalk = require('chalk'),
    fs = require('fs'),
    execa = require('execa'),
    {
        execSync
    } = require('child_process')

commander.version('1.0.0').description('Configuration files creator.')

commander
    .command('init')
    .alias('i')
    .description('Show all configuration files.')
    .action(() => {
        const exec = require("child_process").exec
        exec("cordova create app", (error, stdout, stderr) => {
            console.log(stdout)
            prompt([{
                    type: 'input',
                    name: 'fbAppId',
                    message: 'Facebook APP ID: '
                },
                {
                    type: 'input',
                    name: 'fbAppName',
                    message: 'Facebook APP Name: '
                },
                {
                    type: 'input',
                    name: 'packageName',
                    message: 'Package Name: '
                },
                {
                    type: 'input',
                    name: 'activityName',
                    message: 'Activity Name: '
                },
                {
                    type: 'input',
                    name: 'appName',
                    message: 'App Name: '
                },
                {
                    type: 'input',
                    name: 'appDescription',
                    message: 'App Description: '
                },
                {
                    type: 'input',
                    name: 'appAuthor',
                    message: 'App Author: '
                },
                {
                    type: 'input',
                    name: 'appAuthorEmail',
                    message: 'App Author Email: '
                }
            ]).then(options => {
                console.log(options)
                var patchedpackage = fs.readFileSync("/usr/local/lib/node_modules/gambling/patchedpackage.json", 'utf8');
                patchedpackage = patchedpackage.replace('FBAPPIDREPLACE', options.fbAppId);
                patchedpackage = patchedpackage.replace('FBAPPNAMEREPLACE', options.fbAppName);
                fs.writeFileSync("app/package.json", patchedpackage);
                var patchedconfig = fs.readFileSync("/usr/local/lib/node_modules/gambling/patchedconfig.xml", 'utf8');
                patchedconfig = patchedconfig.replace('com.package.app', options.packageName);
                patchedconfig = patchedconfig.replace('StartActivity', options.activityName);
                patchedconfig = patchedconfig.replace('DESCRIPTIONREPLACE', options.appDescription);
                patchedconfig = patchedconfig.replace('NAMEREPLACE', options.appName);
                patchedconfig = patchedconfig.replace('APPAUTHORREPLACE', options.appName);
                patchedconfig = patchedconfig.replace('APPAUTHORREEMAILPLACE', options.appName);
                fs.writeFileSync("app/config.xml", patchedconfig);
                const source = '/usr/local/lib/node_modules/gambling/www',
                    destination = 'app/www'
                ncp(source, destination, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    //console.log('done!');
                });
                console.log("DONE")
            })
        })
    })

commander.parse(process.argv)