# MySQL Project Starter

(**NOTE:** View a rendered version of this file in VS Code with `ctrl-shift-v` or `cmd-shift-v`)

&nbsp;
## Introduction

This is folder contains a starter project template for an application that uses Node, Express, Handlebars, MySQL. The starter code implements basic authentication and organizes files and concerns according to the Model View Controller pattern.

&nbsp;
## Setup

Copy the contents of this folder into your repository.

Ensure you include a `.gitignore` file in your repo that includes at minimum:

```
**/.DS_Store
**/node_modules/
.env
```

Create a `.env` file with the same contents as `.env.EXAMPLE`, modified to your own values.

&nbsp;
## Usage

The application contains the necessary scripts for local development and deploying to Heroku.

First, remember to run `npm i` to install dependencies.

Then, to run the application locally, use:

```
npm run dev
```

This will start a new Docker container with MySQL and run the contents of the `/schema` folder against the database.
