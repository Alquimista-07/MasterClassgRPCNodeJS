const grpc = require('@grpc/grpc-js');
const {CalculatorServiceClient} = require('../proto/calculator_grpc_pb');
const {SumRequest} = require('../proto/sum_pb');
const {PrimeRequest} = require('../proto/primes_pb');
const {AvgRequest} = require('../proto/avg_pb');
const {MaxRequest} = require('../proto/max_pb');
const {SqrtRequest} = require('../proto/sqrt_pb');

function doSum(client) {
    console.log('doSum was Invoked');

    const req = new SumRequest()
      .setFirstNumber(1)
      .setSecondNumber(1);

      client.sum(req, (err, res) => {
        if(err) {
            return console.log(err);
        }

        console.log(`Sum: ${res.getResult()}`);
      })

}

function doPrimes(client) {
  console.log('doPrimes was invoked');
  const req = new PrimeRequest()
    .setNumber(12390392840);

  const call = client.primes(req);

  call.on('data', (res) => {
    console.log(`Primes: ${res.getResult()}`);
  })
}

function doAvg(client) {
  console.log('doAvg was invoked');

  const numbers = [...Array(11).keys()].slice(1);
  const call = client.avg((err, res) => {
    if (err) {
      return console.log(err);
    }

    console.log(`Avg: ${res.getResult()}`);
  })

  numbers.map((number) => {
    return new AvgRequest().setNumber(number);
  }).forEach((req) => call.write(req));
  call.end();
}

function doMax(client) {
  console.log('doMax was invoked');

  const numbers = [4, 7, 2, 19, 4, 6, 32];
  const call = client.max();

  call.on('data', (res) => {
    console.log(`Max: ${res.getResult()}`);
  });

  numbers.map((number) => {
    return new MaxRequest().setNumber();
  }).forEach((req) => call.write(req));
  call.end();
}

function doSqrt(client, n) {
  console.log('doSqrt was invoked');

  const req = new SqrtRequest()
    .setNumber(n);
    client.sqrt(req, (err, res) => {
      if(err) {
        return console.log(err);
      }

      console.log(`Sqrt: ${res.getResult()}`);
    })
}

function main() {
    const creds = grpc.ChannelCredentials.createInsecure();
    const client = new CalculatorServiceClient('localhost:50051', creds);

    //doSum(client);
    //doPrimes(client);
    //doAvg(client);
    //doMax(client);
    //doSqrt(client, 25);
    doSqrt(client, -1);
    client.close();
}

main();