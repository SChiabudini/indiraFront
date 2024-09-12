const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;

// Función para iniciar el contenedor Docker
// const startDockerContainer = () => {
//   // Verifica si el contenedor ya está corriendo
//   exec('docker ps -q -f name=my-express-container', (err, stdout) => {
//     if (err) {
//       console.error(`Error checking Docker container: ${err}`);
//       return;
//     }
    
//     if (!stdout) {
//       // Si el contenedor no está corriendo, inícialo
//       exec('docker-compose up -d', (error, stdout, stderr) => {
//         if (error) {
//           console.error(`Error starting Docker container: ${error}`);
//         } else {
//           console.log('Docker container started successfully');
//         }
//       });
//     } else {
//       console.log('Docker container is already running');
//     }
//   });
// };

const checkDockerAvailable = (callback) => {
  exec('docker info', (err, stdout, stderr) => {
    if (err) {
      console.error('Docker no está disponible. Asegúrate de que Docker esté corriendo.');
      return;
    }
    callback();
  });
};

// const startDockerContainer = () => {
//   // Añade manualmente la ruta de Docker al PATH en tu código
//   process.env.PATH += ';C:\\Program Files\\Docker\\Docker\\resources\\bin';

//   exec('docker info', (err, stdout, stderr) => {
//     if (err) {
//       console.error('Docker no está disponible. Asegúrate de que Docker esté corriendo.');
//       return;
//     }

//     exec('docker ps -q -f name=indira-gold-project-backend-1', (err, stdout, stderr) => {
//       if (err) {
//         console.error(`Error checking Docker container: ${err}`);
//         return;
//       }

//       if (!stdout) {
//         exec('docker compose -f ./ruta/a/tu/docker-compose.yml up -d', (error, stdout, stderr) => {
//           if (error) {
//             console.error(`Error starting Docker container: ${error}`);
//           } else {
//             console.log('Docker container started successfully');
//             console.log(stdout);
//           }
//         });
//       } else {
//         console.log('Docker container is already running');
//       }
//     });
//   });
// };
const startDockerContainer = () => {
  const projectPath = 'C:/Users/Frida/Desktop/Indira Gold/indira-gold-project';
  
  console.log('Checking if Docker is available...');
  exec('docker info', (err, stdout, stderr) => {
    if (err) {
      console.error('Docker no está disponible o no está corriendo.');
      return;
    }
    console.log('Docker está disponible.');

    console.log(`Changing directory to ${projectPath}...`);
    exec(`cd ${projectPath} && docker compose up -d`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting Docker container: ${error}`);
        if (stderr) {
          console.error(`Error output: ${stderr}`);
        }
      } else {
        console.log('Docker container started successfully');
        console.log(stdout);
      }
    });
  });
};



const createWindow = () => {  
  // Crea la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 780,
    //icon: path.join(__dirname, 'assets', 'img', 'windowsIcon.ico'),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // Maximiza la ventana
  mainWindow.maximize();

  // Carga el index.html de la aplicación
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Oculta la barra de menú
  mainWindow.setMenuBarVisibility(false);

  // Abre las herramientas de desarrollo
  mainWindow.webContents.openDevTools();
};

// Este método se llamará cuando Electron haya terminado la inicialización y esté listo para crear ventanas del navegador.
// Algunas API solo pueden usarse después de que ocurra este evento.
app.whenReady().then(() => {
  // Inicia el contenedor Docker
  startDockerContainer();

  // Crea la ventana de la aplicación
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// const startDockerContainer = () => {
//   exec('which docker-compose', (err, stdout, stderr) => {
//     if (err) {
//       console.error('docker-compose no está disponible en el PATH.');
//       return;
//     }
//     console.log(`docker-compose found at: ${stdout}`);
//     if (stderr) {
//       console.error(`Error checking docker-compose path: ${stderr}`);
//     }

//     exec('docker ps -q -f name=indira-gold-project-backend-1', (err, stdout, stderr) => {
//       if (err) {
//         console.error(`Error checking Docker container: ${err}`);
//         if (stderr) {
//           console.error(`Error output: ${stderr}`);
//         }
//         return;
//       }
      
//       if (!stdout) {
//         exec('docker-compose up -d', (error, stdout, stderr) => {
//           if (error) {
//             console.error(`Error starting Docker container: ${error}`);
//             if (stderr) {
//               console.error(`Error output: ${stderr}`);
//             }
//           } else {
//             console.log('Docker container started successfully');
//             console.log(stdout);
//           }
//         });
//       } else {
//         console.log('Docker container is already running');
//       }
//     });
//   });
// };