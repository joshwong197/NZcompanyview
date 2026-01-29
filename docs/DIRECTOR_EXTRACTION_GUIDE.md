# NZBN API: Director Extraction Guide
**Complete Step-by-Step Instructions for Pulling Company Directors**

This document provides comprehensive instructions for extracting director information from the NZBN (New Zealand Business Number) API for company entities.

---

## 🎯 Overview

To get directors for a company in the NZBN Register, you need to:
1. Search for and identify the company entity
2. Fetch the roles associated with that entity's NZBN
3. Filter roles to show only current directors
4. Handle edge cases (corporate appointments, sole directors, etc.)

---

## 📡 API Endpoints

### Production Environment
**Base URL:** `https://api.business.govt.nz/gateway/nzbn/v5/`

### Sandbox Environment  
**Base URL:** `https://api.business.govt.nz/sandbox/nzbn/v5/`

### Key Endpoints

| Purpose | Endpoint Pattern | Example |
|---------|-----------------|---------|
| **Search Entities** | `{base}/entities?search-term={query}` | `https://api.business.govt.nz/gateway/nzbn/v5/entities?search-term=Fletcher` |
| **Get Entity Details** | `{base}/entities/{nzbn}` | `https://api.business.govt.nz/gateway/nzbn/v5/entities/9429000091738` |
| **Get Entity Roles** | `{base}/entities/{nzbn}/roles` | `https://api.business.govt.nz/gateway/nzbn/v5/entities/9429000091738/roles` |

---

## 🔑 Authentication

All API requests require an API subscription key passed in the header:

```http
Ocp-Apim-Subscription-Key: YOUR_API_KEY_HERE
Accept: application/json
```

> **Important:** Production and Sandbox environments use **different API keys**. Make sure you use the correct key for each environment.

---

## 📋 Step-by-Step Implementation

### Step 1: Search for the Company

Make a GET request to search for entities:

```javascript
const searchUrl = `https://api.business.govt.nz/gateway/nzbn/v5/entities?search-term=Fletcher%20Building`;

const response = await fetch(searchUrl, {
  method: 'GET',
  headers: {
    'Ocp-Apim-Subscription-Key': YOUR_API_KEY,
    'Accept': 'application/json'
  }
});

const data = await response.json();
// Returns: { items: [...], totalItems: number }
```

**Response Structure:**
```json
{
  "items": [
    {
      "nzbn": "9429000091738",
      "entityName": "FLETCHER BUILDING LIMITED",
      "entityStatusDescription": "Registered",
      "entityTypeDescription": "NZ Limited Company",
      "sourceRegister": "COMPANIES",
      "sourceRegisterUniqueId": "128597"
    }
  ],
  "totalItems": 1
}
```

### Step 2: Extract the NZBN

From the search results, identify the correct entity and extract its 13-digit NZBN:

```javascript
const entity = data.items[0];
const nzbn = entity.nzbn; // e.g., "9429000091738"
```

> **Rule:** Only proceed with director extraction if `entityTypeDescription` contains "company" (case-insensitive). Trusts, partnerships, and sole traders use different role types.

### Step 3: Fetch All Roles for the Entity

Make a GET request to the roles endpoint:

```javascript
const rolesUrl = `https://api.business.govt.nz/gateway/nzbn/v5/entities/${nzbn}/roles`;

const rolesResponse = await fetch(rolesUrl, {
  method: 'GET',
  headers: {
    'Ocp-Apim-Subscription-Key': YOUR_API_KEY,
    'Accept': 'application/json'
  }
});

const rolesData = await rolesResponse.json();
```

**Expected Response Structure:**

The API may return roles in different formats. Handle all these cases:

```javascript
// Case 1: Direct array
let roles = [];
if (Array.isArray(rolesData)) {
  roles = rolesData;
}
// Case 2: Nested in 'roles' property
else if (rolesData && Array.isArray(rolesData.roles)) {
  roles = rolesData.roles;
}
// Case 3: Nested in 'items' property
else if (rolesData && Array.isArray(rolesData.items)) {
  roles = rolesData.items;
}
```

**Role Object Structure:**
```json
{
  "roleType": "DIR",
  "roleTypeDescription": "Director",
  "roleStatus": "Current",
  "rolePerson": {
    "firstName": "John",
    "middleNames": "Michael",
    "lastName": "Smith"
  },
  "startDate": "2020-01-15",
  "endDate": null
}
```

### Step 4: Filter for Current Directors Only

Apply these filtering rules to extract only current directors:

```javascript
const currentDirectors = roles.filter(role => {
  // RULE 1: Exclude roles with an endDate
  if (role.endDate && role.endDate.trim().length > 0) {
    return false;
  }

  // RULE 2: Match director role types
  const roleType = (role.roleType || '').toLowerCase();
  const roleDesc = (role.roleTypeDescription || '').toLowerCase();

  // Check if role type or description contains "director" OR matches "DIR" code
  if (roleType.includes('director') || roleDesc.includes('director') || roleType === 'dir') {
    return true;
  }

  return false;
});
```

### Step 5: Extract Director Names

Handle both individual persons and corporate appointments:

```javascript
const directors = currentDirectors.map(role => {
  let name = '';
  let isCorporate = false;

  if (role.rolePerson) {
    // Individual director
    const { firstName, lastName, middleNames, otherNames } = role.rolePerson;
    const middle = middleNames || otherNames;
    
    // Construct full name
    name = [firstName, middle, lastName]
      .filter(part => part && part.trim().length > 0)
      .join(' ');
      
  } else if (role.roleEntity) {
    // Corporate director (a company appointed as director)
    name = role.roleEntity.entityName || 'Unknown Entity';
    isCorporate = true;
  } else {
    name = 'Unknown Name';
  }

  return {
    name,
    isCorporate,
    startDate: role.startDate
  };
});
```

---

## ⚠️ Important Rules & Edge Cases

### RoleType Codes for Companies

When filtering for **companies only**, use these roleType values:

| Role Type Code | Description | Include? |
|---------------|-------------|----------|
| `DIR` | Director | ✅ YES |
| `DIRECTOR` | Director (alternative format) | ✅ YES |
| Any type containing "director" | Director variations | ✅ YES |

### RoleType Codes for Other Entity Types

> **Note:** This guide focuses on **companies only**. If you need to support other entity types:

| Entity Type | Role Type Code | Description |
|------------|---------------|-------------|
| **Trust** | `TRU` or `TST` | Trustee |
| **Partnership** | `PTR`, `PAR`, `GP`, `LP` | Partner (various types) |
| **Sole Trader** | `SOL` or `ST` | Sole Trader |

### Filtering Logic

```javascript
// For COMPANIES only:
const isCurrentDirector = (role) => {
  // Must NOT have an end date
  if (role.endDate && role.endDate.trim().length > 0) {
    return false;
  }

  // Must match director role type
  const typeCode = (role.roleType || '').toLowerCase();
  const typeDesc = (role.roleTypeDescription || '').toLowerCase();
  
  return typeCode === 'dir' || 
         typeCode.includes('director') || 
         typeDesc.includes('director');
};
```

### Handling Corporate Appointments

Some companies appoint other companies as directors. Detect this scenario:

```javascript
if (role.rolePerson) {
  // Individual person is the director
  console.log('Individual director');
} else if (role.roleEntity) {
  // Another company is appointed as director
  console.log('Corporate appointment');
  console.log('Company NZBN:', role.roleEntity.nzbn);
  console.log('Company Name:', role.roleEntity.entityName);
}
```

### Detecting Sole Directors

If there is exactly one current director, flag it as a sole director situation:

```javascript
const isSoleDirector = currentDirectors.length === 1;

if (isSoleDirector) {
  console.log('⚠️ This company has only one director (Sole Director)');
}
```

---

## 🔧 Complete Implementation Example

```javascript
/**
 * Fetches current directors for a company entity
 * @param {string} nzbn - The 13-digit NZBN of the company
 * @param {string} apiKey - NZBN API subscription key
 * @param {boolean} isSandbox - Whether to use sandbox (true) or production (false)
 * @returns {Promise<Array>} Array of director objects
 */
async function fetchCompanyDirectors(nzbn, apiKey, isSandbox = false) {
  // 1. Determine endpoint
  const baseUrl = isSandbox 
    ? 'https://api.business.govt.nz/sandbox/nzbn/v5'
    : 'https://api.business.govt.nz/gateway/nzbn/v5';
  
  const rolesUrl = `${baseUrl}/entities/${nzbn}/roles`;

  // 2. Fetch roles
  const response = await fetch(rolesUrl, {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    console.warn(`Failed to fetch roles: ${response.status}`);
    return [];
  }

  const data = await response.json();

  // 3. Parse response (handle multiple formats)
  let roles = [];
  if (Array.isArray(data)) {
    roles = data;
  } else if (data && Array.isArray(data.roles)) {
    roles = data.roles;
  } else if (data && Array.isArray(data.items)) {
    roles = data.items;
  }

  // 4. Filter for current directors
  const currentDirectors = roles.filter(role => {
    // Exclude if has end date
    if (role.endDate && role.endDate.trim().length > 0) {
      return false;
    }

    // Include if matches director role type
    const typeCode = (role.roleType || '').toLowerCase();
    const typeDesc = (role.roleTypeDescription || '').toLowerCase();
    
    return typeCode === 'dir' || 
           typeCode.includes('director') || 
           typeDesc.includes('director');
  });

  // 5. Extract director information
  const directors = currentDirectors.map(role => {
    let name = '';
    let isCorporate = false;

    if (role.rolePerson) {
      const { firstName, lastName, middleNames, otherNames } = role.rolePerson;
      const middle = middleNames || otherNames;
      
      name = [firstName, middle, lastName]
        .filter(part => part && part.trim().length > 0)
        .join(' ');
        
    } else if (role.roleEntity) {
      name = role.roleEntity.entityName || 'Unknown Entity';
      isCorporate = true;
    } else {
      name = 'Unknown Name';
    }

    return {
      name,
      isCorporate,
      roleType: role.roleType,
      roleTypeDescription: role.roleTypeDescription,
      startDate: role.startDate
    };
  });

  return directors;
}

// USAGE EXAMPLES:

// Production
const directors = await fetchCompanyDirectors(
  '9429000091738', 
  'your-prod-api-key-here', 
  false
);

// Sandbox
const testDirectors = await fetchCompanyDirectors(
  '9429000091738', 
  'your-sandbox-api-key-here', 
  true
);

console.log('Directors:', directors);
// Output: [{ name: "John Michael Smith", isCorporate: false, ... }]
```

---

## 📊 Environment-Specific Configuration

### Production
```javascript
const PROD_CONFIG = {
  baseUrl: 'https://api.business.govt.nz/gateway/nzbn/v5',
  apiKey: process.env.NZBN_PROD_API_KEY,
  isSandbox: false
};
```

### Sandbox
```javascript
const SANDBOX_CONFIG = {
  baseUrl: 'https://api.business.govt.nz/sandbox/nzbn/v5',
  apiKey: process.env.NZBN_SANDBOX_API_KEY,
  isSandbox: true
};
```

---

## ✅ Validation Checklist

Before deploying your implementation, verify:

- [ ] You are using the correct API key for the environment (prod/sandbox)
- [ ] You filter out roles where `endDate` is populated
- [ ] You check both `roleType` and `roleTypeDescription` for "director"/"DIR"
- [ ] You handle both `rolePerson` (individuals) and `roleEntity` (corporate appointments)
- [ ] You construct full names from firstName, middleNames/otherNames, and lastName
- [ ] You handle all three possible response formats (array, roles array, items array)
- [ ] You detect and flag sole director situations (length === 1)
- [ ] You only apply this logic to companies (not trusts, partnerships, or sole traders)

---

## 🚨 Common Pitfalls

1. **Using Production Key with Sandbox URL (or vice versa)**
   - Solution: Match the key to the environment explicitly

2. **Not filtering out historical directors**
   - Solution: Always exclude roles where `endDate` is not null/empty

3. **Only checking `roleType` and missing variations**
   - Solution: Check both `roleType` AND `roleTypeDescription`

4. **Assuming response is always an array**
   - Solution: Handle `roles`, `items`, and direct array formats

5. **Not handling corporate appointments**
   - Solution: Check for both `rolePerson` and `roleEntity`

6. **Applying director logic to non-company entities**
   - Solution: Only use this for entities where `entityTypeDescription` contains "company"

---

## 📚 Quick Reference

### Essential Role Object Properties
- `roleType`: Short code (e.g., "DIR")
- `roleTypeDescription`: Full description (e.g., "Director")
- `roleStatus`: Usually "Current" for active roles
- `rolePerson`: Object with firstName, lastName, middleNames, otherNames
- `roleEntity`: Object with entityName, nzbn (for corporate appointments)
- `startDate`: When the role started (ISO date string)
- `endDate`: When the role ended (null or empty for current roles)

### Key Filtering Rule
```javascript
isCurrentDirector = (role.endDate === null || role.endDate === '') 
                    && (role.roleType === 'DIR' || contains 'director')
```

---

*This guide is based on NZBN API v5 and tested with both production and sandbox environments as of January 2026.*
