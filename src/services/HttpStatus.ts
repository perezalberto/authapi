export enum HttpStatusError {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PAYLOAD_TOO_LARGE = 413,
    TOO_MANY_REQUESTS = 429,
}

export enum HttpStatusSuccess {
    OK = 200,
    CREATED = 201,
}
