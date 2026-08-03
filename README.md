# Skill Sensei

Build a production-quality AI learning platform called skill sensei. This is not a video platform, LMS, or quiz app. It is an immersive, interactive lesson engine that teaches real-world skills by demonstrating each action from a realistic first-person perspective.



The primary goal is to make the learner feel like they are standing beside a real expert instructor.



The experience must look realistic, not cartoonish, game-like, or illustrated.



## Core Experience



Every lesson takes place inside a realistic environment such as:



- Automotive garage

- Professional kitchen

- Woodworking shop

- Construction site

- Electronics workbench

- Home workshop

- Medical lab

- Trade environment



Use photorealistic images or high-quality 3D scenes whenever possible.



The camera represents the learner's eyes.



## Interactive Learning



Every important object in the lesson is interactive.



Examples:



Engine



Dipstick



Oil Filter



Drain Plug



Battery



Alternator



Spark Plug



Cooking



Flour



Eggs



Whisk



Mixer



Oven



Knife



Pan



When the learner taps an object:



The instructor demonstrates ONLY that one action.



The lesson immediately pauses afterward.



The learner performs that action before continuing.



Never autoplay an entire lesson.



## Demonstrations



Do NOT teleport hands.



Do NOT display static hand poses.



Every action must be one continuous animation.



Example:



Reach toward wrench.



Wrap fingers naturally.



Lift wrench.



Move toward bolt.



Place wrench on bolt.



Rotate wrench realistically.



Bolt visibly turns.



Remove wrench.



Return hand naturally.



Pause.



Objects must visibly react.



Hands must physically interact with every object.



Use realistic timing.



Professional techniques.



Natural movement.



## AI Instructor



The instructor always knows:



Current lesson



Current object



Current step



Current progress



Current camera position



The learner can interrupt anytime and ask:



What are you doing?



Why?



Can you explain?



Show again.



Slow down.



What happens if I skip this?



How do I know I did it correctly?



After answering, immediately continue from the same lesson position.



## Lesson Modes



Interactive Mode



Learner chooses every object.



Instructor performs one action.



Pause.



Auto Demonstrate



Instructor chooses next required step.



Demonstrates one action.



Immediately pauses.



Display:



Continue



Replay Step



Slow Motion



Ask Instructor



Exit Auto Mode



Never automatically play the entire lesson.



## Camera Controls



Zoom



Rotate



Pan



Move around object



Transparent mode



Cutaway mode



Exploded view



Highlight active object



Replay current step



Slow motion replay



## User Interface



Modern



Minimal



Premium



Dark mode



Large lesson viewport



Small floating controls



Simple navigation



Step progress indicator



Voice controls



Search lessons



Bookmarks



Favorites



AI chat assistant



Progress tracking



Achievements



## Lesson Library



Support unlimited lesson categories including:



Automotive



Cooking



DIY



Woodworking



Electrical



Plumbing



Mechanics



Construction



Electronics



Gardening



Crafts



Trades



Fitness



Medical



Science



Music



Technology



Any teachable skill.



## User Accounts



Authentication



Profiles



Saved lessons



Continue where left off



Achievements



Certificates



Bookmarks



Lesson history



Favorites



## AI Features



Natural language instructor



Voice interaction



Context-aware answers



Adaptive learning



Difficulty adjustment



Mistake detection



Personalized recommendations



## Future Ready



Design the platform so future versions can support:



Real-time AI video generation



Photorealistic hand animations



Interactive 3D environments



AR



VR



Motion tracking



Computer vision



Object recognition



Voice coaching



Live instructor avatars



## Visual Style



Do not use cartoon graphics.



Do not use flat illustrations.



Do not make the lessons resemble a game.



Aim for the realism of standing in a real garage, kitchen, or workshop with an experienced instructor.



The learner should feel like they are physically present, observing an expert perform one action at a time before practicing it themselves.



Build this as a scalable SaaS platform with clean architecture, responsive design, reusable lesson components, and production-quality code. The platform should be capable of growing into the world's largest interactive AI learning platform for real-world skills.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://skill-sensei-live.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9fc22f9c-cf23-4839-9ba1-99b455c6561a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
