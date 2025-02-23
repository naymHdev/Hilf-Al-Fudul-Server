import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";

const app: Application = express();