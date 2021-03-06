# Todo App

  The top level goal is to design a web application that manages a user's todo items. 

  The main focus is to demonstrate developer's ability to 
  - Organize a JavaScript code base 
  - Use and understand JavaScript patterns such as constructor, factory and module
  - Use a modern bundler such as webpack to manage static assets (css/js/images)
  - Use vanilla Javascript to achieve the above tasks
  - Understand new JavaScript language features (ECMAScript 6 and beyond)
  - Use Linters to follow coding styles (both on local machines and on GitHub)

## Screenshots

![List of Todo Items](todo-app.png)

## Demo
  The live version of the application can be found [here](https://edward-todo-app.netlify.com/)

## Feature List
  - Adding, Editing and Deleting Todo Items
  - Add Project Types or Categories

## Getting Started

Clone this repository on your machine then navigate to the directory names `dist` which has all prebuilt files necessary for running the project. 
Open the index page within it using a browser.

### Prerequisites

The software does not have any prerequisites, but in case you need to modify it then the following software can should be present on you machine

* [NPM](https://nodejs.org/en/) node package manage
* [Visual Studio Code](https://code.visualstudio.com/) or any other modern IDE of your choice as long as it supports editing `HTML/CSS/JS` files

### Installing

For installation of the above listed software please visit their official websites for a quick start, since no custom settings are required. 

To begin customizing the software from an IDE follow these steps:

First Run in the project root folder
```shell
npm dev

```

Then check the index page generated under the dist folder, open the page in the browser to view the application. 
For a more optimized build with webpack use the script tagged with production in the `package.json` file

```shell
npm run production
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](github.com/igakigongo/js-todo-app/tags). 

## Authors

* [**Edward Iga Kigongo**](github.com/igakigongo)

## Contact & Profile Links
* Email: igakigongo@gmail.com
* LinkedIn: https://www.linkedin.com/in/igakigongo/
* PluralSight: https://app.pluralsight.com/profile/edward-iga

## License

The project and all associated source code are free for redistribution and modification.

## Desirable Features

  * Make the application responsive - adapt it to mobile screens
  * Automatically Expand the edit window on clicking the edit icon on the todo item
  * Mark off Todo Items as complete/pending based on status
  * Add a summary of upcoming todos for easier access
  * Filter Todo Items (By Status/Project)
