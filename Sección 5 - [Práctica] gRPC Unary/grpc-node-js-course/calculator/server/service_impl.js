const {SumResponse} = require('../proto/sum_pb');

exports.sum = (call, callback) => {
    console.log('Sum was invoked');

    const res = new SumResponse()
      .setResults(
        call.request.getFirstNumber() + call.request.getSecondNumber(),
      )

      callback(null, res);
      
}