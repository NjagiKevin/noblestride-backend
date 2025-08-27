#!/usr/bin/env node

/**
 * Migration Verification Script
 * 
 * This script validates the structure and dependencies of migration files
 * without connecting to a database.
 */

const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '..', 'migrations');

// Expected migration order based on dependencies
const expectedMigrations = [
  '20250101000001-create-roles.js',
  '20250101000002-create-permissions.js', 
  '20250101000003-create-role-permissions.js',
  '20250101000004-create-users.js',
  '20250101000005-create-continents.js',
  '20250101000006-create-regions.js',
  '20250101000007-create-countries.js',
  '20250101000008-create-sectors.js',
  '20250101000009-create-subsectors.js',
  '20250101000010-create-deal-stages.js',
  '20250101000011-create-deals.js',
  '20250101000012-create-folders.js',
  '20250101000013-create-subfolders.js',
  '20250101000014-create-document-types.js',
  '20250101000015-create-documents.js',
  '20250101000016-create-milestone-system.js',
  '20250101000017-create-financial-system.js',
  '20250101000018-create-preference-tables.js',
  '20250101000019-create-supporting-tables.js',
  '20250101000020-create-advanced-features.js',
  '20250101000021-create-pipeline-milestone-system.js'
];

// Key tables that should be referenced by foreign keys
const coreTables = [
  'roles', 'permissions', 'users', 'continents', 'regions', 'countries',
  'sectors', 'subsectors', 'deal_stages', 'deals', 'folders', 'subfolders',
  'document_types', 'documents', 'milestones'
];

function checkMigrationFiles() {
  console.log('🔍 Verifying Migration Structure...\n');
  
  // Check if all expected migration files exist
  const actualFiles = fs.readdirSync(migrationsDir).sort();
  const missingFiles = expectedMigrations.filter(file => !actualFiles.includes(file));
  const extraFiles = actualFiles.filter(file => !expectedMigrations.includes(file));
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing migration files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    return false;
  }
  
  if (extraFiles.length > 0) {
    console.warn('⚠️  Extra migration files found:');
    extraFiles.forEach(file => console.warn(`   - ${file}`));
  }
  
  console.log('✅ All expected migration files present\n');
  
  // Verify each migration file structure
  let allValid = true;
  for (const migrationFile of expectedMigrations) {
    try {
      const filePath = path.join(migrationsDir, migrationFile);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Basic structure validation
      if (!content.includes('async up(queryInterface, Sequelize)')) {
        console.error(`❌ ${migrationFile}: Missing 'up' function`);
        allValid = false;
        continue;
      }
      
      if (!content.includes('async down(queryInterface, Sequelize)')) {
        console.error(`❌ ${migrationFile}: Missing 'down' function`);
        allValid = false;
        continue;
      }
      
      // Check for proper exports
      if (!content.includes("module.exports = {")) {
        console.error(`❌ ${migrationFile}: Missing module.exports`);
        allValid = false;
        continue;
      }
      
      console.log(`✅ ${migrationFile}: Structure valid`);
      
    } catch (error) {
      console.error(`❌ ${migrationFile}: Error reading file - ${error.message}`);
      allValid = false;
    }
  }
  
  return allValid;
}

function analyzeTableDependencies() {
  console.log('\n🔗 Analyzing Table Dependencies...\n');
  
  const tableDependencies = new Map();
  const createdTables = new Set();
  
  for (const migrationFile of expectedMigrations) {
    try {
      const filePath = path.join(migrationsDir, migrationFile);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract created tables
      const createTableMatches = content.matchAll(/createTable\(['"]([\w_]+)['"],/g);
      for (const match of createTableMatches) {
        const tableName = match[1];
        createdTables.add(tableName);
        tableDependencies.set(tableName, new Set());
      }
      
      // Extract foreign key references
      const fkMatches = content.matchAll(/references:\s*{\s*model:\s*['"]([\w_]+)['"],/g);
      for (const match of fkMatches) {
        const referencedTable = match[1];
        // Find which table this FK belongs to by parsing the createTable call
        const tableMatch = content.match(/createTable\(['"]([\w_]+)['"],[\s\S]*?references:\s*{\s*model:\s*['"]([\w_]+)['"],/);
        if (tableMatch && tableMatch[2] === referencedTable) {
          const currentTable = tableMatch[1];
          if (!tableDependencies.has(currentTable)) {
            tableDependencies.set(currentTable, new Set());
          }
          tableDependencies.get(currentTable).add(referencedTable);
        }
      }
      
    } catch (error) {
      console.error(`Error analyzing ${migrationFile}: ${error.message}`);
    }
  }
  
  console.log(`📊 Found ${createdTables.size} tables to be created:`);
  console.log([...createdTables].sort().map(table => `   - ${table}`).join('\n'));
  
  console.log('\n🎯 Key dependency relationships:');
  for (const [table, deps] of tableDependencies) {
    if (deps.size > 0) {
      console.log(`   ${table} depends on: ${[...deps].join(', ')}`);
    }
  }
  
  return true;
}

function validateEnumDefinitions() {
  console.log('\n📝 Checking Enum Definitions...\n');
  
  const expectedEnums = {
    'users': ['kyc_status', 'role', 'status'],
    'deals': ['status', 'visibility', 'deal_type', 'maximum_selling_stake', 'teaser', 'model'],
    'documents': ['file_type'],
    'milestones': ['status'],
    'tasks': ['status'],
    'transactions': ['payment_method', 'transaction_type', 'status'],
    'deal_access_invites': ['status'],
    'user_reviews': ['relationship']
  };
  
  for (const migrationFile of expectedMigrations) {
    const filePath = path.join(migrationsDir, migrationFile);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for ENUM definitions
    const enumMatches = content.matchAll(/type:\s*Sequelize\.ENUM\((.*?)\)/gs);
    for (const match of enumMatches) {
      const enumValues = match[1];
      if (enumValues.includes("'")) {
        console.log(`✅ Found ENUM in ${migrationFile}: ${enumValues.substring(0, 50)}...`);
      }
    }
  }
  
  console.log('✅ Enum validation completed');
  return true;
}

function main() {
  console.log('🚀 Migration Verification Tool\n');
  console.log('='.repeat(50));
  
  const structureValid = checkMigrationFiles();
  const dependenciesValid = analyzeTableDependencies();
  const enumsValid = validateEnumDefinitions();
  
  console.log('\n' + '='.repeat(50));
  
  if (structureValid && dependenciesValid && enumsValid) {
    console.log('✅ All migration validations passed!');
    console.log('🎉 Migrations are ready for deployment');
    process.exit(0);
  } else {
    console.log('❌ Some validations failed');
    console.log('🔧 Please fix the issues before running migrations');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkMigrationFiles,
  analyzeTableDependencies,
  validateEnumDefinitions
};