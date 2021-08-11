//Import tools
const inquirer = require("inquirer");
const fs = require('fs');

//initialize content
const sections = ['Table of Contents','Description',  'Installation', 'Usage', 'License', 'Contributing', 'Tests', 'Questions']
const filename = 'README.md'
const licenseObjs = [
  {name: 'IBM', 
  notice: 'This project uses IBM Public License Version 1.0 (IPL-1.0). You can find more information by [clicking here](https://opensource.org/licenses/IPL-1.0)', 
  badge: `[![License: IPL 1.0](https://img.shields.io/badge/License-IPL%201.0-blue.svg)](https://opensource.org/licenses/IPL-1.0)`
  },
  {name: 'MIT', 
  notice: 'This project uses The MIT License. You can find more information by [clicking here](https://opensource.org/licenses/MIT)', 
  badge: `[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)`
  },
  {name: 'Mozilla', 
  notice: 'This project uses Mozilla Public License 2.0 (MPL-2.0). You You can find more information by [clicking here](https://opensource.org/licenses/MPL-2.0)', 
  badge: `[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)`
  },
  {name: 'Apache', 
  notice: 'This project uses Apache License, Version 2.0. You You can find more information by [clicking here](https://opensource.org/licenses/Apache-2.0)', 
  badge: `[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)`
  },
  {name: 'ISC', 
  notice: 'This project uses ISC License (ISC). You You can find more information by [clicking here](https://opensource.org/licenses/ISC)', 
  badge: `[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)`
  }
]
//Get a simpler array from the licenses for use in the prompt
const licenses = licenseObjs.map(({name}) => name);

const questions = [
    { type: 'input',
      message: 'What is your Project Title?',
      name: 'title'
    },{
      type: 'input',
      message: 'Describe your project...',
      name: 'description'
    },{
      type: 'input',
      message: 'How is it installed?',
      name: 'install'
    },{
      type: 'input',
      message: 'What is it used for?',
      name: 'usage'
    },{
      type: 'input',
      message: 'How can you contribute?',
      name: 'contribute'
    },{
      type: 'input',
      message: 'How do the tests work?',
      name: 'tests'
    },{
      type: 'list',
      message: 'Select a License...',
      name: 'license',
      choices: licenses
    },
    // WHEN I enter my GitHub username
    // THEN this is added to the section of the README entitled Questions, with a link to my GitHub profile
    {
      type:'input',
      message: 'What is your GitHub Username?',
      name: 'github'
    },
    // WHEN I enter my email address
    // THEN this is added to the section of the README entitled Questions, with instructions on how to reach me with additional questions
    {
      type: 'input',
      message: 'What is your email address?',
      name: 'email'
    }
     ];

//Main function to build the response once inquirer has it
function buildReadme(response) {
  // WHEN I click on the links in the Table of Contents
    // THEN I am taken to the corresponding section of the README
    let msgArray = []
    msgArray.push('# ' + response.title)
    msgArray.push('badge');
    sections.forEach(section => {
      msgArray.push('## ' + section)
      msgArray.push(section)
    }); 

    for (i=0; i < sections.length; i++){
      index = msgArray.indexOf(sections[i]);
      console.log('i=' + i + " index= " + index);
      switch (sections[i]) {
        case 'Description':
          msgArray[index] = response.description;
          break;
        case 'Table of Contents':
          msgArray[index] = makeTOC();
          console.log('made it back');
          break;
        case 'Installation':
          msgArray[index] = response.install;
          break;
        case 'Usage':
          msgArray[index] = response.usage;
          break;
        case 'License':
          let licObj = makeLicense(response.license)
          msgArray[index] = licObj.notice;
          let bdgIndex = msgArray.indexOf('badge');
          msgArray[bdgIndex] = licObj.badge
          break;
        case 'Contributing':
          msgArray[index] = response.contribute;
          break;
        case 'Tests':
          msgArray[index] = response.tests;
          break;
        case 'Questions':
          msgArray[index] = `If you have questions, check out my [github profile](https://github.com/${response.github})
          <br />You can also contact me at ${response.email}`;
          break;
        default:
          console.log("Not a Section");
          break;
      }
    }
    console.log(msgArray);
    writeToFile(filename, msgArray.join('\n'));
}

//Get the license that is selected by comparing the section to the name field
function makeLicense (selection){
    for (let i = 0; i < licenseObjs.length; i++){
    if (selection === licenseObjs[i].name) return licenseObjs[i];
  }
  return "No License";
}


//Loop through the sectiosn and give them a header with a link
function makeTOC() {
  let arrTOC = [];
  for (let i=1 ;i < sections.length; i++){
    arrTOC[i-1] = '- [' + sections[i].replace(" ", "_") + '](#' + sections[i].toLowerCase() + ')  ';
  }
  return arrTOC.join('\n');
}

//Simple write to file function
function writeToFile(filename, data) {
    fs.writeFile(filename, data, (err) => err ? console.log(err): console.log("Success!") );
}

//Main Code
inquirer
.prompt(questions)
.then((response) => buildReadme(response))
.catch((err) => console.log(err));