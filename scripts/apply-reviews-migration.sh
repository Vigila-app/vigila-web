#!/bin/bash

# Script to apply the reviews migration to Supabase
# Make sure you have supabase CLI installed and configured

echo "Applying reviews system migration..."

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Apply the migration
supabase db push

if [ $? -eq 0 ]; then
    echo "✅ Reviews migration applied successfully!"
    echo ""
    echo "The following have been created:"
    echo "- reviews table with proper constraints and indexes"
    echo "- Row Level Security policies for proper access control"
    echo "- Utility functions for rating statistics"
    echo ""
    echo "You can now use the reviews system in your application."
else
    echo "❌ Migration failed. Please check the error above."
    exit 1
fi
