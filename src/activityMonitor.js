import { execSync } from 'node:child_process';
import fs from 'node:fs';

const platform = process.platform;

const refreshRate = 100;
const logInterval = 60000;

const logFilePath = 'activityMonitor.log';

function getMaxProcessInfoLength() {
  return process.stdout.columns || 80;
}

function getProcessInfo() {
  let command = '';
  switch (platform) {
    case 'linux':
      command = 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1';
      break;
    case 'darwin':
      command = 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1';
      break;
    case 'win32':
      command =
        "powershell \"Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }\"";``
      break;
    default:
      console.error('Unsupported platform');
      process.exit(1);
  }
  return execSync(command).toString().trim();
}

function writeToLogFile(data) {
  fs.appendFile(logFilePath, `${Date.now()} : ${data}\n`, (err) => {
    if (err) throw err;
  });
}

function update() {
  const processInfo = getProcessInfo();
  let truncatedInfo = processInfo;
  const maxProcessInfoLength = getMaxProcessInfoLength();

  if (processInfo.length > getMaxProcessInfoLength()) {
      truncatedInfo = processInfo.substring(0, maxProcessInfoLength - 3) + '...';
  }
  process.stdout.clearScreenDown();
  process.stdout.write('\r' + truncatedInfo);
}

setInterval(update, refreshRate);

setInterval(() => {
  const processInfo = getProcessInfo();
  writeToLogFile(processInfo);
}, logInterval);
