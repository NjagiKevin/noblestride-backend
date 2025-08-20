#!/bin/bash

# This script runs all the setup scripts in the correct order.

# Run the scripts
node scripts/createSuperuser.js
node scripts/createInvestorUser.js
node scripts/addViewAllDealsPermission.js
node scripts/addViewProfilePermission.js
node scripts/assignAllPermissionsToAdmin.js
node scripts/assignInvestorPermissions.js
node scripts/getUsersWithInvestorRole.js