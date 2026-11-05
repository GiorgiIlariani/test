<div style="text-align:center; padding: 2rem 2rem; border-bottom: solid; margin-bottom: 2rem;">This is internal software for Redberry Organization for managing their employees' salary, work experience,knowledge of skills and amount of experience in them, personal information and their employment status, live production version can be viewed <a href='https://internal.redberry.ge'>here</a> and testing live can be viewed <a href='https://internal.redberry.ge'>here</a></div>

# Table of Contents

- [Table of Contents](#table-of-contents)
- [Prerequisites](#prerequisites)
- [Tech stack](#tech-stack)
- [Installation](#installation)
- [Multi tenancy](#multi-tenancy)
- [CI/CD](#cicd)
- [Testing](#testing)
- [StoryBook](#storybook)
- [Permissions](#permissions)
  - [Permissions With TypeScript](#permissions-with-typescript)
- [Development](#development)
- [Resources](#resources)

# Prerequisites

Node@14.19.0 and up

NPM@8.4.1 and up

Typescript@4.5.5 and up

# Tech stack

- [NextJS](https://nextjs.org/) - Frontend framework
- [Tailwind](https://tailwindcss.com/) - CSS framework
- [Cypress](https://cypress.io) - Javascript testing framework
- [React window](https://react-window.vercel.app/#/examples/list/fixed-size) - React library for optimizing massive lists
- [React toastify](https://fkhadra.github.io/react-toastify/introduction) - React library for quickly making toast notifications
- [React hook form](https://react-hook-form.com/) - React library that makes dealing with forms easier
- [Tinymce](https://www.tiny.cloud/) - Rich text editor library

# Installation

Clone this repo by running following command in the terminal

```
git clone https://github.com/RedberryProducts/internal-soft-front.git
```

Cd into cloned folder and run:

```
npm install
```

now you need to set env variables for that first run:

```
cp .env.example .env
```

this will create env file with variables good enough to work on local, but you might need to configure them to fit your bill so keep that in mind

After that done you can run:

```
npm run dev
```

Now we need to setup tenancy

## Multi-Tenancy

This project uses a **multi-tenant** architecture:

- **Central Database**: Stores global data such as tenant records, user accounts, and configuration.
- **Tenant Databases**: Each tenant has its own separate database, ensuring full data isolation and scalability.

---

## Accessing a Tenant

While tenancy is mainly handled in the backend, we still have a few things to set up in the frontend:

- By default, a tenant will be accessible at:  
   `http://redberry.local:3000`

- You can change this domain in the `.env` file using the `NEXT_PUBLIC_FRONTEND_URL` variable.

- You will also need to add the tenant domain to /etc/hosts file:

```bash
   127.0.0.1 redberry.local
   127.0.0.1 tenant.api.redberry.ge
```

- After login, you'll be redirected to the tenant domain via links sent in emails, so make sure your local hosts file is properly configured.

# CI/CD

this repository has CI/CD pipeline set up by one wonderful devops and by one not so wonderful devops not gonna name names ofc.

first CI, workflow is ran on push on any branch since cypress tests are not reliable as they need developer watching since they can fail for no real reason just because state changed too fast/too late this CI simply runs linter and TSC command to make sure that build won't fail when moving to testing or production environment,

since this website has two environments it also has two CD pipelines, first testing: testing environment of this website is hosted on kubernetes and this CD is triggered when pull requested is merged into main.
production: for now production is hosted on traditional server (Digital ocean droplet) and that workflow is triggered on new release, and only the code from new release is moved to the server

# Testing

before u can run test u need to copy cypress configuration file with following command:

```
cp cypress.config.ts.example cypress.config.ts
```

everything there should be fine but check it just in case u need to change something,
usually when project is tested with cypress we can just launch normal server and all will be well but not here, because this project is written in [NextJS](https://nextjs.org/) and uses lot of server side features of [NextJS](https://nextjs.org/) and this in combination with the fact that none of requests to go actual API means that we need to run our own [Nextjs custom server](https://nextjs.org/docs/advanced-features/custom-server) and with use of this we can add our own routes and middlewares for testing and because of that we can use [Nock](https://github.com/nock/nock) to stop any requests to the backend and let our tests run isolated from backend and without being depended on external factors, the work for all of this was done and all u need to do is run following commands:

```
npm run build
```

and

```
npm run nextTestServer
```

this will launch custom server on http://localhost:3000, if u manually visit this link without cypress u will just be able to see login page, but WORRY NOT this isn't error its cuz of nock and everything will be fine in cypress,

AND FINALLY

u have two ways of running cypress tests:

```
npx cypress open
```

or

```
npx cypress run
```

first command will open cypress test runner and u can select which test u want to be run, and u will see all tests in action,
second command will run all the tests in your cypress file and u won't be able to see tests in action, this ofc can be configured so check cypress docs about info how to configure second command, cuz it has lot of configuration

if you want to run custom server in devmode to fix something in code just go to cypress/testServer.ts file and change configuration from `dev: false` to `dev: true`

# StoryBook

running Storybook is pretty simple. All config files are ready in .storybook folder. After installing all dependencies you can run:

```
npm run storybook
```

It will start Storybook locally and output the address. Command will automatically open the address in a new browser tab, and you'll be greeted by a welcome screen. You'll see all the UI components and Iconography on the left sidebar. Each component has Canvas tab, with UI component and Docs tab, with detailed information about component and other UI variations of that component if exists.

# Permissions

in this app there are many type of users with different kind of permissions on website (view admins, view salary of employees, .etc), permissions of users is stored in backend and they can be changed, after change of permissions for user UI needs to be adapted so to keep permissions up to date with backend, middleware that should be registered for all routes checks if user does not have permissions and if they do not middleware visits nextjs api route from which permissions are reset and user can keep using website, cookie has 20 minute expire time so it won't be stale often,

## Permissions With TypeScript

when checking permissions its pretty good to have TS be aware of all permissions that users might have, well in theory its simple allyouhave to do is write Tuple and write down all permissions, but it would be really annoying having to sync them with backend, tasks have to be written for both backend and frontend, and even then backend dev might just remove it because they do not use it and it will stay in frontend, so to fix this we wrote a command which checks backend's all permissions and checks if they match up with permissions that is written as readonly array in permissions.ts if they do not and something is missing or something is extra this command will let us know, to run command run following script in terminal:

```
npm run validate:permissions

```

# Development

turning development please do not push to the main branch instead create new branch by running command

```
git checkout -b new-branch-name
```

when creating new branch follow git semantic commit rules article provided in resource but instead of using : and putting spaces write new branches something like this type/branch-name

and after that send pull request, and ask for review from either [Vakho Chitauri](https://github.com/vakhtangaA), [ninadarbaidze](https://github.com/ninadarbaidze),[Giorgi giunashvili](https://github.com/giunashvili) or [GigaGiorgadze](https://github.com/GigaGiorgadze). and after that either of this three wonderful people will merge your branch with main branch if there is nothing wrong with it, if this PR does something that was requested in Jira task add task ID in description so task will change its column when this PR is mergeds

Following folder structure for this project forces you to create lot of things at same time for one component, so for this there is a command written so you can easily and quickly create new components without writing lot of boilerplate, you can run this command buy running `npm run make:component` in your terminal for more details follow instructions in command

# Resources

- [Notion](https://www.notion.so/redberry/Technical-Documentation-83539ff5aab8432ca677b7ce1baf43d8)
- [Jira](https://rayredberry.atlassian.net/jira/software/projects/IN/boards/65)
- [Git semantic commits and branch names](https://redberry.gitbook.io/resources/git-is-semantikuri-komitebi)
- [Figma design](https://www.figma.com/file/TCHUOZrxXaa8jaD435rDvn/Redberry-internal-software?node-id=13%3A48)
