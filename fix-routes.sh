#!/bin/bash

# Script per correggere i tipi dei parametri nelle route API di Next.js 15

echo "Correggendo i tipi dei parametri nelle route API..."

# Lista dei file da correggere
files=(
  "app/api/v1/user/terms/[id]/route.ts"
  "app/api/v1/user/[role]/[userId]/route.ts"
  "app/api/v1/bookings/[bookingId]/route.ts"
  "app/api/v1/consumer/[consumerId]/route.ts"
  "app/api/v1/onboard/[userId]/[role]/route.ts"
  "app/api/v1/vigil/[vigilId]/route.ts"
  "app/api/v1/services/[serviceId]/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Correggendo $file..."
    
    # Correzione per singolo parametro string
    sed -i '' 's/{ params: { \([a-zA-Z]*\): string } }/{ params: Promise<{ \1: string }> }/g' "$file"
    
    # Correzione per due parametri string
    sed -i '' 's/{ params: { \([a-zA-Z]*\): string; \([a-zA-Z]*\): string } }/{ params: Promise<{ \1: string; \2: string }> }/g' "$file"
    
    # Correzione per parametri con RolesEnum
    sed -i '' 's/{ params: { \([a-zA-Z]*\): string; \([a-zA-Z]*\): RolesEnum } }/{ params: Promise<{ \1: string; \2: RolesEnum }> }/g' "$file"
    sed -i '' 's/{ params: { \([a-zA-Z]*\): RolesEnum; \([a-zA-Z]*\): string } }/{ params: Promise<{ \1: RolesEnum; \2: string }> }/g' "$file"
    
    # Correzione per l'utilizzo dei parametri
    sed -i '' 's/const { \([^}]*\) } = context\.params;/const { \1 } = await context.params;/g' "$file"
    sed -i '' 's/const \([a-zA-Z]*\) = context\.params\.\([a-zA-Z]*\);/const { \2 } = await context.params; const \1 = \2;/g' "$file"
    
  else
    echo "File $file non trovato"
  fi
done

echo "Correzione completata!"
