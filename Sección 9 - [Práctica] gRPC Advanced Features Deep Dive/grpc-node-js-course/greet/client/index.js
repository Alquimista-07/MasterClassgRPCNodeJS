const fs = require('fs');
const grpc = require('@grpc/grpc-js');
const {GreetServiceClient} = require('../proto/greet_grpc_pb');
const {GreetRequest} = require('../proto/greet_pb');

function doGreet(client){
    console.log('doGreet was invoked');

    const req = new GreetRequest()
      .setFirstName('Ariadna');

    client.greet(req, (err, res) => {
        console.log('res' + res);
        if(err){
            return console.log(err);
        }

        console.log(`Greet: ${res.getResult()}`);

    })
}

function doGreetManyTimes(client) {
    console.log('doGreetManyTimes was invoked');

    const req = new GreetRequest()
      .setFirstName('Ariadna');
    const call = client.greetManyTimes(req);

    call.on('data', (res) => {
        console.log(`GreetManyTimes: ${res.getResult()}`);
    })
}

function doLongGreet(client) {
    console.log('doLongGreet was invoked');

    const names = ['Clement', 'Marie', 'Test'];
    const call = client.longGreet((err, res) => {
        if (err) {
            return console.log(err);
        }

        console.log(`LongGreet: ${res.getResult()}`);
    })

    names.map((name) => {
        return new GreetRequest().setFirstName(name)
    }).forEach((req) => call.write(req));
    call.end();
}

function doGreetEveryone(client) {
    console.log('doGreetEveryone was invoked');
    const names = ['Clement', 'Marie', 'Test'];
    const call = client.greetEveryone();

    call.on('data', (res) => {
        console.log(`GreetEveryone: ${res.getResult()}`);
    });

    names.map((name) => {
        return new GreetRequest().setFirstName(name);
    }).forEach((req) => call.write(req));
    call.end();
}

function doGreetWithDeadline(client, ms) {
    console.log('doGreetWithDeadline was invoked');
    const req = new GreetRequest()
      .setFirstName('Clement');

    client.greetWithDeadline(req, {
        dealine: new Date(Date.now() + ms)
    }, (err, res) => {
        if (err) {
            console.log(err);
        }

        console.log(`GreetWithDeadline: ${res.getResult()}`);
    })
}

function main() {
    const tls = true;
    let creds;
    
    if (tls) {
        const rootCert = fs.writeFileSync('./ssl/ca.crt');

        creds = grpc.ChannelCredentials.createSsl(rootCert);
    } else {
        creds = grpc.ChannelCredentials.createInsecure();
    }
    const client = new GreetServiceClient('localhost:50051', creds);
  
    doGreet(client)
    //doGreetManyTimes(client);
    //doLongGreet(client);
    //doGreetEveryone(client);
    //doGreetWithDeadline(client, 5000);
    //doGreetWithDeadline(client, 1000);
    client.close();
    
};

main();