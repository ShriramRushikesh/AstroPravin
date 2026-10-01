#!/bin/bash

# AstroPravin Health Check Script
# Validates production site up-time and API health
# Run this via a daily cron job

LOG_FILE="../logs/health-$(date +%Y-%m-%d).log"
FRONTEND_URL="https://astropravin.com"
API_URL="https://api.astropravin.com/api/visits"

echo "========================================" >> "$LOG_FILE"
echo "Health Check started at $(date)" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

# 1. Check Frontend Health
echo "Checking frontend ($FRONTEND_URL)..." >> "$LOG_FILE"
FRONTEND_STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" -m 10 "$FRONTEND_URL")

if [ "$FRONTEND_STATUS" == "200" ]; then
    echo "✅ Frontend is UP (Status: 200)" >> "$LOG_FILE"
else
    echo "❌ Frontend is DOWN or SLOW (Status: $FRONTEND_STATUS)" >> "$LOG_FILE"
fi

# 2. Check API Backend Health (Cold Start Test)
echo "Checking API backend ($API_URL)..." >> "$LOG_FILE"
# Timeout set to 90s to account for Render free-tier cold starts
API_STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" -m 90 "$API_URL")

if [ "$API_STATUS" == "200" ]; then
    echo "✅ API Backend is UP (Status: 200)" >> "$LOG_FILE"
else
    echo "❌ API Backend is DOWN (Status: $API_STATUS)" >> "$LOG_FILE"
fi

echo "========================================" >> "$LOG_FILE"
echo "Health Check completed at $(date)" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"
