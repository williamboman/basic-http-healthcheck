# basic-http-healthcheck

> *Very* rudimentary, lightweight, HTTP server healthcheck tool.

## Usage

```
# verifies that response status code is within 200-299 range
$ basic-http-healthcheck http://localhost:9000

# verifies that response status code is within 200-299 range, and response body includes "foo bar"
$ basic-http-healthcheck -f "foo bar" http://localhost:9000
```
