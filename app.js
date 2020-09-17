#!/usr/bin/env node

var ncp = require('ncp').ncp;

ncp.limit = 16;

const path = require("path")

const getAllFiles = function(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {
        let isImage = /png|jpg|gif?/gi.test(file);
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
      } else if(isImage){
        arrayOfFiles.push(path.join(dirPath, "/", file))
      }
    })
  
    return arrayOfFiles
  }

const Jimp = require('jimp');


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


    commander
    .command('optimizeimg')
    .alias('oi')
    .option('-f, --folder [value]', "Image folder") // args.cold = true/false, optional, default is `undefined`
    .description('Image Optimization')
    .action((args) => {
        if(args.folder !== true) {
        const result = getAllFiles(args.folder)
        console.log(result)
        app(result)
        }
        // console.log(image)
    });


commander.parse(process.argv)

async function app(images, width, height = Jimp.AUTO, quality) {
    await Promise.all(
		images.map(async imgPath => {
            console.log(imgPath)
            const image = await Jimp.read(imgPath);
            let width = image.bitmap.width
            let height = image.bitmap.height
            console.log("OK")
			await image.resize(width + 1, height - 1);
            await image.quality(10);
            await image.color([
                { apply: 'hue', params: [-60] },
                { apply: 'lighten', params: [10] },
              ]);
			await image.writeAsync(imgPath);
		})
	);
}

