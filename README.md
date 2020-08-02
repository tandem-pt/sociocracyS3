# Sociocracy S3

Organizations starting with Sociocracy S3 are being lost on how getting started, and content and information are difficult to find in an operational context. This app aims to provide support for organizations using S3, giving tips and a structure to feel safe in the first steps.

# Run the application
Run on a terminal 
```
mv .env.sample .env # Set you own keys/passwords !
docker-compose up -d
```

# Technologies

To select the technology used, we have few strategies

* Prefer using technologies that are easy to deploy
* Prefer using technologies that are supported by a broad community
* Prefer using technologies that are affordable to host

We decide then to use in a first iteration : 

* [Lumen](https://lumen.laravel.com/), a fast micro-framework by Laravel (PHP)
* [React MUI](https://github.com/mui-org/material-ui/), React components for faster and easier web development. 
* [CouchDB](https://couchdb.apache.org/) Seamless multi-master sync, that scales from Big Data to Mobile, with an Intuitive HTTP/JSON API and designed for Reliability

Here some considerations we had for choosing : 

* The backend (Lumen) should be as small as possible, doing as little as possible. A micro-framework would be great to be able to just add some logics while adding model to the CouchDB. 
* The frontend need to load fast, be cached, and be simple to read. We choose react because it is a mainstream frontend technology, and because it will help for a mobile version with react-native.
* CouchDB is definitely a bold choice, because it's harder to host and not so cheap. We decide to use CouchDB as a view for models because it's fits well a sociocracy app (each roles own their things, so there is not so many issues on conflicts expected). 