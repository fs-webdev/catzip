const path = require('path');
const fs = require('fs');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const {EOL} = require('os');

const optionDefinitions = [
    {
        name: 'help', 
        description: 'Display this usage guide.',
        alias: 'h', 
        type: Boolean
    },
    {
        name: 'src', 
        description: 'Zip file(s) to operate on. This is the default argument. Any extra arguments will be assumed to be zip files. It works best if these files end with ".zip".',
        type: String, 
        multiple: true, 
        defaultOption: true,
        typeLabel: '{underline zip file} ...'
    },
    {
        name: 'save',
        description: 'Save output to file. This is especially useful when specifying multiple zip files. Without this option, all of the content is printed together. With this option, the output of each zip file is saved to a different text file. Each text file is named the same as the input file, except that ".zip" is replaced with ".txt".',
        alias: 's', 
        type: Boolean
    },
]

const options = commandLineArgs(optionDefinitions);

if (options.help) {
    console.log(commandLineUsage([
        {
            header: 'catzip',
            content: 'Concatenate all the file contents of a zip file. Designed for use with zip archives of simple, project code.'
        },
        {
            header: 'Options',
            optionList: optionDefinitions,
            tableOptions: {
                columns: [
                    {
                        name: 'option',
                        noWrap: true,
                        width: 20,
                    },
                    {
                        name: 'description',
                        width: 60,
                    }
                ]
            }
        },
        {
            header: 'Examples',
        },
        {
            content: '{underline catzip John_Smith.zip} # print content to screen'
        },
        {
            content: '{underline catzip --save A.zip B.zip} # print A.zip into A.txt, Z.zip -> B.txt'
        },
        {
            header: 'Quirks',
            content: 'This utility was written to aid recruiters in printing and sharing code written by candidates. It has some quirks specific to that task.'
        },
        {
            content: 'Some files inside the archive will be ignored. For example, it won\'t print the content of "package.json".'
        },
        {
            content: 'The files in the archive are expected to be short and contain code. The lines are numbered for each file on the output.'
        },
        {
            content: 'The name of the archive is printed on the first line, and the name of each file is printed at the beginning and end of its content.'
        }
    ]));
    return;
}

const PRINT_TO_FILES = options.save;

const AdmZip = require('adm-zip');

archives = options.src;

archives.forEach(processArchive);

function processArchive(archiveName) {
    var zip = new AdmZip(archiveName);
    var zipEntries = zip.getEntries();
    
    var linePattern = /^.*?$/gim;

    var emit = (...args) => console.log(args.join(' '));
    let stream = null;
    if (PRINT_TO_FILES) {
        let filename = path.basename(archiveName, '.zip') + '.txt';
        stream = fs.createWriteStream(filename, 'utf8');
        emit = (...args) => stream.write(args.join(' ') + EOL);
    }
    
    emit('Contents of', archiveName);
    
    zipEntries.forEach(zipEntry => {
        let name = zipEntry.entryName;
        if (name.endsWith('/') || name.endsWith('\\')) {
            return;
        }
        if (name.endsWith('package.json')) {
            return;
        }
    
        let content = zip.readAsText(name);
        emit('// Begin', name);
        let lineNo = 1;
        [...content.matchAll(linePattern)].map(matchData => matchData[0]).forEach(line => {
            emit(pad(lineNo++), line);
        });
        emit('// End', name);
    }); 
    
    if (stream) {
        stream.end();
    }
}

function pad(num) {
    if (num > 999) {
        return num;
    }
    return ('000' + num).slice(-3);
}