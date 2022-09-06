# Crazy Picasso

This repository is created by copying the code base from the private repository in [UTSCC09/crazy-picasso](https://github.com/UTSCC09/crazy-picasso).

## Team members

1. Aaron Jacob Tan
2. Hyun Woo (Eddie) Shin

## Project Description

Crazy Picasso is a web-based multiplayer drawing and guessing game. Once players create accounts and log into the game, they either join a public room to play with random players or create/join private rooms to play with friends with the same access cdoe.

When the game begins, one of the players draws a chosen word and the rest of the players guess what the word is for each timed round. Guessing points are awarded based on how fast players guess the word successfully within the time, and the first player who guesses the word correctly would be awarded the largest guessing point.

## Tech Stack Design

<p align="center">
<img src="https://user-images.githubusercontent.com/41933169/188720354-5ba49140-1ea4-4f74-b992-01b8098bbffc.png" width="500">
</p>

## Main Features and Technologies

<p align="center">
<img src="https://user-images.githubusercontent.com/41933169/188714907-936fb518-c049-485b-be98-921095db8c51.png" width="600">
</p>

### Frontend Design and Animations

The project mainly used React.js to build up the frontend structure and also used the components from Material UI and applied several animation effects from Animate.css. Using those external libraries will enhance the experience of users interacting with the game.

### Real-Time Interaction

The main feature of Crazy Picasso is for players to interact with other players in real-time. The guessers will be able to see what the drawer is drawing on the canvas and guessers will be able to enter their word guesses in real-time on the chat. On top of the chat feature, players will also be able to turn on their voice and video while playing the game to have face-to-face real-time communication with other players if they want.

### Login with Google

New users can sign up the game with their Google accounts and send messages to their friends to invite them to join a private room.

### Cloud-based Email Delivery

Sendgrid API was used to set up an automatic emailing service to the new players just joined the app.

### Deployment

- We deployed our container web application on Amazon Lightsail.
- Nginx is our reverse proxy.
- Docker images: Nginx, Express Backend Image, React Frontend Image, MongoDB Image
- Our Docker images are deployed into an Amazon Lightsail container service to be able to run on AWS infrastructure.
