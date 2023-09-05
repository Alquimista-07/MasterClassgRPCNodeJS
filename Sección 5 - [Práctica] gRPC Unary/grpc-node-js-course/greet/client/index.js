const grpc = require('@grpc/grpc-js');
const {GreetRequest} = require('../proto/greet_pb');

function main() {

    const creds = grpc.ChannelCredentials.createInsecure();
    const client = new GreetServiceClient('localhost:50051', creds);
  
    // ...
    client.close();
    
};

main();