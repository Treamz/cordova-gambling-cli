#!/usr/bin/env node
var ncp = require('ncp').ncp;
 
ncp.limit = 16;

const commander = require('commander'),
  { prompt } = require('inquirer'),
  chalk = require('chalk'),
  fs = require('fs'),
  execa = require('execa'),
  {execSync} = require('child_process')

  commander.version('1.0.0').description('Configuration files creator.')

commander
  .command('create <name>')
  .option('--extension <value>', 'File extension')
  .alias('c')
  .description('Create new configuration file.')
  .action((name, cmd) => {
    if (cmd.extension && !['json', 'txt', 'cfg'].includes(cmd.extension)) {
      console.log(chalk.red('\nExtension is not allowed.'))
    } else {
      prompt([
        {
          type: 'input',
          name: 'charset',
          message: 'Charset: '
        },
        { type: 'input', name: 'max_ram_usage', message: 'Max RAM usage, Mb: ' },
        { type: 'input', name: 'max_cpu_usage', message: 'Max CPU usage, %: ' },
        { type: 'input', name: 'check_updates_interval', message: 'Updates interval, ms: ' },
        { type: 'input', name: 'processes_count', message: 'Processes count: ' }
      ]).then(options => {
        if (cmd.extension && cmd.extension === 'json') {
          fs.writeFileSync(`files/${name}.${cmd.extension}`, JSON.stringify(options))
        } else {
          let data = ''
          for (let item in options) data += `${item}=${options[item]} \n`

          fs.writeFileSync(`files/${name}.cfg`, data)
        }
        console.log(chalk.green(`\nFile "${name}.${cmd.extension || 'cfg'}" created.`))
      })
    }
  })

commander
  .command('all')
  .alias('a')
  .description('Show all configuration files.')
  .action(() => {
    const files = fs.readdirSync('files')

    let data = ''
    for (let file of files) data += `${file} \n`

    console.log(chalk.grey(`\nConfiguration files: \n\n${data}`))
  })


  commander
  .command('gambling')
  .alias('g')
  .description('Show all configuration files.')
  .action(() => {
    const exec = require("child_process").exec
exec("cordova create app", (error, stdout, stderr) => {
        console.log(stdout)
        prompt([
            {
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
              var patchedpackage = fs.readFileSync("patchedpackage.json", 'utf8');
              patchedpackage = patchedpackage.replace('FBAPPIDREPLACE', options.fbAppId);
              patchedpackage = patchedpackage.replace('FBAPPNAMEREPLACE', options.fbAppName);
              fs.writeFileSync("app/package.json", patchedpackage); 
              var patchedconfig = fs.readFileSync("patchedconfig.xml", 'utf8');
              patchedconfig = patchedconfig.replace('com.package.app', options.packageName);
              patchedconfig = patchedconfig.replace('StartActivity', options.activityName);
              patchedconfig = patchedconfig.replace('DESCRIPTIONREPLACE', options.appDescription);
              patchedconfig = patchedconfig.replace('NAMEREPLACE', options.appName);
              patchedconfig = patchedconfig.replace('APPAUTHORREPLACE', options.appName);
              patchedconfig = patchedconfig.replace('APPAUTHORREEMAILPLACE', options.appName);
              fs.writeFileSync("app/config.xml", patchedconfig); 
              const source = 'www',
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