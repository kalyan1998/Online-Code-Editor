const { exec } = require('child_process');

const applyJob = async (jobYaml) => {
  return new Promise((resolve, reject) => {
    exec(`echo "${jobYaml}" | kubectl apply -f -`, (err, stdout, stderr) => {
      if (err) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

const getJobStatus = async (jobName) => {
  return new Promise((resolve, reject) => {
    exec(`kubectl get job ${jobName} -o json`, (err, stdout, stderr) => {
      if (err) {
        reject(stderr);
      } else {
        resolve(JSON.parse(stdout));
      }
    });
  });
};

const getJobLogs = async (jobName) => {
  return new Promise((resolve, reject) => {
    exec(`kubectl logs job/${jobName}`, (err, stdout, stderr) => {
      if (err) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

const createJob = (code, language, sessionId) => {
  const jobName = `${language}-executor-${sessionId}`;
  return `
apiVersion: batch/v1
kind: Job
metadata:
  name: ${jobName}
spec:
  template:
    metadata:
      labels:
        app: ${language}-executor
    spec:
      containers:
        - name: ${language}
          image: ${getImageForLanguage(language)}
          command: ["/bin/sh", "-c", "echo '${code}' > code.${getFileExtension(language)} && ${getCompileCommand(language)} code.${getFileExtension(language)} -o code && ./code"]
      restartPolicy: Never
  backoffLimit: 4
`;
};

const getImageForLanguage = (language) => {
  const images = {
    nodejs: 'node:latest',
    python: 'python:latest',
    cpp: 'gcc:latest',
    java: 'openjdk:latest',
    ruby: 'ruby:latest',
  };
  return images[language];
};

const getFileExtension = (language) => {
  const extensions = {
    nodejs: 'js',
    python: 'py',
    cpp: 'cpp',
    java: 'java',
    ruby: 'rb',
  };
  return extensions[language];
};

const getCompileCommand = (language) => {
  const commands = {
    nodejs: 'node',
    python: 'python',
    cpp: 'g++',
    java: 'javac',
    ruby: 'ruby',
  };
  return commands[language];
};

module.exports = {
  createJob,
  applyJob,
  getJobStatus,
  getJobLogs,
};
