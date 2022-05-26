import express from "express";
import { body, header, param, validationResult } from "express-validator";
import { MonitoringJob, acceptedIntervals} from "../models/monitoringJob";

