# Heroku Deployment Guide

## Prerequisites
- Heroku CLI installed
- Git repository initialized
- Heroku account

## Environment Variables Required

Set these on Heroku using `heroku config:set` or the Heroku dashboard:

### Required Variables
```bash
# Messari API Key
MESSARI_API_KEY=your_messari_api_key_here

# OpenAI API Key  
OPENAI_API_KEY=your_openai_api_key_here

# Slack Bot Token
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token-here

# Slack Channel ID
SLACK_CHANNEL_ID=your-slack-channel-id-here
```

## Deployment Steps

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create Heroku App
```bash
heroku create your-crypto-news-bot
```

### 3. Set Environment Variables
```bash
heroku config:set MESSARI_API_KEY=f4e1aead-3412-446e-abac-8819357d6075
heroku config:set OPENAI_API_KEY=your_openai_key
heroku config:set SLACK_BOT_TOKEN=your_slack_token
heroku config:set SLACK_CHANNEL_ID=your_channel_id
```

### 4. Deploy
```bash
git add .
git commit -m "Deploy crypto news bot to Heroku"
git push heroku main
```

### 5. Scale and Test
```bash
# Scale to 1 dyno (if needed)
heroku ps:scale web=1

# Check logs
heroku logs --tail

# Run manually
heroku run node index.js
```

## Scheduling (Optional)

To run the bot automatically every day, install Heroku Scheduler:

```bash
heroku addons:create scheduler:standard
heroku addons:open scheduler
```

Then add a job:
- **Task:** `node index.js`
- **Dyno size:** Standard-1X
- **Frequency:** Daily at 9:00 AM UTC

## Monitoring

Check your app status:
```bash
heroku ps
heroku logs --tail
```

## Troubleshooting

- Check environment variables: `heroku config`
- View logs: `heroku logs --tail`
- Restart app: `heroku restart` 