class HttpException extends Error {
  constructor(code = '500', msg = 'Server error', data = null, httpCode = 500) {
    super();
    this.code = code;
    this.msg = msg;
    this.data = data;
    this.httpCode = httpCode;
  }
}

module.exports = HttpException;
