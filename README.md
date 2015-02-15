# CookieJar

## Description

This is a small JavaScript cookie library with a full unicode support. The code originally came from
MDN developed library which was improved a bit to be more flexible.

## Usage

### New cookie creation

```
CookieJar.set({
   name: 'My Cookie',
   value: 'Cookie value',
   expires: 'Jan 11, 2015 2:10:01 GMT',
   path: '/en/blog',
   domain: 'domain.example.com',
   secure: true
});
```

The date can alternatively be provided this way:
```
new Date(2015, 1, 11, 2, 10, 1)
```

### Unexpiring cookies

```
CookieJar.forever({
    name: 'My Cookie',
    value: 'Cookie value',
    domain: 'domain.example.com'
});
```

### Checking for existing cookies

```
CookieJar.has('My Cookie');
```

### Retrieving cookie value

```
CookieJar.get('My Cookie');
```

### Forgetting a cookie (setting as expired)

```
CookieJar.forget({
  name: 'My Cookie',
  path: '/en/blog',
  domain: 'domain.example.com'
});
```

### Retrieving all previously stored cookies

```
CookieJar.all();
```

