#!/bin/bash

# Krishi Sahayata API Connection Test Script
# This script tests all major API endpoints to ensure backend is working correctly

echo "🌾 Krishi Sahayata - API Connection Test 🌾"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend URL
BACKEND_URL="http://localhost:8000"
API_BASE="${BACKEND_URL}/api/v1"

# Test counter
PASS=0
FAIL=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
        ((PASS++))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected HTTP $expected_status, got $response)"
        ((FAIL++))
    fi
}

# Function to test endpoint with data
test_endpoint_with_data() {
    local name=$1
    local url=$2
    
    echo -n "Testing $name... "
    
    response=$(curl -s "$url" 2>/dev/null)
    
    if [ -n "$response" ] && [ "$response" != "null" ]; then
        # Check if response contains array or object
        if echo "$response" | grep -q -E '\[|\{'; then
            echo -e "${GREEN}✓ PASS${NC} (Data returned)"
            echo "  Sample: $(echo $response | jq -r 'if type=="array" then .[0].name // .[0].title // "Data present" else .message // "Data present" end' 2>/dev/null || echo "Data present")"
            ((PASS++))
        else
            echo -e "${RED}✗ FAIL${NC} (Invalid response)"
            ((FAIL++))
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (No data returned)"
        ((FAIL++))
    fi
}

echo "1. Testing Backend Health"
echo "-------------------------"
test_endpoint "Health Check" "${API_BASE}/health"
echo ""

echo "2. Testing Schemes Endpoints"
echo "----------------------------"
test_endpoint_with_data "Schemes (English)" "${API_BASE}/schemes/?language=en&active_only=true"
test_endpoint_with_data "Schemes (Hindi)" "${API_BASE}/schemes/?language=hi&active_only=true"
test_endpoint_with_data "Schemes (Gujarati)" "${API_BASE}/schemes/?language=gu&active_only=true"
echo ""

echo "3. Testing Tips Endpoints"
echo "------------------------"
test_endpoint_with_data "Tips (English)" "${API_BASE}/tips/?language=en&active_only=true"
test_endpoint_with_data "Tips (Hindi)" "${API_BASE}/tips/?language=hi&active_only=true"
test_endpoint_with_data "Tips (Gujarati)" "${API_BASE}/tips/?language=gu&active_only=true"
test_endpoint_with_data "Tips (Winter Season)" "${API_BASE}/tips/?language=en&season=winter&active_only=true"
echo ""

echo "4. Testing Weather Endpoints"
echo "---------------------------"
test_endpoint "Current Weather" "${API_BASE}/weather/current?location=Delhi,IN"
echo ""

echo "5. Database Content Check"
echo "------------------------"
echo -n "Counting schemes... "
scheme_count=$(curl -s "${API_BASE}/schemes/?language=en&active_only=true" 2>/dev/null | jq 'length' 2>/dev/null)
if [ "$scheme_count" -ge 4 ]; then
    echo -e "${GREEN}✓ PASS${NC} (Found $scheme_count schemes, expected at least 4)"
    ((PASS++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Found $scheme_count schemes, expected at least 4)"
    echo "  Run: cd backend && python seed_db.py"
fi

echo -n "Counting tips... "
tip_count=$(curl -s "${API_BASE}/tips/?language=en&active_only=true" 2>/dev/null | jq 'length' 2>/dev/null)
if [ "$tip_count" -ge 4 ]; then
    echo -e "${GREEN}✓ PASS${NC} (Found $tip_count tips, expected at least 4)"
    ((PASS++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Found $tip_count tips, expected at least 4)"
    echo "  Run: cd backend && python seed_db.py"
fi
echo ""

echo "6. CORS Configuration Check"
echo "--------------------------"
echo -n "Testing CORS headers... "
cors_header=$(curl -s -I -H "Origin: http://localhost:8080" "${API_BASE}/health" 2>/dev/null | grep -i "access-control-allow-origin")
if [ -n "$cors_header" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "  $cors_header"
    ((PASS++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (CORS headers not found - might need CORS middleware)"
fi
echo ""

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "Passed: ${GREEN}$PASS${NC}"
echo -e "Failed: ${RED}$FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! Backend is working correctly.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start frontend: npm run dev"
    echo "2. Open http://localhost:8080"
    echo "3. Check browser console for [ComponentName] debug logs"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please check the backend configuration.${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Ensure PostgreSQL is running"
    echo "2. Check backend/.env configuration"
    echo "3. Run database migrations: cd backend && alembic upgrade head"
    echo "4. Seed the database: cd backend && python seed_db.py"
    echo "5. Check backend logs: backend/logs/app.log"
    exit 1
fi
