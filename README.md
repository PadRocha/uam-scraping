# Backend Template

by Cétr!co.Productions <img src=".\assets\icon-1024x1024.png" style="zoom:2%;" />

[TOC]

## System Features

### Scripts

```
npm start
```

Start the server.

```
npm run dev
```

Activate Typescript Observer (use while project is in development).

```
npm run docs
```

Generate the Api documentation and open it in browser default.

```
npm build
```

Compile all Typescript file.

### Dependencies

| Package                                                                                                                                     | Purpose                                                                                                                                                                                                                                                                                                                    |
| :------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) & [@types](https://www.npmjs.com/package/@types/bcryptjs)                                | Optimized bcrypt in JavaScript with zero dependencies. Compatible to the C++ [bcrypt](https://npmjs.org/package/bcrypt) binding on node.js and also working in the browser.                                                                                                                                                |
| [cors](https://www.npmjs.com/package/cors) & [@types](https://www.npmjs.com/package/@types/cors)                                            | CORS is a node.js package for providing a [Connect](http://www.senchalabs.org/connect/)/[Express](http://expressjs.com/) middleware that can be used to enable [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) with various options.                                                                    |
| [dayjs](https://www.npmjs.com/package/dayjs)                                                                                                | Day.js is a minimalist JavaScript library that parses, validates,  manipulates, and displays dates and times for modern browsers with a  largely Moment.js-compatible API. If you use Moment.js, you already know how to use Day.js.                                                                                       |
| [dotenv](https://www.npmjs.com/package/dotenv) & [@types](https://www.npmjs.com/package/@types/dotenv)                                      | Dotenv is a zero-dependency module that loads environment variables from a `.env` file into [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env). Storing configuration in the environment separate from code is based on [The Twelve-Factor App](http://12factor.net/config) methodology. |
| [express](https://www.npmjs.com/package/express) & [@types](https://www.npmjs.com/package/@types/express)                                   | Fast, unopinionated, minimalist web framework for [node](http://nodejs.org).                                                                                                                                                                                                                                               |
| [fmt](https://www.npmjs.com/package/fmt)                                                                                                    | Command Line Output Formatting                                                                                                                                                                                                                                                                                             |
| [fs-extra](https://www.npmjs.com/package/fs-extra) & [@types](https://www.npmjs.com/package/@types/fs-extra)                                | `fs-extra` adds file system methods that aren't included in the native `fs` module and adds promise support to the `fs` methods. It also uses [`graceful-fs`](https://github.com/isaacs/node-graceful-fs) to prevent `EMFILE` errors. It should be a drop in replacement for `fs`.                                         |
| [helmet](https://www.npmjs.com/package/helmet) & [@types](https://www.npmjs.com/package/@types/helmet)                                      | Helmet helps you secure your Express apps by setting various HTTP headers. *It's not a silver bullet*, but it can help!                                                                                                                                                                                                    |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) & [@types](https://www.npmjs.com/package/@types/jsonwebtoken)                    | This was developed against `draft-ietf-oauth-json-web-token-08`. It makes use of [node-jws](https://github.com/brianloveswords/node-jws).                                                                                                                                                                                  |
| [mongoose](https://www.npmjs.com/package/mongoose) & [@types](https://www.npmjs.com/package/@types/mongoose)                                | Mongoose is a [MongoDB](https://www.mongodb.org/) object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.                                                                                                                                                     |
| [mongoose-paginate-v2](https://www.npmjs.com/package/mongoose-paginate-v2) & [@types](https://github.com/PadRocha/mongoose-paginate-v2.git) | A cursor based custom pagination library for [Mongoose](http://mongoosejs.com) with customizable labels.                                                                                                                                                                                                                   |
| [morgan](https://www.npmjs.com/package/morgan) & [@types](https://www.npmjs.com/package/@types/morgan)                                      | HTTP request logger middleware for node.js                                                                                                                                                                                                                                                                                 |
| [multer](https://www.npmjs.com/package/multer) & [@types](https://www.npmjs.com/package/@types/multer)                                      | Multer is a node.js middleware for handling `multipart/form-data`, which is primarily used for uploading files. It is written on top of [busboy](https://github.com/mscdex/busboy) for maximum efficiency.                                                                                                                 |
| [uuid](https://www.npmjs.com/package/uuid) & [@types](https://www.npmjs.com/package/@types/uuid)                                            | For the creation of [RFC4122](http://www.ietf.org/rfc/rfc4122.txt) UUIDs                                                                                                                                                                                                                                                   |

### Developer dependencies

| Package                                                  | Purpose                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@types/node](https://www.npmjs.com/package/@types/node) | This package contains type definitions for Node.js (http://nodejs.org/).                                                                                                                                                                                                  |
| [apidoc](https://apidocjs.com/)                          | apiDoc creates a documentation from API annotations in your source code.                                                                                                                                                                                                  |
| [tsc-watch](https://www.npmjs.com/package/tsc-watch)     | `tsc-watch` starts a TypeScript compiler with `--watch` parameter, with the ability to react to compilation status. `tsc-watch` was created to AUTH an easy dev process with  TypeScript. Commonly used to restart a node server, similar to nodemon  but for TypeScript. |
| [typescript](https://www.typescriptlang.org/docs)        | TypeScript is an open-source language which builds on JavaScript, one of the world’s most used tools, by adding static type definitions.                                                                                                                                  |

### Optional dependencies

| Package                                                                                           | Purpose                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [cloudinary](https://cloudinary.com/documentation/node_integration#node_js_getting_started_guide) | Cloudinary's Node.js SDK provides simple, yet comprehensive image and  video upload, transformation, optimization, and delivery capabilities  that you can implement using code that integrates seamlessly with your  existing Node.js application. |
| [socket.io](https://www.npmjs.com/package/socket.io)                                              | Socket.IO enables real-time bidirectional event-based communication.                                                                                                                                                                                |

## Folders

### Config

> This directory includes default configuration files and values.
>

| File     | Purpose                                                                                             |
| -------- | --------------------------------------------------------------------------------------------------- |
| config   | Create an object with the environment variables if they exist or, failing that, set default values. |
| custom.d | Set additional Typescript interfaces in project.                                                    |

### Controllers

> The controller class handles incoming requests, validates them and sends the response data back to the client.

### Middlewares

> This folder includes all the API’s global middlewares like authentication, compression, request logging etc.

### Models

> The model represents the database model for its component.

Template model code.

```typescript
import { Document, model, Schema } from 'mongoose';
export interface IModel extends Document {};
const modelSchema = new Schema<IModel>({});
export default model<IModel>('Model', modelSchema);
```

Template model code with [mongoose-paginate-v2](https://www.npmjs.com/package/mongoose-paginate-v2) plug in.

```typescript
import { Document, model, PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
export interface IModel extends Document {};
const modelSchema = new Schema<IModel>({});
modelSchema.plugin(mongoosePaginate);
interface ModelModel<T extends Document> extends PaginateModel<T> { };
export default model<IModel>('Line', modelSchema) as ModelModel<IModel>;
```

### Routes

> Here we define our API endpoints for the corresponding component and assign the *controller* methods to them. Moreover we can do things like authorization (e.g.  JWT), permission validation (e.g. ACL) or add component specific  middleware.

### Services

> Service include functions that can be reusable in different parts of the code.

## Root src files