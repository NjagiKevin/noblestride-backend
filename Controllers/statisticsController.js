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

module.exports = {
  getDashboardStatistics,
};