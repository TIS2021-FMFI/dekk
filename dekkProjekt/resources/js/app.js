require('./bootstrap');



// disable console.log for the whole project if not in debugging mode
const DEBUG_MODE = true;

if (!DEBUG_MODE) console.log = () => {};
