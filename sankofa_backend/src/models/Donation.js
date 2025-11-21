const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

// Donation model using Supabase
class Donation {
  constructor(data) {
    Object.assign(this, data);
  }

  // Create new donation
  static async create(donationData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('donations')
        .insert([donationData])
        .select()
        .single();

      if (error) throw error;
      return new Donation(data);
    } catch (error) {
      logger.error('Error creating donation:', error);
      throw error;
    }
  }

  // Find donation by ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('donations')
        .select('*, donor:users!donor_id(id, name, email)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? new Donation(data) : null;
    } catch (error) {
      logger.error('Error finding donation:', error);
      return null;
    }
  }

  // Find all donations with filters
  static async find(filter = {}, options = {}) {
    try {
      let query = supabaseAdmin
        .from('donations')
        .select('*, donor:users!donor_id(id, name, email)', { count: 'exact' });

      // Apply filters
      if (filter.donor_id) query = query.eq('donor_id', filter.donor_id);
      if (filter.type) query = query.eq('type', filter.type);
      if (filter.status) query = query.eq('status', filter.status);

      // Apply sorting
      const sortField = options.sort || 'created_at';
      const sortOrder = options.order || 'desc';
      query = query.order(sortField, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (options.limit) query = query.limit(options.limit);

      const { data, error, count } = await query;

      if (error) throw error;
      return {
        donations: data.map(item => new Donation(item)),
        total: count
      };
    } catch (error) {
      logger.error('Error finding donations:', error);
      throw error;
    }
  }

  // Update donation
  static async findByIdAndUpdate(id, updateData, options = {}) {
    try {
      const { data, error } = await supabaseAdmin
        .from('donations')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new Donation(data) : null;
    } catch (error) {
      logger.error('Error updating donation:', error);
      throw error;
    }
  }

  // Delete donation
  static async findByIdAndDelete(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('donations')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? new Donation(data) : null;
    } catch (error) {
      logger.error('Error deleting donation:', error);
      throw error;
    }
  }

  // Get donation statistics
  static async getStats() {
    try {
      const { data, error } = await supabaseAdmin
        .from('donations')
        .select('*');

      if (error) throw error;

      const stats = {
        total: data.length,
        totalAmount: data.reduce((sum, don) => sum + parseFloat(don.amount || 0), 0),
        byType: data.reduce((acc, don) => {
          acc[don.type] = (acc[don.type] || 0) + 1;
          return acc;
        }, {}),
        byStatus: data.reduce((acc, don) => {
          const status = don.payment?.status || don.status;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {}),
        recurring: data.filter(d => d.type !== 'one-time').length
      };

      return stats;
    } catch (error) {
      logger.error('Error getting donation stats:', error);
      throw error;
    }
  }

  // Generate comprehensive impact report for a donation
  static async generateImpactReport(donation) {
    try {
      if (!donation || !donation.id) {
        throw new Error('Invalid donation object');
      }

      const donationAmount = parseFloat(donation.amount || 0);
      const currency = donation.currency || 'GHS';

      // Environmental Impact Calculations
      // Based on: 1 GHS ≈ 0.5kg plastic collected (approximation)
      const plasticEquivalentKg = (donationAmount * 0.5).toFixed(2);
      const co2SavedKg = (plasticEquivalentKg * 0.2).toFixed(2); // 1kg plastic = 0.2kg CO2
      const waterSavedLiters = (plasticEquivalentKg * 4).toFixed(2); // 1kg plastic = 4L water
      const energySavedKwh = (plasticEquivalentKg * 1.5).toFixed(2); // 1kg plastic = 1.5kWh

      // Calculate how many collections this donation has funded
      // Average collection payment: 10 GHS
      const avgCollectionPayment = 10;
      const collectionsFunded = Math.floor(donationAmount / avgCollectionPayment);

      // Fetch actual collections data to show real impact (if allocation exists)
      let actualCollectionsImpact = null;
      if (donation.allocation && donation.allocation.collections) {
        try {
          const collectionIds = donation.allocation.collections;
          const { data: collections, error: collError } = await supabaseAdmin
            .from('collections')
            .select('weight, plastic_type, location, collector_id, created_at')
            .in('id', collectionIds);

          if (!collError && collections && collections.length > 0) {
            const totalWeight = collections.reduce((sum, c) => sum + parseFloat(c.weight || 0), 0);
            const actualCO2Saved = (totalWeight * 0.2).toFixed(2);
            const actualWaterSaved = (totalWeight * 4).toFixed(2);
            const actualEnergySaved = (totalWeight * 1.5).toFixed(2);

            // Plastic type breakdown
            const plasticBreakdown = collections.reduce((acc, c) => {
              acc[c.plastic_type] = (acc[c.plastic_type] || 0) + parseFloat(c.weight || 0);
              return acc;
            }, {});

            // Location breakdown
            const locationBreakdown = collections.reduce((acc, c) => {
              const loc = c.location?.city || c.location?.region || 'Unknown';
              acc[loc] = (acc[loc] || 0) + 1;
              return acc;
            }, {});

            // Unique collectors helped
            const uniqueCollectors = [...new Set(collections.map(c => c.collector_id))].length;

            actualCollectionsImpact = {
              total_collections: collections.length,
              total_weight_kg: parseFloat(totalWeight.toFixed(2)),
              co2_saved_kg: parseFloat(actualCO2Saved),
              water_saved_liters: parseFloat(actualWaterSaved),
              energy_saved_kwh: parseFloat(actualEnergySaved),
              plastic_breakdown: plasticBreakdown,
              location_breakdown: locationBreakdown,
              collectors_supported: uniqueCollectors,
              time_period: {
                from: collections[collections.length - 1].created_at,
                to: collections[0].created_at
              }
            };
          }
        } catch (err) {
          logger.error('Error fetching actual collections impact:', err);
        }
      }

      // Health Impact Estimation
      // Based on: Reduced plastic pollution → reduced disease risk
      // Estimate: 1kg plastic removed = 0.1 points risk reduction in surrounding area
      const estimatedRiskReduction = (plasticEquivalentKg * 0.1).toFixed(2);
      const estimatedPeopleHelped = Math.floor(plasticEquivalentKg * 2); // Rough estimate: 1kg affects 2 people

      // Fetch health data for areas where donation funded collections
      let healthImpact = null;
      if (actualCollectionsImpact && actualCollectionsImpact.location_breakdown) {
        try {
          const locations = Object.keys(actualCollectionsImpact.location_breakdown);
          const { data: healthData, error: healthError } = await supabaseAdmin
            .from('health_data')
            .select('risk_level, diseases, location, created_at')
            .gte('created_at', donation.created_at)
            .limit(50);

          if (!healthError && healthData && healthData.length > 0) {
            // Filter health data for relevant locations
            const relevantHealthData = healthData.filter(h => {
              const hLoc = h.location?.city || h.location?.region;
              return locations.some(loc => hLoc && hLoc.includes(loc));
            });

            if (relevantHealthData.length > 0) {
              const avgRiskLevel = relevantHealthData.reduce((sum, h) => 
                sum + (h.risk_level || 50), 0
              ) / relevantHealthData.length;

              const diseaseCount = {};
              relevantHealthData.forEach(h => {
                (h.diseases || []).forEach(disease => {
                  diseaseCount[disease] = (diseaseCount[disease] || 0) + 1;
                });
              });

              healthImpact = {
                areas_monitored: locations.length,
                health_assessments: relevantHealthData.length,
                average_risk_level: parseFloat(avgRiskLevel.toFixed(2)),
                diseases_tracked: Object.keys(diseaseCount).length,
                most_common_diseases: Object.entries(diseaseCount)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([disease, count]) => ({ disease, occurrences: count }))
              };
            }
          }
        } catch (err) {
          logger.error('Error fetching health impact:', err);
        }
      }

      // Community Impact
      const communityImpact = {
        collectors_supported: actualCollectionsImpact?.collectors_supported || Math.floor(collectionsFunded / 3),
        estimated_families_helped: Math.floor(collectionsFunded / 2),
        jobs_sustained_days: collectionsFunded, // Each collection = 1 day of work
        economic_value_ghs: parseFloat((donationAmount * 1.5).toFixed(2)) // Multiplier effect
      };

      // Calculate donation efficiency
      const efficiency = {
        cost_per_kg_plastic: donationAmount > 0 ? (donationAmount / parseFloat(plasticEquivalentKg)).toFixed(2) : 0,
        co2_reduction_per_ghs: donationAmount > 0 ? (parseFloat(co2SavedKg) / donationAmount).toFixed(3) : 0,
        collections_per_ghs: donationAmount > 0 ? (collectionsFunded / donationAmount).toFixed(2) : 0
      };

      // Generate narrative summary
      const summary = this.generateImpactNarrative(donation, {
        plasticEquivalentKg,
        co2SavedKg,
        collectionsFunded,
        actualCollectionsImpact,
        healthImpact,
        estimatedPeopleHelped
      });

      // Comparison with average donation
      const avgDonationAmount = 50; // GHS
      const comparisonFactor = (donationAmount / avgDonationAmount).toFixed(2);

      return {
        donation_details: {
          id: donation.id,
          amount: donationAmount,
          currency,
          type: donation.type,
          date: donation.created_at,
          status: donation.status
        },
        environmental_impact: {
          estimated: {
            plastic_collected_kg: parseFloat(plasticEquivalentKg),
            co2_saved_kg: parseFloat(co2SavedKg),
            water_saved_liters: parseFloat(waterSavedLiters),
            energy_saved_kwh: parseFloat(energySavedKwh)
          },
          actual: actualCollectionsImpact
        },
        social_impact: {
          collections_funded: collectionsFunded,
          community_impact: communityImpact,
          health_impact: healthImpact || {
            estimated_risk_reduction: parseFloat(estimatedRiskReduction),
            estimated_people_helped: estimatedPeopleHelped
          }
        },
        efficiency_metrics: efficiency,
        comparison: {
          vs_average_donation: `${comparisonFactor}x average`,
          impact_level: comparisonFactor >= 2 ? 'exceptional' : comparisonFactor >= 1 ? 'above_average' : 'standard'
        },
        summary,
        generated_at: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error generating impact report:', error);
      throw error;
    }
  }

  // Helper method to generate narrative summary
  static generateImpactNarrative(donation, metrics) {
    const {
      plasticEquivalentKg,
      co2SavedKg,
      collectionsFunded,
      actualCollectionsImpact,
      healthImpact,
      estimatedPeopleHelped
    } = metrics;

    const narratives = [];

    // Opening statement
    narratives.push(`Your generous donation of ${donation.amount} ${donation.currency} is making a real difference in Ghana!`);

    // Environmental impact
    if (actualCollectionsImpact) {
      narratives.push(
        `So far, your donation has funded ${actualCollectionsImpact.total_collections} plastic collections, ` +
        `removing ${actualCollectionsImpact.total_weight_kg}kg of plastic from the environment.`
      );
      narratives.push(
        `This has prevented ${actualCollectionsImpact.co2_saved_kg}kg of CO2 emissions and saved ` +
        `${actualCollectionsImpact.water_saved_liters} liters of water.`
      );
    } else {
      narratives.push(
        `Your contribution can fund approximately ${collectionsFunded} plastic collections, ` +
        `removing an estimated ${plasticEquivalentKg}kg of plastic waste.`
      );
      narratives.push(
        `This prevents approximately ${co2SavedKg}kg of CO2 emissions - equivalent to taking a car off the road for several days!`
      );
    }

    // Community impact
    if (actualCollectionsImpact && actualCollectionsImpact.collectors_supported) {
      narratives.push(
        `You've directly supported ${actualCollectionsImpact.collectors_supported} waste collectors, ` +
        `providing them with sustainable income.`
      );
    }

    // Health impact
    if (healthImpact && healthImpact.areas_monitored) {
      narratives.push(
        `Health monitoring in ${healthImpact.areas_monitored} communities shows your impact is being tracked ` +
        `and measured to ensure maximum effectiveness.`
      );
    } else {
      narratives.push(
        `By reducing plastic pollution, you're helping improve health outcomes for an estimated ` +
        `${estimatedPeopleHelped} people in the affected communities.`
      );
    }

    // Closing statement
    if (donation.type !== 'one-time') {
      narratives.push(
        `As a recurring donor, your continued support creates lasting change. Thank you for your commitment!`
      );
    } else {
      narratives.push(
        `Thank you for your support! Consider becoming a recurring donor to create even greater long-term impact.`
      );
    }

    return narratives;
  }

  // Get aggregate impact across all donations
  static async getAggregateImpact(timeRange = 'all', status = 'completed') {
    try {
      let query = supabaseAdmin
        .from('donations')
        .select('*');

      // Filter by status
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Filter by time range
      if (timeRange !== 'all') {
        const now = new Date();
        let startDate;

        switch (timeRange) {
          case '7d':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case '30d':
            startDate = new Date(now.setDate(now.getDate() - 30));
            break;
          case '90d':
            startDate = new Date(now.setDate(now.getDate() - 90));
            break;
          case '1y':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
          default:
            startDate = null;
        }

        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }

      const { data: donations, error } = await query;

      if (error) throw error;

      if (!donations || donations.length === 0) {
        return {
          time_range: timeRange,
          status_filter: status,
          total_donations: 0,
          message: 'No donations found for the specified criteria'
        };
      }

      // Calculate total amounts
      const totalAmount = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
      const avgDonation = totalAmount / donations.length;

      // Environmental impact calculations
      const totalPlasticEquivalent = (totalAmount * 0.5).toFixed(2); // 1 GHS ≈ 0.5kg plastic
      const totalCO2Saved = (totalPlasticEquivalent * 0.2).toFixed(2);
      const totalWaterSaved = (totalPlasticEquivalent * 4).toFixed(2);
      const totalEnergySaved = (totalPlasticEquivalent * 1.5).toFixed(2);

      // Calculate collections funded
      const avgCollectionPayment = 10;
      const totalCollectionsFunded = Math.floor(totalAmount / avgCollectionPayment);

      // Get actual collection data from allocations
      let actualCollectionData = null;
      const allCollectionIds = [];
      
      donations.forEach(d => {
        if (d.allocation && d.allocation.collections) {
          allCollectionIds.push(...d.allocation.collections);
        }
      });

      if (allCollectionIds.length > 0) {
        try {
          const { data: collections, error: collError } = await supabaseAdmin
            .from('collections')
            .select('weight, plastic_type, location, collector_id, status, created_at')
            .in('id', allCollectionIds);

          if (!collError && collections && collections.length > 0) {
            const totalActualWeight = collections.reduce((sum, c) => 
              sum + parseFloat(c.weight || 0), 0
            );

            const actualCO2 = (totalActualWeight * 0.2).toFixed(2);
            const actualWater = (totalActualWeight * 4).toFixed(2);
            const actualEnergy = (totalActualWeight * 1.5).toFixed(2);

            // Plastic type distribution
            const plasticTypeBreakdown = collections.reduce((acc, c) => {
              acc[c.plastic_type] = (acc[c.plastic_type] || 0) + parseFloat(c.weight || 0);
              return acc;
            }, {});

            // Location distribution
            const locationBreakdown = collections.reduce((acc, c) => {
              const loc = c.location?.city || c.location?.region || 'Unknown';
              if (!acc[loc]) acc[loc] = { count: 0, weight: 0 };
              acc[loc].count++;
              acc[loc].weight += parseFloat(c.weight || 0);
              return acc;
            }, {});

            // Unique collectors
            const uniqueCollectors = [...new Set(collections.map(c => c.collector_id))].length;

            // Status breakdown
            const statusBreakdown = collections.reduce((acc, c) => {
              acc[c.status] = (acc[c.status] || 0) + 1;
              return acc;
            }, {});

            actualCollectionData = {
              total_collections: collections.length,
              total_weight_kg: parseFloat(totalActualWeight.toFixed(2)),
              co2_saved_kg: parseFloat(actualCO2),
              water_saved_liters: parseFloat(actualWater),
              energy_saved_kwh: parseFloat(actualEnergy),
              plastic_type_breakdown: plasticTypeBreakdown,
              location_distribution: locationBreakdown,
              collectors_supported: uniqueCollectors,
              collection_status: statusBreakdown,
              avg_weight_per_collection: parseFloat((totalActualWeight / collections.length).toFixed(2))
            };
          }
        } catch (err) {
          logger.error('Error fetching aggregate collection data:', err);
        }
      }

      // Donor statistics
      const uniqueDonors = [...new Set(donations.map(d => d.donor_id).filter(Boolean))].length;
      const recurringDonations = donations.filter(d => d.type !== 'one-time').length;
      const recurringPercentage = ((recurringDonations / donations.length) * 100).toFixed(1);

      // Donation type breakdown
      const typeBreakdown = donations.reduce((acc, d) => {
        acc[d.type] = (acc[d.type] || 0) + 1;
        return acc;
      }, {});

      // Monthly trend (if time range allows)
      const monthlyTrend = {};
      donations.forEach(d => {
        const month = d.created_at.substring(0, 7); // YYYY-MM
        if (!monthlyTrend[month]) {
          monthlyTrend[month] = { count: 0, amount: 0 };
        }
        monthlyTrend[month].count++;
        monthlyTrend[month].amount += parseFloat(d.amount || 0);
      });

      const sortedMonths = Object.entries(monthlyTrend)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, data]) => ({
          month,
          donations: data.count,
          total_amount: parseFloat(data.amount.toFixed(2)),
          avg_amount: parseFloat((data.amount / data.count).toFixed(2))
        }));

      // Calculate growth rate
      let growthRate = null;
      if (sortedMonths.length >= 2) {
        const latestMonth = sortedMonths[sortedMonths.length - 1];
        const previousMonth = sortedMonths[sortedMonths.length - 2];
        const amountChange = latestMonth.total_amount - previousMonth.total_amount;
        growthRate = previousMonth.total_amount > 0
          ? ((amountChange / previousMonth.total_amount) * 100).toFixed(1) + '%'
          : 'N/A';
      }

      // Community impact estimation
      const estimatedFamiliesHelped = Math.floor(totalCollectionsFunded / 2);
      const estimatedJobsDays = totalCollectionsFunded;
      const economicMultiplier = 1.5;
      const totalEconomicValue = (totalAmount * economicMultiplier).toFixed(2);

      // Health impact estimation
      const estimatedPeopleHelped = Math.floor(parseFloat(totalPlasticEquivalent) * 2);
      const estimatedRiskReduction = (parseFloat(totalPlasticEquivalent) * 0.1).toFixed(2);

      // Top donors
      const donorAmounts = {};
      donations.forEach(d => {
        if (d.donor_id) {
          donorAmounts[d.donor_id] = (donorAmounts[d.donor_id] || 0) + parseFloat(d.amount || 0);
        }
      });

      const topDonors = Object.entries(donorAmounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([donor_id, amount]) => ({ donor_id, total_donated: parseFloat(amount.toFixed(2)) }));

      return {
        summary: {
          time_range: timeRange,
          status_filter: status,
          total_donations: donations.length,
          total_amount_ghs: parseFloat(totalAmount.toFixed(2)),
          average_donation_ghs: parseFloat(avgDonation.toFixed(2)),
          unique_donors: uniqueDonors,
          recurring_donations: recurringDonations,
          recurring_percentage: `${recurringPercentage}%`
        },
        environmental_impact: {
          estimated: {
            plastic_collected_kg: parseFloat(totalPlasticEquivalent),
            co2_saved_kg: parseFloat(totalCO2Saved),
            water_saved_liters: parseFloat(totalWaterSaved),
            energy_saved_kwh: parseFloat(totalEnergySaved)
          },
          actual: actualCollectionData,
          equivalents: {
            trees_planted_equivalent: Math.floor(parseFloat(totalCO2Saved) / 20), // ~20kg CO2 per tree/year
            cars_off_road_days: Math.floor(parseFloat(totalCO2Saved) / 4), // ~4kg CO2 per car/day
            households_water_daily: Math.floor(parseFloat(totalWaterSaved) / 200) // ~200L per household/day
          }
        },
        social_impact: {
          collections_funded: totalCollectionsFunded,
          collectors_supported: actualCollectionData?.collectors_supported || Math.floor(totalCollectionsFunded / 3),
          estimated_families_helped: estimatedFamiliesHelped,
          jobs_sustained_days: estimatedJobsDays,
          economic_value_ghs: parseFloat(totalEconomicValue),
          health_impact: {
            estimated_people_helped: estimatedPeopleHelped,
            estimated_risk_reduction_points: parseFloat(estimatedRiskReduction)
          }
        },
        donation_breakdown: {
          by_type: typeBreakdown,
          monthly_trend: sortedMonths,
          growth_rate: growthRate,
          top_donors: topDonors
        },
        generated_at: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting aggregate impact:', error);
      throw error;
    }
  }

  // Instance method to convert to JSON
  toJSON() {
    return { ...this };
  }
}

module.exports = Donation;
