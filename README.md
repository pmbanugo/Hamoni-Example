# Hamoni Example web app

A sample web app written in vanillaJS to show how to use
[Hamoni](https://www.producthunt.com/upcoming/hamoni) in JavaScript

![demo](https://github.com/pmbanugo/Hamoni-Example/blob/master/hamoni-sprint-1-demo.gif)

Hamoni is currently being developed as a project for ProductHunt Hackathon.
[Subscribe for insiders update](https://www.producthunt.com/upcoming/hamoni)

[How to setup and run this example](https://github.com/pmbanugo/Hamoni-Example#how-to-setup-and-run-the-example)

[How to use Hamoni JS client](https://github.com/pmbanugo/Hamoni-js-client#how-to-use-hamoni-js-client)

# How to setup and run the example

This is a web app built HTML and jQuery. It allows you to chat with another
user, with the assumption that you know the user's name and the other user also
knows your name. The html page is served from an express server so you'll need
to install this dependency. Run the following command to install the dependency
and start the application server:

```
$ npm install
$ npm start
```

Each application is identified by an applicationId which you will pass as an
argument when initialising the Hamoni client. Open `index.js` located in
`src/public` and change the value for the variable **appId** to a unique value
to identify your application. Since Hamoni is currently being developed, I
haven't much security to it. I'm focused on building an easy to use API and will
add security later. In the future, it'll use either cookie or token based
authentication to validate clients and each request they make to the server. So
you can put any value you want there at the moment, open the application in the
browser, and start chatting.

If a user is new to your application and wants to chat with another user who
hasn't yet used the app, they should wait for the username/identity of the other
user be collected and the client initialised. This means, after their username
is collected, upon which it'll show a prompt requesting for the other user's
name (friend name), they should wait for the other user to open the app and
enter their username then get the same friend name prompt. Once this happens,
they should enter the friend name and the connection will be initiated. For
users who have user your application before, they don't need to go through this
process again.
