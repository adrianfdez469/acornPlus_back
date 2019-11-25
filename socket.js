let io;

module.exports = {
    init: server => {
        const socket = require('socket.io');
        io = socket(server);
    },
    getIo: () => {
        if(!io){
            log('Debe inicializar el socket');
        }else{
            return io;
        }
    },
    close: () => {
        if(io)
            io.close();
    }
};