const ssh = require('ssh2');
const co = require('co');
const shell = require('shelljs');
const {config} = require('./server/lib/config.js');
let sftpClient = require('ssh2-sftp-client');
var Client = require('ssh2').Client;

(async function(){ 
     sshFrontendData()
})()

  function onSshReady(options) {
    return co(function* () { 
      if (!options.conn) {
        throw new Error(`Options must have a connection object`);
      }
      const conn = options.conn;
      // Step 1: Compile command
      const command = yield generateDeploymentCommand();
      console.log(`About to execute the following command: ${command}`);
      const stream = yield thunkifyLight(conn, 'exec', command);
      return stream;
    });
  }

  function generateDeploymentCommand() {
    return co(function* () {
        const cmd = [
            `pm2 stop all`,
            'git reset --hard HEAD',
            'git checkout master',
            'git pull origin master',
            'npm i --production',
            'npm run tsc',
            'pm2 reload all'
          ];
      return cmd.join('\n');
    });
  }

  function thunkifyLight(context, fn, arg1, arg2) {
    return function(callback) {
        context[fn](arg1, callback);
    };
  }

  function uploadDistToServer(){
        let sftp = new sftpClient();
        sftp.connect({
        host: config.SFTP_HOST,
        port: config.SFTP_PORT,
        username: config.SFTP_USERNAME,
        password: config.SFTP_PASSWORD
        }).then(() => {
        return sftp.uploadDir('dist' , `${config.UPLOAD_PATH_FRONTEND_BUILD}/dist`);;
        }).then((data) => {
         console.log(data);
        co(function* () {
          const opts = {
            onReady: onSshReady
          };
          yield sshStream(opts);
          }).catch(error => {
          console.log(error);
          });
        }).catch((err) => {
            console.log(err, 'catch error');
      });
     }
    
    function removeDistInSftp(){
          let sftp = new sftpClient();
          sftp.connect({
          host: config.SFTP_HOST,
          port: config.SFTP_PORT,
          username: config.SFTP_USERNAME,
          password: config.SFTP_PASSWORD
          }).then(()=>{
            return sftp.chmod(`${config.UPLOAD_PATH_FRONTEND_BUILD}dist` , 755);
          }).then((data) => {
          console.log(data);
          return sftp.rmdir(`${config.UPLOAD_PATH_FRONTEND_BUILD}dist` , true);;
          }).then((data) => {
            console.log(data);
            return sftp.mkdir(`${config.UPLOAD_PATH_FRONTEND_BUILD}dist`, true);
          }).then((data) => {
              console.log(data);
              uploadDistToServer();
            }).catch((err) => {
            console.log(err, 'catch error');
        });
        }
      

  function sshFrontendData(){
    console.log('Start frontend compilation');
    shell.exec('npm run build'); 
    shell.exec(`exit`);
    console.log('Frontend Build completed');
     removeDistInSftp();
  }

  function sshStream(options) {
    var connSettings = {
      host: config.SFTP_HOST,
      port: config.SFTP_PORT,
      username: config.SFTP_USERNAME,
      password: config.SFTP_PASSWORD
  };
    const conn = new ssh();
    return new Promise((resolve, reject) => {
      conn.on('ready', async () => {
        co(function*() {
            console.log(`SSH connection has been established`);
            const stream = yield options.onReady({ conn });
            let $error;
            stream.on(`data`, data => {
              console.log(data.toString().trim());
            });
            stream.stderr.on(`data`, data => {
                console.log(data.toString());
            });
            stream.on('error', error => {
                console.log(`Error from SSH client: ${ error }`);
              stream.end();
              conn.end();
              $error = error;
              reject($error);
            });
            stream.on('exit', () => {
              if (!$error) {
                console.log(`Successfully exited stream`);
                resolve();
              }
            });
          }).catch(error => {
            console.log(error);
          });
      }).connect(connSettings);
    });
  }