const db = require("../Models");
const { createAuditLog } = require("./auditLogService");

const User = db.users;
const Deal = db.deals;
const DealLead = db.deal_leads;
const Sector = db.sectors;

const getDashboardStatistics = async (req, res) => {
  try {
    const totalDealsCount = await Deal.count();

    const dealStatusCounts = await Deal.findAll({
      attributes: [
        "status",
        [db.Sequelize.fn("COUNT", db.Sequelize.col("status")), "count"],
      ],
      group: ["status"],
    });

    const dealTypeDistribution = await Deal.findAll({
      attributes: [
        "deal_type",
        [db.Sequelize.fn("COUNT", db.Sequelize.col("deal_type")), "count"],
      ],
      group: ["deal_type"],
      where: {
        deal_type: { [db.Sequelize.Op.ne]: null }
      }
    });

    const sectorDistribution = await Deal.findAll({
      attributes: [
        [db.Sequelize.fn("COUNT", db.Sequelize.col("deal_id")), "count"],
      ],
      include: [
        {
          model: Sector,
          as: "dealSector",
          attributes: ["name"],
        },
      ],
      group: ["dealSector.sector_id", "dealSector.name"],
      where: {
        sector_id: { [db.Sequelize.Op.ne]: null }
      }
    });

    const totalDealValue = await Deal.sum("deal_size");
    const averageDealSize = await Deal.findOne({
      attributes: [[db.Sequelize.fn("AVG", db.Sequelize.col("deal_size")), "average"]],
    });

    const largestDeal = await Deal.findOne({
      order: [["deal_size", "DESC"]],
      include: [
        {
          model: DealLead,
          as: "dealLeads",
          include: [{ model: User, as: "user", attributes: ["name"] }],
        },
      ],
    });

    const dealLeadStats = await DealLead.findAll({
      attributes: [
        [db.Sequelize.fn("COUNT", db.Sequelize.col("deal_lead.id")), "dealCount"],
        [db.Sequelize.fn("SUM", db.Sequelize.col("deal.deal_size")), "totalValue"],
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: Deal,
          as: "deal",
          attributes: [],
        },
      ],
      group: ["user.id", "user.name"],
    });

    const dealsByStatusAndLead = await Deal.findAll({
      attributes: [
        "deal.deal_id",
        "deal.status",
        [db.Sequelize.fn("COUNT", db.Sequelize.col("*")), "count"],
      ],
      include: [
        {
          model: DealLead,
          as: "dealLeads",
          attributes: ["id"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      group: ["deal.deal_id", "deal.status", "dealLeads.id", "dealLeads.user.id", "dealLeads.user.name"],
    });

    const dealsByTypeAndLead = await Deal.findAll({
      attributes: [
        "deal.deal_id",
        "deal.deal_type",
        [db.Sequelize.fn("COUNT", db.Sequelize.col("*")), "count"],
      ],
      include: [
        {
          model: DealLead,
          as: "dealLeads",
          attributes: ["id"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      group: ["deal.deal_id", "deal.deal_type", "dealLeads.id", "dealLeads.user.id", "dealLeads.user.name"],
      where: {
        deal_type: { [db.Sequelize.Op.ne]: null }
      }
    });

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    const statusDistribution = {};
    dealStatusCounts.forEach((item) => {
      statusDistribution[item.status] = {
        count: parseInt(item.dataValues.count, 10),
        percentage: Math.round((parseInt(item.dataValues.count, 10) / totalDealsCount) * 100)
      };
    });

    const typeDistribution = {};
    dealTypeDistribution.forEach((item) => {
      typeDistribution[item.deal_type] = parseInt(item.dataValues.count, 10);
    });

    const topStatus = Object.keys(statusDistribution).reduce((a, b) => 
      statusDistribution[a].count > statusDistribution[b].count ? a : b
    );

    const topPerformer = dealLeadStats.length > 0 ? dealLeadStats.reduce((max, current) => 
      (parseInt(current.dataValues.dealCount) > parseInt(max.dataValues.dealCount)) ? current : max, 
      dealLeadStats[0]
    ) : null;

    const response = {
      overview: {
        totalDeals: totalDealsCount,
        totalDealValue: formatter.format(totalDealValue || 0),
        averageDealSize: formatter.format(parseFloat(averageDealSize?.dataValues.average || 0)),
        largestDeal: {
          amount: formatter.format(largestDeal?.deal_size || 0),
          dealLead: largestDeal?.dealLeads?.[0]?.user?.name || "Unknown"
        }
      },
      dealStatusDistribution: statusDistribution,
      dealTypeDistribution: typeDistribution,
      sectorDistribution: sectorDistribution.map(item => ({
        sector: item.dealSector?.name || "Unknown",
        count: parseInt(item.dataValues.count, 10)
      })),
      topMetrics: {
        topStatus: {
          status: topStatus,
          percentage: statusDistribution[topStatus]?.percentage || 0
        },
        topPerformer: topPerformer ? {
          name: topPerformer.user?.name || "Unknown",
          dealCount: parseInt(topPerformer.dataValues.dealCount || 0),
          percentage: Math.round((parseInt(topPerformer.dataValues.dealCount || 0) / totalDealsCount) * 100)
        } : null
      },
      dealsByStatusAndLead,
      dealsByTypeAndLead
    };

    await createAuditLog({
      userId: req.user.id,
      action: "GET_DASHBOARD_STATISTICS",
      details: "Fetched dashboard statistics",
      ip_address: req.ip,
    });

    res.status(200).json({
      status: true,
      statistics: response,
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const getDealValuesByLead = async (req, res) => {
  try {
    const deals = await Deal.findAll({
      include: [
        {
          model: DealLead,
          as: "dealLeads",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: User,
          as: "createdBy",
          attributes: ["id", "name"],
        },
      ],
    });

    const leadStats = deals.reduce((acc, deal) => {
      const lead = deal.dealLeads[0]?.user?.name || deal.createdBy.name;
      const size = parseFloat(deal.deal_size);

      if (!acc[lead]) {
        acc[lead] = { lead, size: 0 };
      }

      acc[lead].size += size;

      return acc;
    }, {});

    const formattedStats = Object.values(leadStats);

    res.status(200).json({
      status: true,
      statistics: formattedStats,
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const getDealStatusCounts = async (req, res) => {
  try {
    const dealStatusCounts = await Deal.findAll({
      attributes: [
        "status",
        [db.Sequelize.fn("COUNT", db.Sequelize.col("status")), "count"],
      ],
      group: ["status"],
    });

    const formattedCounts = dealStatusCounts.reduce((acc, item) => {
      const status = item.status;
      const count = parseInt(item.dataValues.count, 10);

      if (status === "Open") {
        acc.open = count;
      } else if (status === "Closed") {
        acc.closed = count;
      } else if (status === "Closed & Reopened") {
        acc["closed & reopened"] = count;
      } else if (status === "On Hold") {
        acc.onHold = count;
      }

      return acc;
    }, {});

    res.status(200).json(formattedCounts);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const getSectorDistribution = async (req, res) => {
  try {
    const deals = await Deal.findAll({
      include: [
        {
          model: Sector,
          as: "dealSector",
          attributes: ["name"],
        },
        {
          model: DealLead,
          as: "dealLeads",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: User,
          as: "createdBy",
          attributes: ["id", "name"],
        },
      ],
      where: {
        sector_id: { [db.Sequelize.Op.ne]: null }
      }
    });

    const sectorData = {};

    deals.forEach(deal => {
      const sectorName = deal.dealSector?.name;
      const leadName = deal.dealLeads?.[0]?.user?.name || deal.createdBy?.name;

      if (sectorName && leadName) {
        if (!sectorData[sectorName]) {
          sectorData[sectorName] = {};
        }

        if (!sectorData[sectorName][leadName]) {
          sectorData[sectorName][leadName] = 0;
        }

        sectorData[sectorName][leadName] += 1;
      }
    });

    res.status(200).json({
      status: true,
      sectorData
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const getDealTypeDistribution = async (req, res) => {
  try {
    const deals = await Deal.findAll({
      include: [
        {
          model: DealLead,
          as: "dealLeads",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: User,
          as: "createdBy",
          attributes: ["id", "name"],
        },
      ],
    });

    const dealTypeDistribution = deals.reduce((acc, deal) => {
      const lead = deal.dealLeads[0]?.user?.name || deal.createdBy.name;
      const dealType = deal.deal_type;

      if (!acc[dealType]) {
        acc[dealType] = { category: dealType };
      }

      if (!acc[dealType][lead]) {
        acc[dealType][lead] = 0;
      }

      acc[dealType][lead] += 1;

      return acc;
    }, {});

    const formattedDistribution = Object.values(dealTypeDistribution);

    res.status(200).json(formattedDistribution);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const getDealStatusDistribution = async (req, res) => {
  try {
    const deals = await Deal.findAll({
      include: [
        {
          model: DealLead,
          as: "dealLeads",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: User,
          as: "createdBy",
          attributes: ["id", "name"],
        },
      ],
    });

    const statusData = {};
    const allPeopleSet = new Set();

    // Collect all data and unique people
    deals.forEach(deal => {
      const lead = deal.dealLeads[0]?.user?.name || deal.createdBy.name;
      const status = deal.status;

      allPeopleSet.add(lead);

      if (!statusData[status]) {
        statusData[status] = {};
      }

      if (!statusData[status][lead]) {
        statusData[status][lead] = 0;
      }

      statusData[status][lead] += 1;
    });

    const allPeople = Array.from(allPeopleSet).sort();

    // Create rawData with arrays for each status
    const rawData = {};
    Object.keys(statusData).forEach(status => {
      rawData[status] = allPeople.map(person => statusData[status][person] || 0);
    });

    res.status(200).json({
      status: true,
      allPeople,
      rawData
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  getDashboardStatistics,
  getDealValuesByLead,
  getDealStatusCounts,
  getDealTypeDistribution,
  getSectorDistribution,
  getDealStatusDistribution,
};