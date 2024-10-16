const knex = require("knex");
const knexConfig = require("../../knexfile");
const db = knex(knexConfig.development);
const { createNotification } = require("../utils/notificationService");

const getJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await db("jobs").where({ id }).first();
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getJobs = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  console.log(userId);

  try {
    let jobs;

    if (userRole === "admin") {
      // Admin can see all jobs
      jobs = await db("jobs")
        .join("customers", "jobs.customer_id", "customers.id")
        .select(
          "jobs.*",
          "customers.name as customer_name",
          "customers.contact_details as customer_contact",
          "customers.address as customer_address"
        );
    } else if (userRole === "fitter") {
      jobs = await db("jobs")
        .where("jobs.fitter_id", userId)
        .join("customers", "jobs.customer_id", "customers.id")
        .select(
          "jobs.*",
          "customers.name as customer_name",
          "customers.contact_details as customer_contact",
          "customers.address as customer_address"
        );
    } else {
      return res
        .status(403)
        .json({ message: "You do not have permission to view these jobs" });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { customer_id, status, start_date, end_date } = req.body;
  try {
    const updatedRows = await db("jobs").where({ id }).update({
      customer_id,
      status,
      start_date,
      end_date,
    });

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ message: "Job not found or no changes made" });
    }

    res.status(200).json({ message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await db("jobs").where({ id }).del();
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createJob = async (req, res) => {
  const { customer_id } = req.body;
  try {
    const result = await db("jobs")
      .insert({
        customer_id,
        status: "unassigned",
      })
      .returning("id");

    if (!Array.isArray(result) || result.length === 0) {
      return res.status(500).json({ message: "Failed to create job" });
    }

    const job_id = result[0];
    res.status(201).json({ message: "Job created successfully", job_id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const assignJobToFitter = async (req, res) => {
  const { jobId, fitterId } = req.body;
  try {
    await db("jobs")
      .where({ id: jobId })
      .update({ fitter_id: fitterId, status: "assigned" });

    // Create a notification for the fitter
    const message = `You have been assigned a new job (ID: ${jobId}).`;
    await createNotification(jobId, fitterId, message, "job_assignment");

    res.status(200).json({ message: "Job assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const proposeDates = async (req, res) => {
  const { jobId, startDate, endDate } = req.body;
  const fitterId = req.user.id;

  try {
    await db("job_proposals").insert({
      job_id: jobId,
      proposed_by: "fitter",
      start_date: startDate,
      end_date: endDate,
      status: "pending",
    });

    // Notify admins about the date proposal
    const admins = await db("users").where({ role: "admin" }).select("id");
    for (const admin of admins) {
      const message = `Fitter has proposed new dates for job (ID: ${jobId}).`;
      await createNotification(jobId, admin.id, message, "date_proposal");
    }

    res.status(200).json({ message: "Date proposal submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const acceptProposal = async (req, res) => {
  const { proposalId } = req.body;
  try {
    const proposal = await db("job_proposals")
      .where({ id: proposalId, status: "pending" })
      .first();
    if (!proposal) {
      return res
        .status(404)
        .json({ message: "Proposal not found or already processed" });
    }

    // Update the job with the accepted dates
    await db("jobs").where({ id: proposal.job_id }).update({
      start_date: proposal.start_date,
      end_date: proposal.end_date,
      status: "accepted",
    });

    // Mark the proposal as accepted
    await db("job_proposals")
      .where({ id: proposalId })
      .update({ status: "accepted" });

    // Notify the fitter about the accepted proposal
    const fitter = await db("jobs")
      .where({ id: proposal.job_id })
      .select("fitter_id")
      .first();
    if (fitter) {
      const message = `Your proposed dates for job (ID: ${proposal.job_id}) have been accepted.`;
      await createNotification(
        proposal.job_id,
        fitter.fitter_id,
        message,
        "proposal_accepted"
      );
    }

    res.status(200).json({ message: "Proposal accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createRemedial = async (req, res) => {
  const { jobId, description } = req.body;
  const fitterId = req.user.id;

  try {
    const job = await db("jobs")
      .where({ id: jobId, fitter_id: fitterId })
      .first();
    if (!job) {
      return res
        .status(403)
        .json({ message: "You are not assigned to this job" });
    }

    const result = await db("remedials")
      .insert({
        job_id: jobId,
        fitter_id: fitterId,
        description,
        status: "pending",
      })
      .returning("id");

    if (!Array.isArray(result) || result.length === 0) {
      return res.status(500).json({ message: "Failed to create remedial" });
    }

    const remedial_id = result[0];

    // Update the job status to 'remedial_pending'
    await db("jobs")
      .where({ id: jobId })
      .update({ status: "remedial_pending" });

    // Notify admin about the remedial creation
    const admins = await db("users").where({ role: "admin" }).select("id");
    for (const admin of admins) {
      const message = `A new remedial has been created for job (ID: ${jobId}) by fitter (ID: ${fitterId}).`;
      await createNotification(jobId, admin.id, message, "remedial_creation");
    }

    res
      .status(201)
      .json({ message: "Remedial created successfully", remedial_id });
  } catch (error) {
    console.error("Error during remedial creation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const markRemedialAsCompleted = async (req, res) => {
  const { remedialId } = req.body;
  const fitterId = req.user.id;

  try {
    const updatedRows = await db("remedials")
      .where({ id: remedialId, fitter_id: fitterId })
      .update({ status: "completed" });

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ message: "Remedial not found or you do not have permission" });
    }

    // Check if all remedials for the job are completed
    const remedial = await db("remedials").where({ id: remedialId }).first();
    const incompleteRemedials = await db("remedials")
      .where({ job_id: remedial.job_id, status: "pending" })
      .count("id as count")
      .first();

    // If no pending remedials, update the job status to 'finished'
    if (incompleteRemedials.count === 0) {
      await db("jobs")
        .where({ id: remedial.job_id })
        .update({ status: "finished" });

      // Notify admin that the job is now marked as finished
      const admins = await db("users").where({ role: "admin" }).select("id");
      for (const admin of admins) {
        const message = `All remedials for job (ID: ${remedial.job_id}) have been completed. Job is now marked as finished.`;
        await createNotification(
          remedial.job_id,
          admin.id,
          message,
          "job_finished"
        );
      }
    }

    res.status(200).json({ message: "Remedial marked as completed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createJob,
  getJob,
  getJobs,
  updateJob,
  deleteJob,
  assignJobToFitter,
  proposeDates,
  acceptProposal,
  createRemedial,
  markRemedialAsCompleted,
};
