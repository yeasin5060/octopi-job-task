import { Plan } from "../models/plan.model.js";


export const getPlans = async (
  req,
  res,
  next
) => {
  try {
    const plans = await Plan.find({
      isActive: true,
    }).sort({ price: 1 });

    res.json({
      success: true,
      plans,
    });
  } catch (error) {
    next(error);
  }
};

export const createPlan = async (
  req,
  res,
  next
) => {
  try {
    const plan = await Plan.create({
      name: req.body.name,
      price: req.body.price,
      currency: req.body.currency,
      billingInterval:
        req.body.billingInterval,
      features: req.body.features,
    });

    res.status(201).json({
      success: true,
      plan,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (
  req,
  res,
  next
) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    res.json({
      success: true,
      plan,
    });
  } catch (error) {
    next(error);
  }
};

export const disablePlan = async (
  req,
  res,
  next
) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      plan,
    });
  } catch (error) {
    next(error);
  }
};