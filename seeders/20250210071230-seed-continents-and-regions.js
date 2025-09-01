'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Seed continents
    const continentsToSeed = [
      { name: "Africa" },
      { name: "Asia" },
      { name: "Europe" },
      { name: "North America" },
      { name: "South America" },
      { name: "Australia" },
      { name: "Antarctica" },
    ];

    const existingContinents = await queryInterface.sequelize.query(
      "SELECT continent_id, name FROM continents",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingContinentMap = new Map(existingContinents.map(c => [c.name, c.continent_id]));

    const newContinents = continentsToSeed.filter(
      continent => !existingContinentMap.has(continent.name)
    ).map(continent => ({
      ...continent,
      continent_id: Sequelize.literal("uuid_generate_v4()"),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    if (newContinents.length > 0) {
      await queryInterface.bulkInsert("continents", newContinents, {});
    }

    // Re-fetch all continents to ensure we have their IDs
    const allContinents = await queryInterface.sequelize.query(
      "SELECT continent_id, name FROM continents",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const continentIdMap = new Map(allContinents.map(c => [c.name, c.continent_id]));

    // Seed regions
    const regionsToSeed = [
      { name: "Northern Africa", continentName: "Africa" },
      { name: "West Africa", continentName: "Africa" },
      { name: "Central Africa", continentName: "Africa" },
      { name: "East Africa", continentName: "Africa" },
      { name: "South Africa", continentName: "Africa" },
      { name: "Eastern Asia", continentName: "Asia" },
      { name: "Central Asia", continentName: "Asia" },
      { name: "Southern Asia", continentName: "Asia" },
      { name: "Western Asia", continentName: "Asia" },
      { name: "Eastern Europe", continentName: "Europe" },
      { name: "Northern Europe", continentName: "Europe" },
      { name: "Southern Europe", continentName: "Europe" },
      { name: "Western Europe", continentName: "Europe" },
      { name: "Caribbean", continentName: "North America" },
      { name: "Central America", continentName: "North America" },
      { name: "Northern America", continentName: "North America" },
      { name: "South America", continentName: "South America" },
      { name: "Australia and New Zealand", continentName: "Australia" },
      { name: "Melanesia", continentName: "Australia" },
      { name: "Micronesia", continentName: "Australia" },
      { name: "Polynesia", continentName: "Australia" },
      { name: "Antarctica", continentName: "Antarctica" },
    ].map(region => ({
      region_id: Sequelize.literal("uuid_generate_v4()"),
      name: region.name,
      continent_id: continentIdMap.get(region.continentName),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const existingRegions = await queryInterface.sequelize.query(
      "SELECT name FROM regions",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingRegionNames = new Set(existingRegions.map(r => r.name));

    const newRegions = regionsToSeed.filter(
      region => !existingRegionNames.has(region.name)
    );

    if (newRegions.length > 0) {
      await queryInterface.bulkInsert("regions", newRegions, {});
    }

    // Re-fetch all regions to ensure we have their IDs
    const allRegions = await queryInterface.sequelize.query(
        "SELECT region_id, name FROM regions",
        { type: Sequelize.QueryTypes.SELECT }
      );
    const regionIdMap = new Map(allRegions.map(r => [r.name, r.region_id]));

    // Seed countries
    const countriesWithContinentAndRegion = [
        { name: "Afghanistan", code: "AF", continent: "Asia", region: "Southern Asia" },
        { name: "Albania", code: "AL", continent: "Europe", region: "Southern Europe" },
        { name: "Algeria", code: "DZ", continent: "Africa", region: "Northern Africa" },
        { name: "Andorra", code: "AD", continent: "Europe", region: "Southern Europe" },
        { name: "Angola", code: "AO", continent: "Africa", region: "Central Africa" },
        { name: "Antigua and Barbuda", code: "AG", continent: "North America", region: "Caribbean" },
        { name: "Argentina", code: "AR", continent: "South America", region: "South America" },
        { name: "Armenia", code: "AM", continent: "Asia", region: "Western Asia" },
        { name: "Australia", code: "AU", continent: "Australia", region: "Australia and New Zealand" },
        { name: "Austria", code: "AT", continent: "Europe", region: "Western Europe" },
        { name: "Azerbaijan", code: "AZ", continent: "Asia", region: "Western Asia" },
        { name: "Bahamas", code: "BS", continent: "North America", region: "Caribbean" },
        { name: "Bahrain", code: "BH", continent: "Asia", region: "Western Asia" },
        { name: "Bangladesh", code: "BD", continent: "Asia", region: "Southern Asia" },
        { name: "Barbados", code: "BB", continent: "North America", region: "Caribbean" },
        { name: "Belarus", code: "BY", continent: "Europe", region: "Eastern Europe" },
        { name: "Belgium", code: "BE", continent: "Europe", region: "Western Europe" },
        { name: "Belize", code: "BZ", continent: "North America", region: "Central America" },
        { name: "Benin", code: "BJ", continent: "Africa", region: "West Africa" },
        { name: "Bhutan", code: "BT", continent: "Asia", region: "Southern Asia" },
        { name: "Bolivia", code: "BO", continent: "South America", region: "South America" },
        { name: "Bosnia and Herzegovina", code: "BA", continent: "Europe", region: "Southern Europe" },
        { name: "Botswana", code: "BW", continent: "Africa", region: "South Africa" },
        { name: "Brazil", code: "BR", continent: "South America", region: "South America" },
        { name: "Brunei", code: "BN", continent: "Asia", region: "Eastern Asia" },
        { name: "Bulgaria", code: "BG", continent: "Europe", region: "Eastern Europe" },
        { name: "Burkina Faso", code: "BF", continent: "Africa", region: "West Africa" },
        { name: "Burundi", code: "BI", continent: "Africa", region: "East Africa" },
        { name: "Cabo Verde", code: "CV", continent: "Africa", region: "West Africa" },
        { name: "Cambodia", code: "KH", continent: "Asia", region: "Eastern Asia" },
        { name: "Cameroon", code: "CM", continent: "Africa", region: "Central Africa" },
        { name: "Canada", code: "CA", continent: "North America", region: "Northern America" },
        { name: "Central African Republic", code: "CF", continent: "Africa", region: "Central Africa" },
        { name: "Chad", code: "TD", continent: "Africa", region: "Central Africa" },
        { name: "Chile", code: "CL", continent: "South America", region: "South America" },
        { name: "China", code: "CN", continent: "Asia", region: "Eastern Asia" },
        { name: "Colombia", code: "CO", continent: "South America", region: "South America" },
        { name: "Comoros", code: "KM", continent: "Africa", region: "East Africa" },
        { name: "Congo, Democratic Republic of the", code: "CD", continent: "Africa", region: "Central Africa" },
        { name: "Congo, Republic of the", code: "CG", continent: "Africa", region: "Central Africa" },
        { name: "Costa Rica", code: "CR", continent: "North America", region: "Central America" },
        { name: "Croatia", code: "HR", continent: "Europe", region: "Southern Europe" },
        { name: "Cuba", code: "CU", continent: "North America", region: "Caribbean" },
        { name: "Cyprus", code: "CY", continent: "Asia", region: "Western Asia" },
        { name: "Czech Republic", code: "CZ", continent: "Europe", region: "Eastern Europe" },
        { name: "Denmark", code: "DK", continent: "Europe", region: "Northern Europe" },
        { name: "Djibouti", code: "DJ", continent: "Africa", region: "East Africa" },
        { name: "Dominica", code: "DM", continent: "North America", region: "Caribbean" },
        { name: "Dominican Republic", code: "DO", continent: "North America", region: "Caribbean" },
        { name: "Ecuador", code: "EC", continent: "South America", region: "South America" },
        { name: "Egypt", code: "EG", continent: "Africa", region: "Northern Africa" },
        { name: "El Salvador", code: "SV", continent: "North America", region: "Central America" },
        { name: "Equatorial Guinea", code: "GQ", continent: "Africa", region: "Central Africa" },
        { name: "Eritrea", code: "ER", continent: "Africa", region: "East Africa" },
        { name: "Estonia", code: "EE", continent: "Europe", region: "Northern Europe" },
        { name: "Eswatini", code: "SZ", continent: "Africa", region: "South Africa" },
        { name: "Ethiopia", code: "ET", continent: "Africa", region: "East Africa" },
        { name: "Fiji", code: "FJ", continent: "Australia", region: "Melanesia" },
        { name: "Finland", code: "FI", continent: "Europe", region: "Northern Europe" },
        { name: "France", code: "FR", continent: "Europe", region: "Western Europe" },
        { name: "Gabon", code: "GA", continent: "Africa", region: "Central Africa" },
        { name: "Gambia", code: "GM", continent: "Africa", region: "West Africa" },
        { name: "Georgia", code: "GE", continent: "Asia", region: "Western Asia" },
        { name: "Germany", code: "DE", continent: "Europe", region: "Western Europe" },
        { name: "Ghana", code: "GH", continent: "Africa", region: "West Africa" },
        { name: "Greece", code: "GR", continent: "Europe", region: "Southern Europe" },
        { name: "Grenada", code: "GD", continent: "North America", region: "Caribbean" },
        { name: "Guatemala", code: "GT", continent: "North America", region: "Central America" },
        { name: "Guinea", code: "GN", continent: "Africa", region: "West Africa" },
        { name: "Guinea-Bissau", code: "GW", continent: "Africa", region: "West Africa" },
        { name: "Guyana", code: "GY", continent: "South America", region: "South America" },
        { name: "Haiti", code: "HT", continent: "North America", region: "Caribbean" },
        { name: "Honduras", code: "HN", continent: "North America", region: "Central America" },
        { name: "Hungary", code: "HU", continent: "Europe", region: "Eastern Europe" },
        { name: "Iceland", code: "IS", continent: "Europe", region: "Northern Europe" },
        { name: "India", code: "IN", continent: "Asia", region: "Southern Asia" },
        { name: "Indonesia", code: "ID", continent: "Asia", region: "Eastern Asia" },
        { name: "Iran", code: "IR", continent: "Asia", region: "Southern Asia" },
        { name: "Iraq", code: "IQ", continent: "Asia", region: "Western Asia" },
        { name: "Ireland", code: "IE", continent: "Europe", region: "Northern Europe" },
        { name: "Israel", code: "IL", continent: "Asia", region: "Western Asia" },
        { name: "Italy", code: "IT", continent: "Europe", region: "Southern Europe" },
        { name: "Jamaica", code: "JM", continent: "North America", region: "Caribbean" },
        { name: "Japan", code: "JP", continent: "Asia", region: "Eastern Asia" },
        { name: "Jordan", code: "JO", continent: "Asia", region: "Western Asia" },
        { name: "Kazakhstan", code: "KZ", continent: "Asia", region: "Central Asia" },
        { name: "Kenya", code: "KE", continent: "Africa", region: "East Africa" },
        { name: "Kiribati", code: "KI", continent: "Australia", region: "Micronesia" },
        { name: "Kuwait", code: "KW", continent: "Asia", region: "Western Asia" },
        { name: "Kyrgyzstan", code: "KG", continent: "Asia", region: "Central Asia" },
        { name: "Laos", code: "LA", continent: "Asia", region: "Eastern Asia" },
        { name: "Latvia", code: "LV", continent: "Europe", region: "Northern Europe" },
        { name: "Lebanon", code: "LB", continent: "Asia", region: "Western Asia" },
        { name: "Lesotho", code: "LS", continent: "Africa", region: "South Africa" },
        { name: "Liberia", code: "LR", continent: "Africa", region: "West Africa" },
        { name: "Libya", code: "LY", continent: "Africa", region: "Northern Africa" },
        { name: "Liechtenstein", code: "LI", continent: "Europe", region: "Western Europe" },
        { name: "Lithuania", code: "LT", continent: "Europe", region: "Northern Europe" },
        { name: "Luxembourg", code: "LU", continent: "Europe", region: "Western Europe" },
        { name: "Madagascar", code: "MG", continent: "Africa", region: "East Africa" },
        { name: "Malawi", code: "MW", continent: "Africa", region: "East Africa" },
        { name: "Malaysia", code: "MY", continent: "Asia", region: "Eastern Asia" },
        { name: "Maldives", code: "MV", continent: "Asia", region: "Southern Asia" },
        { name: "Mali", code: "ML", continent: "Africa", region: "West Africa" },
        { name: "Malta", code: "MT", continent: "Europe", region: "Southern Europe" },
        { name: "Marshall Islands", code: "MH", continent: "Australia", region: "Micronesia" },
        { name: "Mauritania", code: "MR", continent: "Africa", region: "West Africa" },
        { name: "Mauritius", code: "MU", continent: "Africa", region: "East Africa" },
        { name: "Mexico", code: "MX", continent: "North America", region: "Central America" },
        { name: "Micronesia", code: "FM", continent: "Australia", region: "Micronesia" },
        { name: "Moldova", code: "MD", continent: "Europe", region: "Eastern Europe" },
        { name: "Monaco", code: "MC", continent: "Europe", region: "Western Europe" },
        { name: "Mongolia", code: "MN", continent: "Asia", region: "Eastern Asia" },
        { name: "Montenegro", code: "ME", continent: "Europe", region: "Southern Europe" },
        { name: "Morocco", code: "MA", continent: "Africa", region: "Northern Africa" },
        { name: "Mozambique", code: "MZ", continent: "Africa", region: "East Africa" },
        { name: "Myanmar", code: "MM", continent: "Asia", region: "Eastern Asia" },
        { name: "Namibia", code: "NA", continent: "Africa", region: "South Africa" },
        { name: "Nauru", code: "NR", continent: "Australia", region: "Micronesia" },
        { name: "Nepal", code: "NP", continent: "Asia", region: "Southern Asia" },
        { name: "Netherlands", code: "NL", continent: "Europe", region: "Western Europe" },
        { name: "New Zealand", code: "NZ", continent: "Australia", region: "Australia and New Zealand" },
        { name: "Nicaragua", code: "NI", continent: "North America", region: "Central America" },
        { name: "Niger", code: "NE", continent: "Africa", region: "West Africa" },
        { name: "Nigeria", code: "NG", continent: "Africa", region: "West Africa" },
        { name: "North Korea", code: "KP", continent: "Asia", region: "Eastern Asia" },
        { name: "North Macedonia", code: "MK", continent: "Europe", region: "Southern Europe" },
        { name: "Norway", code: "NO", continent: "Europe", region: "Northern Europe" },
        { name: "Oman", code: "OM", continent: "Asia", region: "Western Asia" },
        { name: "Pakistan", code: "PK", continent: "Asia", region: "Southern Asia" },
        { name: "Palau", code: "PW", continent: "Australia", region: "Micronesia" },
        { name: "Palestine", code: "PS", continent: "Asia", region: "Western Asia" },
        { name: "Panama", code: "PA", continent: "North America", region: "Central America" },
        { name: "Papua New Guinea", code: "PG", continent: "Australia", region: "Melanesia" },
        { name: "Paraguay", code: "PY", continent: "South America", region: "South America" },
        { name: "Peru", code: "PE", continent: "South America", region: "South America" },
        { name: "Philippines", code: "PH", continent: "Asia", region: "Eastern Asia" },
        { name: "Poland", code: "PL", continent: "Europe", region: "Eastern Europe" },
        { name: "Portugal", code: "PT", continent: "Europe", region: "Southern Europe" },
        { name: "Qatar", code: "QA", continent: "Asia", region: "Western Asia" },
        { name: "Romania", code: "RO", continent: "Europe", region: "Eastern Europe" },
        { name: "Russia", code: "RU", continent: "Europe", region: "Eastern Europe" },
        { name: "Rwanda", code: "RW", continent: "Africa", region: "East Africa" },
        { name: "Saint Kitts and Nevis", code: "KN", continent: "North America", region: "Caribbean" },
        { name: "Saint Lucia", code: "LC", continent: "North America", region: "Caribbean" },
        { name: "Saint Vincent and the Grenadines", code: "VC", continent: "North America", region: "Caribbean" },
        { name: "Samoa", code: "WS", continent: "Australia", region: "Polynesia" },
        { name: "San Marino", code: "SM", continent: "Europe", region: "Southern Europe" },
        { name: "Sao Tome and Principe", code: "ST", continent: "Africa", region: "Central Africa" },
        { name: "Saudi Arabia", code: "SA", continent: "Asia", region: "Western Asia" },
        { name: "Senegal", code: "SN", continent: "Africa", region: "West Africa" },
        { name: "Serbia", code: "RS", continent: "Europe", region: "Southern Europe" },
        { name: "Seychelles", code: "SC", continent: "Africa", region: "East Africa" },
        { name: "Sierra Leone", code: "SL", continent: "Africa", region: "West Africa" },
        { name: "Singapore", code: "SG", continent: "Asia", region: "Eastern Asia" },
        { name: "Slovakia", code: "SK", continent: "Europe", region: "Eastern Europe" },
        { name: "Slovenia", code: "SI", continent: "Europe", region: "Southern Europe" },
        { name: "Solomon Islands", code: "SB", continent: "Australia", region: "Melanesia" },
        { name: "Somalia", code: "SO", continent: "Africa", region: "East Africa" },
        { name: "South Africa", code: "ZA", continent: "Africa", region: "South Africa" },
        { name: "South Korea", code: "KR", continent: "Asia", region: "Eastern Asia" },
        { name: "South Sudan", code: "SS", continent: "Africa", region: "East Africa" },
        { name: "Spain", code: "ES", continent: "Europe", region: "Southern Europe" },
        { name: "Sri Lanka", code: "LK", continent: "Asia", region: "Southern Asia" },
        { name: "Sudan", code: "SD", continent: "Africa", region: "Northern Africa" },
        { name: "Suriname", code: "SR", continent: "South America", region: "South America" },
        { name: "Sweden", code: "SE", continent: "Europe", region: "Northern Europe" },
        { name: "Switzerland", code: "CH", continent: "Europe", region: "Western Europe" },
        { name: "Syria", code: "SY", continent: "Asia", region: "Western Asia" },
        { name: "Taiwan", code: "TW", continent: "Asia", region: "Eastern Asia" },
        { name: "Tajikistan", code: "TJ", continent: "Asia", region: "Central Asia" },
        { name: "Tanzania", code: "TZ", continent: "Africa", region: "East Africa" },
        { name: "Thailand", code: "TH", continent: "Asia", region: "Eastern Asia" },
        { name: "Timor-Leste", code: "TL", continent: "Asia", region: "Eastern Asia" },
        { name: "Togo", code: "TG", continent: "Africa", region: "West Africa" },
        { name: "Tonga", code: "TO", continent: "Australia", region: "Polynesia" },
        { name: "Trinidad and Tobago", code: "TT", continent: "North America", region: "Caribbean" },
        { name: "Tunisia", code: "TN", continent: "Africa", region: "Northern Africa" },
        { name: "Turkey", code: "TR", continent: "Asia", region: "Western Asia" },
        { name: "Turkmenistan", code: "TM", continent: "Asia", region: "Central Asia" },
        { name: "Tuvalu", code: "TV", continent: "Australia", region: "Polynesia" },
        { name: "Uganda", code: "UG", continent: "Africa", region: "East Africa" },
        { name: "Ukraine", code: "UA", continent: "Europe", region: "Eastern Europe" },
        { name: "United Arab Emirates", code: "AE", continent: "Asia", region: "Western Asia" },
        { name: "United Kingdom", code: "GB", continent: "Europe", region: "Northern Europe" },
        { name: "United States", code: "US", continent: "North America", region: "Northern America" },
        { name: "Uruguay", code: "UY", continent: "South America", region: "South America" },
        { name: "Uzbekistan", code: "UZ", continent: "Asia", region: "Central Asia" },
        { name: "Vanuatu", code: "VU", continent: "Australia", region: "Melanesia" },
        { name: "Vatican City", code: "VA", continent: "Europe", region: "Southern Europe" },
        { name: "Venezuela", code: "VE", continent: "South America", region: "South America" },
        { name: "Vietnam", code: "VN", continent: "Asia", region: "Eastern Asia" },
        { name: "Yemen", code: "YE", continent: "Asia", region: "Western Asia" },
        { name: "Zambia", code: "ZM", continent: "Africa", region: "East Africa" },
        { name: "Zimbabwe", code: "ZW", continent: "Africa", region: "East Africa" },
    ];

    const countryDataMap = new Map(
      countriesWithContinentAndRegion.map((c) => [c.name, c])
    );

    const existingCountries = await queryInterface.sequelize.query(
      'SELECT country_id, name, continent_id, region_id FROM countries',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const dbCountry of existingCountries) {
      const countryData = countryDataMap.get(dbCountry.name);
      if (countryData && (!dbCountry.continent_id || !dbCountry.region_id)) {
        const continentId = continentIdMap.get(countryData.continent);
        const regionId = regionIdMap.get(countryData.region);

        if (continentId && regionId) {
          await queryInterface.bulkUpdate(
            'countries',
            {
              continent_id: continentId,
              region_id: regionId,
              updatedAt: new Date(),
            },
            {
              country_id: dbCountry.country_id,
            }
          );
        }
      }
    }

    const existingCountryNames = new Set(
      existingCountries.map((country) => country.name)
    );
    const newCountriesData = countriesWithContinentAndRegion.filter(
      (country) => !existingCountryNames.has(country.name)
    );

    if (newCountriesData.length > 0) {
      const newCountriesToSeed = newCountriesData.map((country) => ({
        name: country.name,
        code: country.code,
        continent_id: continentIdMap.get(country.continent),
        region_id: regionIdMap.get(country.region),
        country_id: Sequelize.literal('uuid_generate_v4()'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await queryInterface.bulkInsert('countries', newCountriesToSeed, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("countries", null, {});
    await queryInterface.bulkDelete("regions", null, {});
    await queryInterface.bulkDelete("continents", null, {});
  },
};