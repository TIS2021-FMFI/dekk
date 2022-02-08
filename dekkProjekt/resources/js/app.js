require('./bootstrap');



// disable console.log for the whole project if not in debugging mode
const DEBUG_MODE = false;

if (!DEBUG_MODE) console.log = () => {};