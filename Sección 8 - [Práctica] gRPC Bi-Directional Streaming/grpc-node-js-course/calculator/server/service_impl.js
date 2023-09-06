const {SumResponse} = require('../proto/sum_pb');
const {PrimeResponse} = require('../proto/primes_pb');
const {AvgResponse} = require('../proto/avg_pb');
const {MaxRequest} = require('../proto/max_pb');

exports.sum = (call, callback) => {
    console.log('Sum was invoked');

    const res = new SumResponse()
      .setResults(
        call.request.getFirstNumber() + call.request.getSecondNumber(),
      )

      callback(null, res);
      
}

exports.primes = (call, _) => {
  console.log('Primes was invoked');
  let number = call.request.getNumber();
  let divisor = 2;
  const res = new PrimeResponse();

  while (number > 1) {
    if (number % divisor == 0) {
      res.setResult(divisor);
      call.write(res);
      number /= divisor;
    } else {
      ++divisor;
    }
  }

  call.end();
}

exports.avg = (call, callback) => {
  console.log('Avg was invoked');
  let count = 0.0
  let total = 0.0

  call.on('data', (req) => {
    total += req.getNumber();
    ++count;
  });

  call.on('end', () => {
    const res = new AvgResponse()
      .setResult(total / count);

    callback(null, res);
  });
}

exports.max = (call, _) => {
  console.log('Max was invoked');

  let max = 0;

  call.on('data', (req) => {
    const number = req.getNumber();

    if(number > max) {
      const res = new MaxResponse()
        .setResult(number);

      call.write(res);
      max = number;
    }
  });

  call.on('end', () => call.end());
}