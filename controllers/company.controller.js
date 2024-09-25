import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body
        if (!companyName) {
            return res.status(400).json({
                message: "Please enter company name",
                success: false
            });
        }

        let company = await Company.findOne({ name: companyName });

        if (company) {
            return res.status(400).json({
                message: "Company already exists",
                success: false
            });
        }

        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully",
            success: true,
            company
        });
    } catch (error) {
        console.log(error);

    }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;  //logged in userId
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(400).json({
                message: "Companies Not found",
                success: false
            });
        }
        return res.status(200).json({
            companies,
            success: true
        })


    } catch (error) {
        console.log(error);
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({
                message: "Company not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Company found",
            success: true,
            company
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        const file = req.file;

        if (!name || !description || !website || !location || !file)
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            folder: 'company_logo', // Organize files under a specific folder in Cloudinary
            resource_type: "auto", // Let Cloudinary determine the file type
            transformation: [
                { quality: "auto:good" }, // Optimize quality
                { fetch_format: "auto" }, // Use the best file format (e.g., webp, etc.)
            ],
        });

        const logo = cloudResponse.secure_url;

        const updateData = { name, description, website, location, logo };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message: "Company information updated.",
            company,
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}