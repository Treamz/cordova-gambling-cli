#!/usr/bin/env node
var randomWords = require('random-words');

var ncp = require('ncp').ncp;

const fse = require('fs-extra')

ncp.limit = 16;

const path = require("path")
const indexjspath = 'app/www/js/index.js'
function writeIndexjs(indexjs) {
    try {
        if (fs.existsSync(indexjspath)) {
            //file exists
            console.log("EXIST")
            fs.writeFile(indexjspath, indexjs, function(error){

                if(error) throw error; // если возникла ошибка
                console.log("Асинхронная запись файла завершена. Содержимое файла:");
                let data = fs.readFileSync(indexjspath, "utf8");
                console.log(data);  // выводим считанные данные
            });
        }
        else {
            console.log("NOT EXIST")
            setTimeout(writeIndexjs, 3000)
        }
      } catch(err) {
        console.error(err)
      }
}
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
            prompt([
                // {
                //     type: 'input',
                //     name: 'fbAppId',
                //     message: 'Facebook APP ID: '
                // },
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
                const source = '/usr/local/lib/node_modules/gambling/www',
                destination = 'app/www'
                fse.copy(source, destination,  (err) => {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log("success!");
                      var gamehtml = randomWords();
                      var checkhtml = randomWords();
                      var gamepath = `app/www/${gamehtml}.html`;
                      var checkpath = `app/www/${checkhtml}.html`;
                      var indexjs = fs.readFileSync("/usr/local/lib/node_modules/gambling/www/js/index.js", 'utf8');
                      indexjs = indexjs.replace('check.html', checkhtml + '.html');
                      indexjs = indexjs.replace('game.html', gamehtml + '.html');
                      writeIndexjs(indexjs)
                      fs.rename('app/www/game.html', gamepath, function(err) {
                        if ( err ) console.log('ERROR: ' + err);
                      });
                      fs.rename('app/www/check.html', checkpath, function(err) {
                        if ( err ) console.log('ERROR: ' + err);
                      });
                    }
                  });
                var patchedpackage = fs.readFileSync("/usr/local/lib/node_modules/gambling/patchedpackage.json", 'utf8');
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
                // console.log("DONE");
                
                
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
			// await image.resize(width + 1, height + 2);
            await image.quality(10);
            await image.color([
                { apply: 'hue', params: [15] },
                { apply: 'lighten', params: [0] },
              ]);
			await image.writeAsync(imgPath);
		})
	);
}




