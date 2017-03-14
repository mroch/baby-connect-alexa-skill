# Baby Connect for Alexa

An Alexa skill interacting with [Baby Connect](https://www.baby-connect.com/).

## Usage

- "Alexa, tell Baby Connect to log a poopy diaper"
- "Alexa, tell Baby Connect that John had a wet diaper"
- "Alexa, tell Baby Connect that Jill is sleeping"
- "Alexa, tell Baby Connect that Jill is awake"

## Supported Actions

- poopy, wet, poopy and wet, or dry diapers
- started sleeping, woke up

See `SampleUtterances.txt` for a list of things you can say.

## Installation

This skill uses an AWS Lambda function, so you need an AWS account. It's also not an official, published skill so you need an Amazon Developer account to create a "development" skill. It communicates with Baby Connect via the [`baby-connect`](https://github.com/mroch/baby-connect) library.

### Dependencies
- Run `yarn install` to download the dependencies (install [Yarn](https://yarnpkg.com/) if you haven't already)
- Run `yarn run zip` to create `baby_connect_skill.zip`

### Lambda function
- Create a `nodejs4.3` Lambda function in `us-east`
- Upload `baby_connect_skill.zip` as the code for your Lambda function
- Define these environment variables:
  - `BABY_CONNECT_EMAIL`: your login email
  - `BABY_CONNECT_PASSWORD`: your login password
  - `BABY_CONNECT_TIMEZONE`: your timezone name, like "America/Los_Angeles" ([full list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))
  - `BABY_CONNECT_DEVICE_ID`: a UUID, generate one [here](https://www.uuidgenerator.net/version4)
  - `BABY_CONNECT_DEFAULT_CHILD`: your favorite child (lol), used when you say things like "log a wet diaper" with no child
- Under "Triggers", add "Alexa Skills Kit". If it's not an option, you didn't use `us-east`!

### Alexa Skill
- In the [Amazon Developer Console](https://developer.amazon.com/edw/home.html), click "Get Started" on "Alexa Skills Kit"
- Click "Add a New Skill", use these settings:
  - Skill Type: Custom Interaction Model
  - Name: Baby Connect
  - Invocation Name: Baby Connect (or whatever)
- Under "Interaction Model", upload the contents of the files in `speechAssets` in the appropriate fields. For `LIST_OF_CHILDREN`, put in your own kids' names.
- Under "Configuration", choose "AWS Lambda ARN" and paste the ARN found in the top right corner of the page when viewing your Lambda function in the AWS console. For "Account Linking", choose "No". Baby Connect doesn't provide an OAuth endpoint so we log in using the environment variables above.
- That's it. Everything saves as you go, so you don't need to (read: can't) complete the rest of the steps.

### Testing

It should already be enabled on your Alexa account, so try "Alexa, tell Baby Connect...". See `SampleUtterances.txt` for a list of things you can try.

## TODO

There are many missing features, which I'll track in the [Issues](https://github.com/mroch/baby-connect-alexa-skill/issues).
