const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer1 = fs.readFileSync('src/main/resources/static/md/WiseT Agent 사용자 가이드 v1.8.3_r1.pdf');
let dataBuffer2 = fs.readFileSync('src/main/resources/static/md/WiseT Agent 설치가이드 v1.8.3_r1.pdf');

async function run() {
    let data1 = await pdf(dataBuffer1);
    fs.writeFileSync('agent_user_guide.txt', data1.text);
    
    let data2 = await pdf(dataBuffer2);
    fs.writeFileSync('agent_install_guide.txt', data2.text);
    console.log('Success');
}

run();
