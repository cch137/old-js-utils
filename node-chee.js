const fs = require('fs');
const path = require('path');
const basic = require('./');
const { execSync } = require('child_process');


let CONFIG_PATH;

const chee = {
  ...basic,
  config: {},
  get CONFIG_PATH() { return CONFIG_PATH },
  set CONFIG_PATH(newValue) {
    CONFIG_PATH = newValue;
    chee.config = require(newValue);
    chee.saveConfig = () => {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(chee.config, null, 4), {encoding: 'utf8'});
    }
  },
  walkdir: (_dir, type=1) => {
    _dir = path.resolve(_dir);
    const filepathList = [];
    for (const f of fs.readdirSync(_dir)) {
      const itemPath = path.join(_dir, f);
      const isDir = fs.statSync(itemPath).isDirectory();
      switch (type) {
        case 1: // files only
          if (isDir) filepathList.push(...chee.walkdir(itemPath));
          else filepathList.push(itemPath);
          break;
        case 0: // files and dirs
          if (isDir) filepathList.push(...chee.walkdir(itemPath));
          filepathList.push(itemPath);
          break;
        case 2: // dirs only
          if (isDir) filepathList.push(itemPath);
          else continue;
          break;
      }
    };
    return filepathList;
  },
  walkdir: (dirname) => {
    dirname = path.resolve(dirname);
    /** @type {Array.<[String,String[],String[]]>} */
    const walked = [];
    const dirs = [];
    const files = [];
    fs.readdirSync(dirname).forEach(item => {
      const itemPath = path.join(dirname, item);
      const isDir = fs.statSync(itemPath).isDirectory();
      if (isDir) dirs.push(item), walked.push(...chee.walkdir(itemPath));
      else files.push(item);
    });
    walked.unshift([dirname, dirs, files]);
    return walked;
  },
  getAllFilesR: (dirname) => {
    return chee.walkdir(dirname).map(([pathname, dirs, files]) => {
      return files.map(f => path.join(pathname, f));
    }).flat(1);
  },
  getAllDirsR: (dirname) => {
    return chee.walkdir(dirname).map(([pathname, dirs, files]) => {
      return dirs.map(f => path.join(pathname, f));
    }).flat(1);
  },
  getAllFileAndDirsR: (dirname) => {
    return chee.walkdir(dirname).map(([pathname, dirs, files]) => {
      return dirs.concat(files).map(f => path.join(pathname, f));
    }).flat(1);
  },
  promiseDir: (dirname) => {
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
  },
  safelyRm: (dirname) => {
    fs.rmSync(dirname, { recursive: true, force: true });
  },
  /**
   * To execute a system command
   * @param {String} command 
   * @returns 
   */
  sysExec: (command) => {
    try {
      const message = execSync(command, {encoding: 'utf8'});
      console.log(message);
      return message;
    } catch (e) {
      console.error(e.stdout);
      return e.stdout;
    }
  }
}

module.exports = chee;