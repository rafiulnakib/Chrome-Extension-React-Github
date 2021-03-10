There are 4 main folders on the main page.
1 - "build": It contains all the built files. There files will be load to chrome extension. React files are converted in to main javascript which are stored in build folder
2 - "public": This folder contains all those files which doesn't needs to be bundled. Webpack doesn't effect these. It contain three main things
             - Favicon (The icon of the app)
             - index.html (The main html file)
             - manifest.json (contain settings for extension)
3 - "src": Contain the source files. These wil be bundled by webpack. It contain the react components and the css files for style.
             - App.tsx is our main component
             - index.tsx is file where we render our main component to the html.
             - index.css contains all the styles for the app
             - react-app-env.d is important for typescript types
             - Fonts.css imports all the fonts
             - Fonts folder contain all the font files
4 - node_modules: Contain all modules(packages used in project).
5 - gitignore: It is used to ignore node_modules when we push project to github.
6 - package.json and package-lock.json contains names of all modules which are install and other settings.
7 - tsconfig contain the settings for typescript.